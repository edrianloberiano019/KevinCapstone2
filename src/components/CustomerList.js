import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from "react-toastify";

function CustomerList() {
  const [data, setData] = useState({ name: '', contact: '', address: '', status: 'Active' });
  const [contactNumber, setContactNumber] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'customerusers'), data);
      console.log("hakdog", docRef.id);
      setData({ name: '', contact: '', address: '', status: 'Active' });
      toast.success('Successfully created!', {
        position: 'top-center',
        autoClose: 5000
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className='flex justify-start content-start w-[450px] items-start text-left bg-white px-6 py-10 rounded-md drop-shadow-lg'>
      <form onSubmit={handleSubmit}>
        <div className='text-center'>Customer Form</div>

        <input
          name="name"
          value={data.name}
          onChange={handleFieldChange}
          className='mt-3 border-[1px] text-[20px] px-3 w-full border-gray-300 border-solid rounded-md'
          placeholder='Customer name'
          type='text'
          required
        />

        <input
          name="contact"
          value={contactNumber}
          id="contactNumber"
          type="tel"
          className="mt-3 w-full text-[20px] px-3 border border-gray-300 rounded-lg"
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
          className='text-[20px] max-h-[550px] border-[1px] mt-3 pt-2 px-3 w-full border-gray-300 rounded-md border-solid'
          placeholder='Address'
          required
        />

        <div className='flex justify-end mt-2'>
          <button type='submit' className='px-3 hover:scale-105 transition-all hover:bg-[#2b6421] text-white rounded-md text-[20px] bg-blue-500'>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerList;
