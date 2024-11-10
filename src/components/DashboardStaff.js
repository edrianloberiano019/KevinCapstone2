import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

function Dashboard({ setSelectedView }) {
    const [customerCount, setCustomerCount] = useState(0);
    const [supplierCount, setSupplierCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchCustomerCount = async () => {
        try {
            const customerCollection = collection(db, 'customerusers');
            const customerSnapshot = await getDocs(customerCollection);
            setCustomerCount(customerSnapshot.size);
            setLoading(false)
        } catch (error) {
            toast.error("Error fetching customer count: ", error);
        }
    };

    const fetchProductCount = async () => {
        try {
            const productCollection = collection(db, 'products');
            const productSnapshot = await getDocs(productCollection);
            setProductCount(productSnapshot.size);
        } catch (error) {
            toast.error("Error fetching customer count: ", error);
        }
    };

    const fetchSupplierCount = async () => {
        try {
            const supplierCollection = collection(db, 'supplier');
            const supplierSnapshot = await getDocs(supplierCollection);
            setSupplierCount(supplierSnapshot.size);
        } catch (error) {
            toast.error("Error fetching supplier count: ", error);
        }
    };

    useEffect(() => {
        const fetchCounts = async () => {
            setLoading(true);
            await Promise.all([fetchCustomerCount(), fetchSupplierCount(), fetchProductCount()]);
            setLoading(false);
        };
        fetchCounts();
    }, []);


    const totalUsers = customerCount + supplierCount;

    return (
        <div className='mt-10'>
            <div className='w-full flex flex-row gap-5 px-10'>
                <div className='flex w-full bg-white rounded-xl z-20 hover:z-10 drop-shadow-md hover:drop-shadow-2xl transition-all hover:scale-105'>
                    <div className='pr-20 pl-6 py-10 text-left'>
                        <div className='flex text-sm'>Total Users</div>
                        {loading ? (
                            <div className="flex justify-start items-center mt-4 ">
                                <div className="w-5 h-5 border-4 border-green-700 border-solid rounded-full border-t-transparent animate-spin"></div>
                            </div>
                        ) : (
                            <div className='text-3xl'>{loading ? 'Loading...' : totalUsers}</div>
                        )}
                    </div>
                </div>
                <div className='flex   z-20 hover:z-10 w-full bg-white rounded-xl drop-shadow-md hover:drop-shadow-2xl transition-all hover:scale-105'>
                    <div className='pr-20 pl-6 py-10 text-left'>
                        <div className='flex text-sm'>Customers</div>

                        {loading ? (
                            <div className="flex justify-start items-center mt-4 ">
                                <div className="w-5 h-5 border-4 border-green-700 border-solid rounded-full border-t-transparent animate-spin"></div>
                            </div>
                        ) : (
                            <div className='text-3xl'>{customerCount}</div>
                        )}
                    </div>
                </div>
                <div className='flex w-full bg-white  z-20 hover:z-10 rounded-xl drop-shadow-md hover:drop-shadow-2xl transition-all hover:scale-105'>
                    <div className='pr-20 pl-6 py-10 text-left'>
                        <div className='flex text-sm'>Suppliers</div>
                        {loading ? (
                            <div className="flex justify-start items-center mt-4 ">
                                <div className="w-5 h-5 border-4 border-green-700 border-solid rounded-full border-t-transparent animate-spin"></div>
                            </div>
                        ) : (
                            <div className='text-3xl'>{loading ? 'Loading...' : supplierCount}</div>
                        )}
                    </div>
                </div>
            </div>
            <div className='w-full flex mt-5 flex-row gap-5 px-10'>
                <div className='flex w-full bg-white rounded-xl drop-shadow-md hover:drop-shadow-xl transition-all hover:scale-105'>
                    <div className='pr-20 pl-6 py-10 text-left'>
                        <div className='flex text-sm'>Products</div>
                        {loading ? (
                            <div className="flex justify-start items-center mt-4 ">
                                <div className="w-5 h-5 border-4 border-green-700 border-solid rounded-full border-t-transparent animate-spin"></div>
                            </div>
                        ) : (
                            <div className='text-3xl'>{loading ? 'Loading...' : productCount}</div>
                        )}
                    </div>
                </div>
                <div className='w-full'></div>
                <div className='w-full'></div>
            </div>
        </div>
    );
}

export default Dashboard;
