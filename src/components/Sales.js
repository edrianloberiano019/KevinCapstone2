import React, { useState, useEffect } from 'react';
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from '../firebase';
import { toast } from "react-toastify";
import { format } from 'date-fns';
import LoadingButtons from './LoadingButtons';
import jsPDF from 'jspdf';

function Sales() {
    const [isCustomerFound, setIsCustomerFound] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [categories, setCategories] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedVariantQuantity, setSelectedVariantQuantity] = useState(0);
    const [quantityInput, setQuantityInput] = useState(1);
    const [productName, setProductName] = useState('');
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [amountTendered, setAmountTendered] = useState('');
    const [change, setChange] = useState(0);
    const [canSave, setCanSave] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [transactionData, setTransactionData] = useState(null);

    const handleNewSale = () => {
        setShowReceipt(false);
        setCustomerName('');
        setSelectedCategory('');
        setSelectedCustomer('');
        setSelectedVariant(null);
        setVariants([]);
        setSelectedVariantQuantity(0);
        setQuantityInput(1);
        setProductName('');
        setCart([]);
    };



    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesSnapshot = await getDocs(collection(db, 'products'));
                const customerSnapshot = await getDocs(collection(db, 'customerusers'));
                const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const customerData = customerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setCategories(categoriesData);
                setCustomer(customerData);
            } catch (error) {
                console.error("Error fetching categories: ", error);
                toast.error("Failed to load categories");
            }
        };

        fetchCategories();
    }, []);

    const handleOpenPaymentModal = () => {
        setChange(0);
        setAmountTendered('');
        setShowPaymentModal(true);
    };



    const handlePrintPDF = () => {
        const doc = new jsPDF();
        const currentDate = new Date();
        const date = currentDate.toLocaleDateString();
        const time = currentDate.toLocaleTimeString();

        doc.text(`RECEIPT`, 50, 10);
        doc.text(`Date: ${date}`, 10, 20);
        doc.text(`Time: ${time}`, 10, 30);
        doc.text(`Customer name: ${transactionData.customerName}`, 10, 40);

        let startY = 50;
        transactionData.items.forEach((item, index) => {
            doc.text(`Purchase product: ${item.productName}`, 10, startY + index * 30);
            doc.text(`Variant: ${item.variantName}`, 10, startY + 6 + index * 30);
            doc.text(`Quantity: ${item.quantity}`, 10, startY + 12 + index * 30);
            doc.text(`Price: ${item.totalAmount}`, 10, startY + 18 + index * 30);
        });

        const totalY = startY + transactionData.items.length * 30;

        doc.text(`Total:  ${transactionData.totalAmount}`, 161, totalY + 10);
        doc.text(`Amount tendered: ${amountTendered}`, 130, totalY + 17);
        doc.text(`Change: ${transactionData.change}`, 153.3, totalY + 24);

        doc.save('receipt.pdf');

        handleNewSale()
    };



    const handleCategoryChange = async (categoryId) => {
        setSelectedCategory(categoryId);
        setSelectedVariantQuantity(0);
        setQuantityInput(1);

        const selectedProduct = categories.find(product => product.id === categoryId);
        if (selectedProduct && selectedProduct.variants) {
            setVariants(selectedProduct.variants);
            setProductName(selectedProduct.name);
        }
    };

    const handleCustomerChange = async (customerId) => {
        setSelectedCustomer(customerId);
        setSelectedVariantQuantity(0);
        setQuantityInput(1);

        const selectedCustomerData = customer.find(customer => customer.id === customerId);
        if (selectedCustomerData) {
            setCustomerName(selectedCustomerData.name);
            setIsCustomerFound(true);
        } else {
            setIsCustomerFound(false);
        }
    };


    const handleVariantChange = (variantName) => {
        const selectedVariant = variants.find(variant => variant.name === variantName);
        setSelectedVariant(selectedVariant);
        setSelectedVariantQuantity(selectedVariant ? selectedVariant.quantity : 0);
    };

    const handleAddToCart = () => {
        const quantity = parseInt(quantityInput, 10);

        if (isNaN(quantity) || quantity <= 0 || quantity > selectedVariantQuantity) {
            toast.error("Invalid quantity input");
            return;
        }

        const price = selectedVariant.price;
        const totalAmount = price * quantity;

        const existingCartItemIndex = cart.findIndex(
            item => item.productName === productName && item.variantName === selectedVariant.name
        );

        if (existingCartItemIndex !== -1) {
            const updatedCart = [...cart];
            updatedCart[existingCartItemIndex].quantity += quantity;
            updatedCart[existingCartItemIndex].totalAmount += totalAmount;
            setCart(updatedCart);
        } else {
            const newCartItem = {
                productName: productName,
                variantName: selectedVariant.name,
                quantity: quantity,
                price: price,
                totalAmount: totalAmount,
            };
            setCart([...cart, newCartItem]);
        }

        setQuantityInput(1);
    };

    const calculateChange = (tenderedAmount) => {
        const totalAmount = cart.reduce((total, item) => total + item.totalAmount, 0);
        const tendered = parseFloat(tenderedAmount);
        if (!isNaN(tendered) && tendered >= totalAmount) {
            setCanSave(true);
            return tendered - totalAmount;
        } else {
            setCanSave(false);
            return 0;
        }
    };





    const handleCompleteTransaction = async () => {
        const totalAmount = cart.reduce((total, item) => total + item.totalAmount, 0);
        const tenderedAmount = parseFloat(amountTendered);

        if (isNaN(tenderedAmount) || tenderedAmount < totalAmount) {
            toast.error("Amount tendered is less than the total amount.");
            return;
        }

        const currentDate = new Date();
        const formattedDate = format(currentDate, 'yyyy-MM-dd');

        const transactionData = {
            customerName,
            date: formattedDate,
            items: cart.map(item => ({
                productName: item.productName,
                variantName: item.variantName,
                quantity: item.quantity,
                price: item.price,
                totalAmount: item.totalAmount,
            }))
        };

        try {
            setLoading(true);

            const transactionRef = doc(db, 'received', customerName);
            await setDoc(transactionRef, transactionData, { merge: true });

            for (let item of cart) {
                const selectedProduct = categories.find(product => product.name === item.productName);
                const selectedVariant = selectedProduct.variants.find(variant => variant.name === item.variantName);

                if (selectedVariant) {
                    const updatedQuantity = selectedVariant.quantity - item.quantity;
                    const productRef = doc(db, 'products', selectedProduct.id);

                    await setDoc(
                        productRef,
                        {
                            variants: selectedProduct.variants.map(variant =>
                                variant.name === selectedVariant.name
                                    ? { ...variant, quantity: updatedQuantity }
                                    : variant
                            ),
                        },
                        { merge: true }
                    );
                }
            }

            setTransactionData({
                customerName,
                date: formattedDate,
                items: cart,
                totalAmount,
                change: tenderedAmount - totalAmount
            });

            setShowReceipt(true);
            setCart([]);
            toast.success('The transaction was success!');
            setShowPaymentModal(false);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to save transaction");
            setLoading(false);
        }
    };



    const handleRemoveFromCart = (index) => {
        const updatedCart = [...cart];
        updatedCart.splice(index, 1);
        setCart(updatedCart);
        toast.info("Item removed from cart");
    };



    return (
        <div className='w-full bg-[#185519] bg-opacity-80 backdrop-blur-sm drop-shadow-md mt-8 rounded-xl p-5 mx-4 lg:mx-10 text-lg lg:text-2xl'>
            <div className='flex flex-col lg:flex-row items-center '>
                <select
                    className="form-control py-2 px-3 text-black rounded-md text-base lg:text-lg bg-gray-200 w-full lg:w-auto mb-4 lg:mb-0"
                    value={selectedCustomer}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                >
                    <option value="">Select Customer Name</option>
                    {customer.map((customer) => (
                        <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                </select>
            </div>

            <div className='grid flex-col lg:grid-cols-3 xl:grid-flow-col gap-y-3 md: mt-5 space-y-4 lg:space-y-0 lg:space-x-2 '>
                <select
                    className="form-control py-2 px-3 text-black rounded-md text-base lg:text-lg bg-gray-200 w-full lg:w-auto"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    disabled={!isCustomerFound}
                >
                    <option value="">Select Product Name</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>

                <select
                    className="form-control py-2 px-3 text-black rounded-md text-base lg:text-lg bg-gray-200 w-full lg:w-auto"
                    onChange={(e) => handleVariantChange(e.target.value)}
                    disabled={!isCustomerFound || !variants.length}
                >
                    <option value="">Select Variant</option>
                    {variants.map((variant, index) => (
                        <option key={index} value={variant.name}>{variant.name}</option>
                    ))}
                </select>

                <div className='w-full flex items-center'>
                    <div className='px-3 rounded-md bg-gray-200 py-2'>Available Quantity: {selectedVariantQuantity}</div>
                </div>

                <div className='w-full lg:w-auto flex ml-3 items-center'>
                    <input
                        className='px-3 py-2 md:ml-2 h-full rounded-md bg-gray-200 w-full lg:max-w-[100px]'
                        placeholder='QTY'
                        type='number'
                        value={quantityInput}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[1-9]\d*$/.test(value)) {
                                setQuantityInput(value);
                            } else if (value === '') {
                                setQuantityInput('');
                            }
                        }}
                    />
                </div>

                <div className='w-full lg:w-auto flex items-center'>
                    <button
                        className='bg-blue-700 h-full px-3 py-2 rounded-md text-white w-full lg:w-auto'
                        onClick={handleAddToCart}
                        disabled={!selectedVariant}
                    >
                        Add to cart
                    </button>
                </div>
            </div>

            <div className='mt-10 overflow-x-auto'>
                <h3 className='text-white mb-3'>Your Cart Items {canSave}</h3>
                <div className=' w-full items-center text-black grid grid-cols-1  lg:grid-cols-5'>
                    <div className='w-full border-l-2 border-t-2  border-b-2 border-white py-2 bg-white'>Product Name</div>
                    <div className='w-full border-l-2 h-full content-center border-t-2 border-b-2 py-2 bg-white border-white'>Variant Name</div>
                    <div className='w-full h-full content-center  border-l-2 border-t-2 border-b-2 py-2 bg-white border-white'>Quantity</div>
                    <div className='w-full border-2 py-2 h-full content-center bg-white border-white'>Total Amount</div>
                    <div className='w-full border-2 h-full content-center py-2 bg-white border-white'>Remove</div>
                </div>
                {cart.map((item, index) => (
                    <div key={index} className='grid grid-cols-1 lg:grid-cols-5 w-full items-center text-white'>
                        <div className='w-full border-l-2 border-b-2 py-2'>{item.productName}</div>
                        <div className='w-full border-l-2 py-2 border-b-2'>{item.variantName}</div>
                        <div className='w-full border-l-2 py-2 border-b-2'>{item.quantity}</div>
                        <div className='w-full border-l-2 border-b-2 border-r-2 py-2'>{item.totalAmount}</div>
                        <div className='w-full border-b-2 border-r-2 py-2 h-full flex justify-center text-red-600'>
                            <button className='px-3' onClick={() => handleRemoveFromCart(index)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                    <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                                </svg>
                          
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className='mt-5 flex justify-end'>
                <button
                    className='bg-green-700 py-2 px-5 text-white rounded-md w-full lg:w-auto'
                    onClick={handleOpenPaymentModal}
                    disabled={!cart.length}
                >
                    Complete Transaction
                </button>
            </div>

            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-md w-96">
                        <h3 className="text-xl mb-3">Total Amount: {cart.reduce((total, item) => total + item.totalAmount, 0)}</h3>
                        <input
                            type="number"
                            value={amountTendered}
                            onChange={(e) => {
                                const tenderedAmount = e.target.value;
                                setAmountTendered(tenderedAmount);
                                const changeAmount = calculateChange(tenderedAmount);
                                setChange(changeAmount);
                            }}
                            className="px-3 py-2 rounded-md w-full bg-gray-200"
                            placeholder="Amount Tendered"
                        />

                        <div className="mt-1 mb-5 flex justify-start">
                            <h4 className="text-lg">Change: {change}</h4>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleCompleteTransaction}
                                className="bg-green-700 text-white px-4 py-2 rounded-md"
                            >
                                {loading ? <LoadingButtons /> : 'Pay'}
                            </button>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="ml-3 bg-gray-500 text-white px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showReceipt && transactionData && (
                <div className='receipt fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
                    <div className='bg-white rounded-md p-10 w-[1000px]'>
                        <h2 className='text-3xl uppercase'>Receipt</h2>
                        <div className='text-xl text-left font-medium ml-2 mb-2 flex'>
                            <div>Customer name:</div>
                            <div className='ml-2 font-normal '>{transactionData.customerName}</div>
                        </div>
                        <div className='flex text-xl font-medium text-left px-2'>
                            <div className='w-full'>Purchased product</div>
                            <div className='w-full'>Variants</div>
                            <div className='w-full'>Quantity</div>
                            <div className='w-full'>Price</div>
                            <div className='w-[60%] text-right text-transparent'></div>

                        </div>

                        <div className='border-b-2 border-gray-200 pb-1 px-2'>
                            {transactionData.items.map((item, index) => (
                                <div className='flex text-lg text-left'>

                                    <div className='w-full' key={index}> {item.productName}</div>
                                    <div className='w-full' key={index}> {item.variantName}</div>
                                    <div className='w-full' key={index}> {item.quantity}</div>
                                    <div className='w-full' key={index}> ₱ {item.totalAmount}</div>
                                    <div className='w-[60%] text-transparent' key={index}></div>

                                </div>

                            ))}
                        </div>
                        <div>
                            <div className='flex justify-end text-lg items-center mr-10'>
                                <div className='mr-5 text-lg font-medium'>Total price: </div>
                                <div className='w-20 text-left'>₱{transactionData.totalAmount}</div>
                            </div>
                            <div className='flex border-b-2 justify-end text-lg items-center pr-10'>
                                <div className='mr-5 text-lg font-medium'>Amount tendered: </div>
                                <div className='w-20 text-left'>₱{amountTendered}</div>
                            </div>
                            <div className='flex justify-end items-center text-lg mr-10'>
                                <div className='mr-5 text-lg font-medium'>Change: </div>
                                <div className='w-20 text-left'>₱{transactionData.change}</div>
                            </div>

                        </div>

                        <div className='mt-5 flex justify-end'>
                            <button className='bg-green-700 drop-shadow-lg text-white px-3 py-2 rounded-xl' onClick={handlePrintPDF}>Print PDF</button>
                            <button className='bg-blue-700 text-white px-3 drop-shadow-lg py-2 rounded-xl ml-5' onClick={handleNewSale}>New Sale</button>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Sales;
