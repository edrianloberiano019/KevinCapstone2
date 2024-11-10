import React, { useState } from 'react';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import { toast } from "react-toastify";
import LoadingButtons from './LoadingButtons';

function SupplierCreateAccount() {
  const [data, setData] = useState({ name: '', contact: '', address: '', status: 'Active' });
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingSupplierId, setExistingSupplierId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [foundUser, setFoundUser] = useState(false)

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleContactChange = (e) => {
    const input = e.target.value;
    if (/^[0-9]*$/.test(input) && input.length <= 11) {
      setContactNumber(input);
      setData((prevData) => ({
        ...prevData,
        contact: input
      }));
    }
  };

  const handleSearch = async () => {
    try {
      const supplierQuery = query(collection(db, 'supplier'), where('name', '==', searchInput));
      const querySnapshot = await getDocs(supplierQuery);
      if (!querySnapshot.empty) {
        const supplierDoc = querySnapshot.docs[0];
        setExistingSupplierId(supplierDoc.id);
        setData(supplierDoc.data());
        setContactNumber(supplierDoc.data().contact);
        setFoundUser(true)
      } else {
        setExistingSupplierId(null);
        setData({ name: '', contact: '', address: '', status: 'Active' });
        setContactNumber('');
        toast.info('No supplier found. You can add a new supplier.', { position: 'top-center' });
        setFoundUser(false)
      }
    } catch (error) {
      console.error("Error searching supplier: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!existingSupplierId) {
        const supplierQuery = query(collection(db, 'supplier'), where('name', '==', data.name));
        const querySnapshot = await getDocs(supplierQuery);
        if (!querySnapshot.empty) {
          toast.error('Supplier with this name already exists!', { position: 'top-center' });
          return;
        }
      }
  
      if (existingSupplierId) {
        const supplierDocRef = doc(db, 'supplier', existingSupplierId); 
        await updateDoc(supplierDocRef, data);
        toast.success('Supplier updated successfully!', { position: 'top-center' });
        setFoundUser(false)
      } else {
        const docRef = await addDoc(collection(db, 'supplier'), data);
        console.log("Document added with ID: ", docRef.id);
        toast.success('Supplier created successfully!', { position: 'top-center' });
      }
  
      setData({ name: '', contact: '', address: '', status: 'Active' });
      setContactNumber('');
      setExistingSupplierId(null);
      setSearchInput('');
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleClear = () => {
    setData({ name: '', contact: '', address: '', status: 'Active' });
    setContactNumber('');
    setExistingSupplierId(null);
    setSearchInput('');
  };

  return (
    <div className='flex justify-start content-start m-5 w-[600px] items-start text-left bg-[#185519] px-6 py-10 rounded-xl'>
      <form onSubmit={handleSubmit}>
        <div className='flex justify-between items-center'>
          <div className='text-center text-white'>Supplier Form</div>
          <div className='flex bg-white rounded-md'>
            <input
              className='text-2xl px-3 py-2 rounded-md'
              placeholder='Search by name'
              type='search'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)} 
            />
            <button type="button" onClick={handleSearch} className='px-3'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <input
          name="name"
          value={data.name}
          onChange={handleFieldChange}
          className='mt-3 border-[1px] text-lg px-3 py-2 w-full bg-gray-200 border-solid rounded-md'
          placeholder='Supplier name'
          type='text'
          required
        />

        <input
          name="contact"
          value={contactNumber}
          id="contactNumber"
          type="tel"
          className="mt-3 w-full text-lg px-3 py-2 border bg-gray-200 rounded-lg"
          placeholder="Contact number"
          maxLength="11"
          pattern="09[0-9]{9}"
          onChange={handleContactChange}
          required
        />

        <textarea
          name="address"
          value={data.address}
          onChange={handleFieldChange}
          className='text-lg max-h-[550px] border-[1px] py-2 mt-3 pt-2 px-3 w-full bg-gray-200 rounded-md border-solid'
          placeholder='Address'
          required
        />

        <div className='flex justify-end mt-2'>
          <button
            type="button"
            onClick={handleClear}
            className='text-lg text-white px-4'
          >
            Clear
          </button>
          <button
            type='submit'
            className={`px-4 py-2 font-bold transition-all text-white rounded-md text-lg drop-shadow-md ${loading ? 'bg-green-700' : 'bg-green-700'}`}
            disabled={loading}
          >
          {foundUser ? (
            <div>
              {loading ? <LoadingButtons/>  : 'Update'}
            
            </div>
          ) : (
            <div>
          {loading ? <LoadingButtons/> : 'Save'}
            
            </div>
          )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SupplierCreateAccount;
