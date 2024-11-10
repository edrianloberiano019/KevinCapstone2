import React from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className='flex absolute bg-[#185519] drop-shadow-lg w-full h-[65px] px-10'>
      <div className='flex w-full items-center justify-between'>
        <div>
          <div className='text-[#FFFBE6] text-xl font-bold'>Groceries Sales and Inventory System</div>
        
        </div>
        <div>
          <button onClick={handleLogout} className='text-md font-semibold text-[#FFFBE6]'> Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar