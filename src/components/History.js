import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';  // Ensure your Firebase configuration is correct
import { parse, compareDesc } from 'date-fns';  // Use compareDesc for descending order sorting

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch history data from Firestore
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'received'));
        const data = querySnapshot.docs.map(doc => {
          const docData = doc.data();
          const { date, time } = docData;

          // Combine date and time into a single Date object
          const dateTimeString = `${date} ${time}`;
          const parsedDateTime = parse(dateTimeString, 'yyyy-MM-dd hh:mm a', new Date());

          return {
            id: doc.id,
            customerName: docData.customerName,
            date: docData.date,
            time: docData.time,
            items: docData.items,
            dateTime: parsedDateTime,  // Store the parsed date-time for sorting
          };
        });

        // Sort the data by dateTime in descending order (latest first)
        const sortedData = data.sort((a, b) => compareDesc(a.dateTime, b.dateTime));
        setHistoryData(sortedData);
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };

    fetchHistory();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = historyData.filter(record => {
    const customerMatch = record.customerName && record.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const productMatch = record.items && record.items.some(item =>
      item.productName && item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return customerMatch || productMatch;
  });

  return (
    <div className='p-5 bg-white rounded-md'>
      <div className='flex text-2xl justify-between'>
        <div>History</div>
        <div className='flex text-lg bg-gray-200 rounded-lg'>
          <input
            type="text"
            placeholder="Search by customer or product"
            value={searchTerm}
            onChange={handleSearchChange}
            className=" py-1 border rounded-md  px-4  bg-transparent"
          />
          <button className="bg-gray-200 px-4 rounded-r-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                  <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z" clipRule="evenodd" />
                </svg>
          </button>
        </div>
      </div>

      <div className='flex mt-4 font-semibold'>
        <div className='w-full text-left'>Name</div>
        <div className='w-full text-left'>Date of Purchase</div>
        <div className='w-full text-left'>Time of Purchase</div>
        <div className='w-full text-left'>Product Name</div>
        <div className='w-full text-left'>Variant Name</div>
        <div className='w-full text-left'>Price</div>
        <div className='w-full text-left'>Quantity</div>
        <div className='w-full text-left'>Total Amount</div>
      </div>

      {filteredData.length === 0 ? (
        <div className="text-center mt-5">No records found</div>
      ) : (
        filteredData.map(record => 
          record.items.map((item, index) => (
            <div key={index} className='flex mt-2'>
              <div className='w-full text-left'>{record.customerName}</div>
              <div className='w-full text-left'>{record.date}</div>
              <div className='w-full text-left'>{record.time}</div>
              <div className='w-full text-left'>{item.productName}</div>
              <div className='w-full text-left'>{item.variantName}</div>
              <div className='w-full text-left'>{item.price}</div>
              <div className='w-full text-left'>{item.quantity}</div>
              <div className='w-full text-left'>{item.totalAmount}</div>
            </div>
          ))
        )
      )}
    </div>
  );
}

export default History;
