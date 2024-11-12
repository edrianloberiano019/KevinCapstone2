import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

function CustomerListChild() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchCustomers = async () => {
        setLoading(true);
        const customerCollection = collection(db, 'customerusers');
        const customerSnapshot = await getDocs(customerCollection);
        const customerList = customerSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        setCustomers(customerList);
        setLoading(false);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(customer => {
        const searchLower = searchQuery.toLowerCase();
        return (
            (customer.id && customer.id.toLowerCase().includes(searchLower)) ||
            (customer.name && customer.name.toLowerCase().includes(searchLower)) ||
            (customer.contact && customer.contact.toLowerCase().includes(searchLower))
        );
    });

    return (
        <div className='bg-white rounded-xl pb-10 w-full'>
            <div className='w-full'>
                <div className='hidden xl:flex justify-between w-full'>
                    <div className='mt-8 text-left ml-10'>Customer List</div>
                    <div className='flex pt-7'>
                        <input
                            className='flex text-lg bg-gray-200 px-4 rounded-l-lg'
                            placeholder='Search'
                            type='search'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className='bg-gray-200 mr-10 px-4 rounded-r-lg'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div className='block xl:hidden'>
                    <div className='py-10 text-center text-base'>The customer list is only available in PC view.</div>
                </div>
                <div className='hidden xl:block'>
                    <div className='flex px-10 pt-2'>
                        <div className='w-full text-left text-xl bg-gray-200 border-t-2 border-l-2 border-gray-200 pl-4 py-2'>ID</div>
                        <div className='w-full text-left text-xl bg-gray-200 border-t-2 border-l-2 pl-4 py-2'>Name</div>
                        <div className='w-full text-left text-xl border-t-2 bg-gray-200 border-l-2 pl-4 py-2'>Contact</div>
                        <div className='w-full text-left text-xl bg-gray-200 border-l-2 border-t-2 border-r-2 pl-4 py-2'>Status</div>
                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center mt-10">
                            <div className="w-10 h-10 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
                        </div>
                    ) : (
                        <ul>
                            <div className='px-10'>
                                <div className='border-b-2'>
                                    {filteredCustomers.map(customer => (
                                        <div className='flex' key={customer.id}>
                                            <div className='w-full text-left text-xl border-t-2 border-l-2 border-gray-200 pl-4 py-2'>{customer.id}</div>
                                            <div className='w-full text-left text-xl border-t-2 border-l-2 pl-4 py-2'>{customer.name}</div>
                                            <div className='w-full text-left text-xl border-t-2 border-l-2 pl-4 py-2'>{customer.contact}</div>
                                            <div className='w-full text-left text-xl border-l-2 border-t-2 border-r-2 pl-4 py-2'>{customer.status}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CustomerListChild;
