import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import LoadingButtons from './LoadingButtons';

function Category() {
    const [categoryName, setCategoryName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermInList, setSearchTermInList] = useState(''); // New state for category list search
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);
    const [categoryDocId, setCategoryDocId] = useState('');
    const [foundItem, setFoundItem] = useState(false);
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        setLoading3(true);
        try {
            const q = query(collection(db, 'categories'));
            const querySnapshot = await getDocs(q);
            console.log('Fetched categories:', querySnapshot.docs); // Check the response
            const fetchedCategories = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCategories(fetchedCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Error fetching categories');
        } finally {
            setLoading3(false);
        }
    };
    

    useEffect(() => {
        fetchCategories();
    },);

    const handleSearchCategory = async () => {
        if (!searchTerm.trim()) return;

        setFoundItem(false);

        try {
            const q = query(collection(db, 'categories'), where('categoryName', '==', searchTerm));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const existingCategory = querySnapshot.docs[0].data().categoryName;
                setCategoryName(existingCategory);
                setCategoryDocId(querySnapshot.docs[0].id);
                toast.info('Category found: ' + existingCategory);
                setFoundItem(true);
            } else {
                setCategoryDocId('');
                setCategoryName('');
                toast.info('Category not found');
                setFoundItem(false);
            }
        } catch (error) {
            console.error('Error searching category:', error);
            toast.error('Error searching category');
        }
    };

    const handleSaveCategory = async (e) => {
        e.preventDefault();

        if (!categoryName.trim()) return;

        setLoading(true);

        try {
            const existingCategoryQuery = query(collection(db, 'categories'), where('categoryName', '==', categoryName));
            const existingCategorySnapshot = await getDocs(existingCategoryQuery);

            if (!existingCategorySnapshot.empty) {
                toast.error('Category already exists');
            } else {
                if (categoryDocId) {
                    const categoryRef = doc(db, 'categories', categoryDocId);
                    await updateDoc(categoryRef, { categoryName: categoryName });
                    toast.success('Category updated successfully');
                    setFoundItem(false);
                    setSearchTerm('');
                } else {
                    await addDoc(collection(db, 'categories'), { categoryName: categoryName });
                    toast.success('Category saved successfully');
                }
                setCategoryName('');
                setCategoryDocId('');
                fetchCategories();
            }
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('Error saving category');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCategory = async () => {
        if (!categoryDocId) return;

        setLoading2(true);

        try {
            const categoryRef = doc(db, 'categories', categoryDocId);
            await deleteDoc(categoryRef);
            toast.success('Category removed successfully');
            setCategoryName('');
            setCategoryDocId('');
            setFoundItem(false);
            fetchCategories();
            setLoading2(false);
            setSearchTerm('');
        } catch (error) {
            console.error('Error removing category:', error);
            toast.error('Error removing category');
            setLoading2(false);
            setSearchTerm('');
        } finally {
            setLoading(false);
        }
    };

    const filteredCategories = categories.filter(category => 
        searchTermInList ? 
        category.categoryName.toLowerCase().includes(searchTermInList.toLowerCase()) : true
    );
   
    useEffect(() => {
        fetchCategories();
    }, [categories]); // Refetch when categories state changes
    

    return (
        <div className="w-full grid grid-cols-1 xl:flex mr-5 p-5 rounded-xl gap-5 justify-center items-start">
            <div className="bg-[#185519] p-5 rounded-xl w-full xl:w-[40%]  backdrop-blur-[2px] bg-opacity-80 drop-shadow-md ">
                <div>
                    <div className=" justify-between grid grid-cols-1 xl:flex">
                        <div className="text-2xl text-left text-white xl:mr-5">Category Form</div>
                        <div className='bg-white text-2xl grid mt-4  xl:mt-0 items-center rounded-md px-3 py-2 '>
                            <div className='flex  '>
                                <input
                                    className='w-full outline-none '
                                    type="search"
                                    placeholder='Search'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button onClick={handleSearchCategory}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 outline-none">
                                        <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSaveCategory}>
                        <input
                            className="w-full text-2xl px-3 py-2 rounded-md mt-5"
                            placeholder="Category name"
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)} 
                            required
                        />
                        <div className="flex justify-end items-center mt-5 ">
                            <button className='mr-3 bg-red-700 text-white px-4 py-2 text-lg drop-shadow-md rounded-xl'
                                type="button"
                                onClick={handleRemoveCategory}
                                disabled={!foundItem}>
                                {loading2 ? <LoadingButtons /> : 'Remove'}
                            </button>
                            <button
                                className={`text-right ${foundItem ? 'bg-blue-700' : ' bg-green-700'} px-4 text-lg py-2 text-white drop-shadow-md  rounded-xl`}
                                type="submit"
                                disabled={loading}
                            >
                                {foundItem ? (
                                    <div>
                                        {loading ? <LoadingButtons /> : 'Update'}
                                    </div>
                                ) : (
                                    <div>
                                        {loading ? <LoadingButtons /> : 'Save'}
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className='xl:w-[60%]  w-full bg-[#185519] p-5 rounded-xl  backdrop-blur-[2px] bg-opacity-90 drop-shadow-md'>
                <div className='flex justify-between'>
                    <div className='text-2xl text-white text-left'>Category List</div>
                    <div className='flex bg-white px-3 py-2 rounded-md overflow-hidden'>
                        <input
                            className='text-2xl w-full outline-none '
                            type='search'
                            placeholder='Search in List'
                            value={searchTermInList}
                            onChange={(e) => setSearchTermInList(e.target.value)}
                        />
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 outline-none">
                                <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className='overflow-x-auto mt-5'>
                    {filteredCategories.length === 0 ? (
                        <div>No categories found</div>
                    ) : (
                        <table className='w-full text-left text-2xl'>
                            <thead>
                                <tr className='text-black bg-white border-2'>
                                    <th className="p-2">#</th>
                                    <th className="p-2">Category Name</th>
                                </tr>
                            </thead>
                            {loading3 ? '': ''}
                            <tbody>
                                {filteredCategories.map((category, index) => (
                                    <tr key={category.id} className="border-b-2 border-l-2 border-r-2 text-white">
                                        <td className="p-2">{index + 1}</td>
                                        <td className="p-2">{category.categoryName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Category;
