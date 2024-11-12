import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import { toast } from "react-toastify";

function ProductChild() {
    const [productName, setProductName] = useState('');
    const [variants, setVariants] = useState([{ name: '', quantity: '', price: '' }]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [expirationDate, setExpirationDate] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [customerFound, setIsCustomerFound] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [customerName, setCustomerName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesSnapshot = await getDocs(collection(db, 'categories'));
                const customerSnapshot = await getDocs(collection(db, 'customerusers'));

                setCategories(categoriesSnapshot.docs.map(doc => doc.data().categoryName));
                setCustomer(customerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching data: ", error);
                toast.error("Failed to load data");
            }
        };
        fetchData();
    }, []);

    const handleCustomerChange = (customerId) => {
        setSelectedCustomer(customerId);
        const selectedCustomerData = customer.find(c => c.id === customerId);
        if (selectedCustomerData) {
            setCustomerName(selectedCustomerData.name);
            setIsCustomerFound(true);
        } else {
            setCustomerName('');
            setIsCustomerFound(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) return toast.error('Enter a product name to search.', { position: "top-center" });
    
        setLoading(true);
        const q = query(collection(db, 'products'), where('name', '==', searchQuery));
        const querySnapshot = await getDocs(q);
        const product = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];
    
        if (product) {
            setProductName(product.name);
            setVariants(product.variants || [{ name: '', quantity: '', price: '' }]);
            setExpirationDate(product.expirationDate || '');
            setEditProductId(product.id);
            setSelectedCategory(product.category || '');
            
            const supplier = customer.find(c => c.name === product.supplier); 
            if (supplier) {
                setSelectedCustomer(supplier.id); 
                setCustomerName(supplier.name); 
                setIsCustomerFound(true);
            } else {
                setSelectedCustomer('');
                setCustomerName('');
                setIsCustomerFound(false);
            }
        } else {
            toast.error('Product not found!', { position: "top-center" });
            setProductName('');
            setVariants([{ name: '', quantity: '', price: '' }]);
            setExpirationDate('');
            setEditProductId(null);
            setSelectedCategory('');
            setSelectedCustomer(''); 
            setCustomerName('');
            setIsCustomerFound(false);
        }
        setLoading(false);
    };
    

    const handleSave = async () => {
        if (!selectedCustomer) return toast.warning('Please select a supplier name.', { position: "top-center" });
        if (!productName || !expirationDate) return toast.warning('Please fill all fields.', { position: "top-center" });
        if (!selectedCategory) return toast.warning('Please select a category.', { position: "top-center" });
    
        const isValidVariants = variants.every(variant => variant.name && variant.quantity > 0 && variant.price >= 0);
        if (!isValidVariants) return toast.warning('All variants must have valid name, quantity, and price.', { position: "top-center" });
    
        setLoading(true);
        try {
            const supplierName = customer.find(c => c.id === selectedCustomer)?.name; 
    
            if (editProductId) {
                await updateDoc(doc(db, 'products', editProductId), {
                    name: productName,
                    variants,
                    expirationDate,
                    category: selectedCategory,
                    supplier: supplierName,
                });
                toast.success("Product updated successfully!");
            } else {
                const q = query(collection(db, 'products'), where('name', '==', productName));
                if (!(await getDocs(q)).empty) return toast.error("Product name already exists.");
    
                await addDoc(collection(db, 'products'), {
                    name: productName,
                    variants,
                    expirationDate,
                    category: selectedCategory,
                    supplier: supplierName,
                });
                toast.success("Product added successfully!");
            }
    
            setProductName('');
            setVariants([{ name: '', quantity: '', price: '' }]);
            setExpirationDate('');
            setEditProductId(null);
            setSelectedCategory('');
            setSelectedCustomer('');
            setCustomerName('');
        } catch (error) {
            console.error("Error saving product: ", error);
            toast.error("Failed to save product.");
        } finally {
            setLoading(false);
        }
    };
    
    

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...variants];
        if (field === 'quantity' && (isNaN(value) || value < 1)) return toast.error('Quantity must be a positive number.');
        if (field === 'price' && (isNaN(value) || value < 0)) return toast.error('Price must be a positive number.');

        updatedVariants[index][field] = value;
        setVariants(updatedVariants);

        if (index === variants.length - 1 && value) setVariants([...variants, { name: '', quantity: '', price: '' }]);
    };

    const handleRemoveVariant = (index) => setVariants(variants.filter((_, i) => i !== index));

    return (
        <div className='bg-[#185519] w-full p-5 rounded-xl '>
            <div>
                <div className="grid-cols-1 grid lg:flex  w-full justify-between ">
                    <div className='flex items-center '>
                        <h1 className='w-full text-left uppercase text-white' >Changing or adding product</h1>

                    </div>
                    <div className='flex  mt-4 xl:mt-0'>
                        <input
                            className="bg-gray-200 w-full rounded-l-md text-lg px-3 outline-none py-2 "
                            type="search"
                            placeholder="Search product name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="px-3 pr-4 bg-gray-200 py-2  rounded-r-md" onClick={handleSearch}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                                <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className='flex items-center mt-5'>
                        <select
                            className="form-control w-full py-2 px-3 text-black rounded-md text-lg bg-gray-200"
                            value={selectedCustomer}
                            onChange={(e) => handleCustomerChange(e.target.value)}
                        >
                            <option value="">Select Supplier Name</option>
                            {customer.map((customer) => (
                                <option key={customer.id} value={customer.id}>{customer.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='grid grid-cols-1 xl:flex mt-1 items-end gap-4'>

                        <div className='w-full'>
                            <input
                                className="w-full bg-gray-200 rounded-md text-lg px-3 py-2"
                                placeholder="Item Name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                disabled={!selectedCustomer}
                                required
                            />
                        </div>
                        <div className='flex h-full'>
                            <select
                                className="form-control py-2 w-full px-3 text-black pr-2 rounded-md text-lg bg-gray-200"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                disabled={!selectedCustomer} 
                                required
                            >
                                <option value="" disabled>Select Category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category} className="text-black">
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <div className='text-base text-left pl-3 text-white'>Expiration date</div>
                            <input
                                className='text-lg bg-gray-200 px-3 py-2 w-full  rounded-md'
                                type='date'
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {variants.map((variant, index) => (
                        <div className="grid grid-cols-1 xl:flex gap-3 mt-5 " key={index}>
                            <input
                                className="w-full bg-gray-200 rounded-md text-lg px-3 py-2"
                                placeholder="Variant Name"
                                value={variant.name}
                                onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                            />
                            <input
                                className="w-full xl:w-[40%] bg-gray-200 rounded-md text-lg px-3 py-2 "
                                placeholder="Quantity"
                                type="number"
                                value={variant.quantity}
                                onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                            />
                            
                            <div className='flex bg-gray-200 rounded-md '>
                                <div className='flex content-center items-center pl-2'>
                                    <div className='text-lg text-center'>PHP</div>
                                </div>
                                <input
                                    className=" bg-gray-200 focus:outline-none w-full rounded-md text-lg px-3 py-2"
                                    placeholder="Price"
                                    type="number"
                                    value={variant.price}
                                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                />
                            </div>
                            {index > 0 && (
                                <button
                                    className="flex justify-center items-center ml-4 text-red-500"
                                    onClick={() => handleRemoveVariant(index)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                    <div className="flex gap-4 justify-end mt-5 text-lg">
                        <button
                            className={`bg-green-700 px-4 py-2 rounded-md font-bold drop-shadow-md text-white ${loading ? 'opacity-50 cursor-not-allowed' : 'bg-blue-600 '}`}
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (editProductId ? 'Update' : 'Save')}
                        </button>
                
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductChild;
