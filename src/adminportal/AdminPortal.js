import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import AdminSidebar from '../components/AdminSidebar'
import CreateAccount from '../components/CreateAccount';

function AdminPortal() {
  const [selectedView, setSelectedView] = useState('home');

  return (
    <div className=''>
    <div>
      <Navbar />
    
    </div>
    <div className='flex w-full h-screen pt-16'>
      <div>
        <AdminSidebar setSelectedView={setSelectedView} />
      
      </div>
      <div className='flex bg-[#C0EBA6] w-full h-full p-5'>
        {selectedView === "ca" && <h1 className='w-full rounded-lg overflow-hidden '><CreateAccount /></h1>}
      </div>
    
    </div>
    </div>
  )
}

export default AdminPortal