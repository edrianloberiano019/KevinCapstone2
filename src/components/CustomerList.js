import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import LoadingButtons from './LoadingButtons';

function CustomerList() {
  const [data, setData] = useState({ name: '', contact: '', address: '', status: 'Active' });
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [existingSupplierId, setExistingSupplierId] = useState(null);
  const [foundUser, setFoundUser] = useState(false);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSearch = async () => {
    try {
      const supplierQuery = query(collection(db, 'customerusers'), where('name', '==', searchInput));
      const querySnapshot = await getDocs(supplierQuery);
      if (!querySnapshot.empty) {
        const supplierDoc = querySnapshot.docs[0];
        setExistingSupplierId(supplierDoc.id);
        setData(supplierDoc.data());
        setContactNumber(supplierDoc.data().contact);
        setFoundUser(true);
      } else {
        setExistingSupplierId(null);
        setData({ name: '', contact: '', address: '', status: 'Active' });
        setContactNumber('');
        toast.info('No customer found. You can add a new customer.', { position: 'top-center' });
        setFoundUser(false);
      }
    } catch (error) {
      console.error("Error searching supplier: ", error);
    }
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

  // Generate a unique document ID with 'CP' followed by a random number
  const generateDocId = () => {
    const randomNumber = Math.floor(Math.random() * 1000000); // Generates a random number between 0 and 999999
    return `CM${randomNumber.toString().padStart(6, '0')}`; // Ensure the number is 6 digits, padding with leading zeros if needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!existingSupplierId) {
        const supplierQuery = query(collection(db, 'customerusers'), where('name', '==', data.name));
        const querySnapshot = await getDocs(supplierQuery);
        if (!querySnapshot.empty) {
          toast.error('Customer with this name already exists!', { position: 'top-center' });
          return;
        }
      }

      if (existingSupplierId) {
        const supplierDocRef = doc(db, 'customerusers', existingSupplierId);
        await updateDoc(supplierDocRef, data);
        toast.success('Customer updated successfully!', { position: 'top-center' });
        setFoundUser(false);
      } else {
        const customDocId = generateDocId(); 
        await addDoc(collection(db, 'customerusers'), { ...data, id: customDocId });
        console.log("Document added with ID: ", customDocId);
        toast.success('Customer created successfully!', { position: 'top-center' });
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
    <div className='flex justify-center content-center items-center w-full'>
      <div className='flex justify-start content-start m-5 w-[600px] items-start text-left bg-[#185519]  bg-opacity-80 backdrop-blur-[2px] drop-shadow-md px-6 py-10 rounded-xl'>
        <form onSubmit={handleSubmit}>
          <div className='xl:flex grid grid-cols-1 justify-between items-center'>
            <div className='text-left text-white text-2xl uppercase '>Customer Form</div>
            <div className='flex bg-white rounded-md mt-3 xl:mt-0'>
              <input
                className='text-2xl px-3 w-full py-2 rounded-md'
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
            placeholder='Customer name'
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
              className={`px-4 py-2 font-bold hover:scale-105 transition-all text-white rounded-md text-lg ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-700'}`}
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
    </div>
  );
}

export default CustomerList;
