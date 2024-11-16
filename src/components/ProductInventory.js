import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import LoadingButtons from './LoadingButtons';

function ProductInventory() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [outStockValues, setOutStockValues] = useState({});
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const productList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProducts(productList);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleProductChange = (event) => {
        const productName = event.target.value;
        const product = products.find((prod) => prod.name === productName);
        setSelectedProduct(product || null);
        setOutStockValues({});
    };

    const handleOutStockChange = (variantId, event) => {
        setOutStockValues(prevState => ({
            ...prevState,
            [variantId]: event.target.value
        }));
    };

    const handleSave = async () => {
        let valid = true;
        setLoading(true);
    
        // Fetch the current product data from Firestore
        const productRef = doc(db, 'products', selectedProduct.id);
        const productSnapshot = await getDoc(productRef);
    
        if (!productSnapshot.exists()) {
            toast.error("Product not found!");
            setLoading(false);
            return;
        }
    
        const productData = productSnapshot.data();
    
        const updatedVariants = selectedProduct.variants.map((variant) => {
            const outStock = parseInt(outStockValues[variant.id] || 0, 10);
            const inStock = variant.quantity;
    
            // Check if the outStock value is valid
            if (outStock <= 0) {
                valid = false;
                toast.error(`Out stock must be greater than 0 for ${variant.name}`);
                setLoading(false);
                return null;
            }
            if (outStock > inStock) {
                valid = false;
                toast.error(`Out stock cannot be greater than in stock for ${variant.name}`);
                setLoading(false);
                return null;
            }
    
            // Calculate new quantity by subtracting the outStock from inStock
            const newQuantity = inStock - outStock;
    
            // Get the current outStock from Firestore, or default to 0
            const existingOutStock = productData.variants.find(v => v.id === variant.id)?.outStock || 0;
            
            // Add the current outStock to the existing outStock value (accumulating the outStock)
            const updatedOutStock = existingOutStock + outStock;
    
            return {
                ...variant,
                quantity: newQuantity,  // Update the quantity
                outStock: updatedOutStock,  // Add to outStock, keeping it cumulative
            };
        });
    
        if (valid) {
            try {
                // Update Firestore with the new variants data
                await updateDoc(productRef, {
                    variants: updatedVariants,
                });
    
                toast.success('Out stock and quantity updated successfully!');
                setLoading(false);
            } catch (error) {
                console.error('Error updating product variants:', error);
                toast.error('Failed to update product variants.');
                setLoading(false);
            }
        }
    };
    
    
    





    return (
        <div className='bg-[#185519] rounded-md bg-opacity-80 backdrop-blur-sm text-2xl text-white p-5 w-full'>
            <div className='flex w-full justify-between'>
                <div>Product Inventory</div>
                <div className='flex'>
                    <div className='mr-5 flex text-black '>
                        <select className='px-3 rounded-md text-base h-full' onChange={handleProductChange}>
                            <option value="">Select a product</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.name}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className='flex mt-5 justify-start items-start content-start text-xl'>
                <div className='text-left flex flex-col justify-start items-start content-start ml-5 w-full'>
                    <div className='bg-[#185519] flex p-3 rounded-md drop-shadow-md'>
                        <div>Supplier Name: {selectedProduct?.supplier || ''}</div>
                    </div>
                    <div className='bg-[#185519] flex p-3 rounded-md drop-shadow-md mt-5'>
                        <div>Product Name: {selectedProduct?.name || ''}</div>
                    </div>
                    <div className='mt-5 gap-x-5'>
                        {selectedProduct?.variants?.map((variant) => (
                            <div key={variant.id} className="flex gap-5 mb-5">
                                <div className="bg-[#185519] p-3 rounded-md drop-shadow-md">
                                    Variant Name: {variant.name}
                                </div>
                                <div className="bg-[#185519] p-3 rounded-md drop-shadow-md">
                                    In Stock: {variant.quantity}
                                </div>
                                <div className="flex bg-[#185519] p-3 rounded-md drop-shadow-md">
                                    <div>Out Stock: </div>
                                    <input
                                        className="ml-3 text-black rounded-sm outline-none px-2"
                                        placeholder="0"
                                        type="number"
                                        value={outStockValues[variant.id] || ''}
                                        onChange={(e) => handleOutStockChange(variant.id, e)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='flex text-xl justify-end mt-5'>
                <button
                    className='px-4 hover:bg-[#0f3510] transition-all py-2 rounded-md drop-shadow-md bg-[#185519]'
                    onClick={handleSave}
                >
                    {loading ? <LoadingButtons /> : 'Save'}
                </button>
            </div>
        </div>
    );
}

export default ProductInventory;
