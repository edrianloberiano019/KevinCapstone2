import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

function ProductListChild() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const productCollection = collection(db, 'products');
            const productSnapshot = await getDocs(productCollection);
            const productList = productSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(productList);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const calculateTotalQuantity = (variants) => {
        return variants.reduce((total, variant) => total + (parseInt(variant.quantity, 10) || 0), 0);
    };

    const filteredProducts = products.filter(product => {
        const searchLower = searchQuery.toLowerCase();
        const hasMatchingVariants = product.variants && product.variants.some(variant =>
            variant.name.toLowerCase().includes(searchLower)
        );

        return (
            (product.id && String(product.id).toLowerCase().includes(searchLower)) ||
            (product.category && product.category.toLowerCase().includes(searchLower)) ||
            (product.name && product.name.toLowerCase().includes(searchLower)) ||
            (product.expirationDate && product.expirationDate.toLowerCase().includes(searchLower)) ||
            hasMatchingVariants
        );
    });

    return (
        <div className='flex bg-white rounded-xl pb-10 w-full'>
            <div className='w-full'>
                <div className='flex justify-between w-full'>
                    <div className='text-left mt-8 ml-10'>Product List</div>
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
                <div>
                    <div className='flex px-10 pt-2'>
                        <div className='w-full text-left text-xl bg-gray-200 border-t-2 border-l-2 border-gray-200 pl-4 py-2'>Category</div>
                        <div className='w-full text-left text-xl bg-gray-200 border-t-2 border-l-2 pl-4 py-2'>Product Name</div>
                        <div className='w-[70%] text-left text-xl bg-gray-200 border-t-2 border-l-2 pl-2 py-2'>Expiration Date</div>
                        <div className='w-full text-left text-xl border-t-2 bg-gray-200 border-l-2 pl-4 py-2'>Variants</div>
                        <div className='w-[50%] text-left text-xl border-t-2 bg-gray-200 border-l-2 pl-4 py-2'>Price</div>
                        <div className='w-full text-left text-xl bg-gray-200 border-l-2 border-t-2 border-r-2 pl-4 py-2'>Quantity</div>
                        <div className='w-[40%] text-left text-xl bg-gray-200 border-l-2 border-t-2 border-r-2 py-2'>Total</div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center mt-10">
                            <div className="w-10 h-10 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
                        </div>
                    ) : (
                        <ul className='px-10'>
                            {filteredProducts.map(product => (
                                <div className='flex border-b-2' key={product.id}>
                                    <div className='w-full text-left text-xl border-l-2 border-gray-200 pl-4 py-4'>{product.category}</div>
                                    <div className='w-full text-left text-xl  border-l-2 pl-4 py-4'>{product.name}</div>
                                    <div className='w-[70%] text-left text-xl border-l-2 pl-4 py-4'>{product.expirationDate}</div>
                                    <div className='w-full text-left text-xl border-l-2 border-r-2 pl-4 py-4'>
                                        {product.variants && product.variants.length > 0 ? (
                                            product.variants.map((variant, index) => (
                                                <div key={index}>{variant.name}</div>
                                            ))
                                        ) : (
                                            'No Variants'
                                        )}
                                    </div>
                                    <div className='w-[50%] text-left text-xl  border-r-2 pl-4 py-4'>
                                        {product.variants && product.variants.length > 0 ? (
                                            product.variants.map((variant, index) => (
                                                <div key={index}>₱ {variant.price}</div>
                                            ))
                                        ) : (
                                            '0'
                                        )}
                                    </div>
                                    <div className='w-full text-left text-xl border-r-2 pl-4 py-4'>
                                        {product.variants && product.variants.length > 0 ? (
                                            product.variants.map((variant, index) => (
                                                <div key={index}>{variant.quantity}</div>
                                            ))
                                        ) : (
                                            '0'
                                        )}
                                    </div>
                                    <div className='w-[40%] text-left text-xl border-r-2 pl-4 py-2'>
                                        {product.variants ? calculateTotalQuantity(product.variants) : 0}
                                    </div>
                                </div>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductListChild;
