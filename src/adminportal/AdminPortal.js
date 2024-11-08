import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import AdminSidebar from '../components/AdminSidebar'
import CreateAccount from '../components/CreateAccount';
import Inventory from '../components/Inventory';
import CustomerList from '../components/CustomerList';
import Dashboard from '../components/Dashboard';
import CustomerListChild from '../components/CustomerListChild';
import WalaPa from '../components/WalaPa';
import SupplierCreateAccount from '../components/SupplierCreateAccount';
import ProductChild from '../components/ProductChild';
import ProductList from '../components/ProductList'
import SupplierList from '../components/SupplierList';
import Sales from '../components/Sales';
import Category from '../components/Category';
import DashboardStaff from '../components/DashboardStaff'

function AdminPortal() {
  const [selectedView, setSelectedView] = useState('home');

  return (
    <div className='h-screen flex '>
      <div className=" h-full sticky top-0 z-20">
        <AdminSidebar setSelectedView={setSelectedView} />

      </div>
      <div className="w-full flex flex-col overflow-y-auto h-screen">
        <div className="sticky top-0 z-30">
          <Navbar />
        </div>
        <div className=' bg-[#C0EBA6] pt-16 flex-grow'>
          {selectedView === "ca" && <h1 className='w-full rounded-lg overflow-hidden '><CreateAccount /></h1>}
          {selectedView === 'dashboard' && <Dashboard setSelectedView={setSelectedView} />}
          {selectedView === 'clist' && <h1 className='flex w-full text-2xl'><CustomerListChild /></h1>}
          {selectedView === 'wp' && <WalaPa />}
          {selectedView === 'sca' && <h1 className='flex w-full  text-2xl'><SupplierCreateAccount /></h1>}
          {selectedView === 'inventory' && <Inventory />}
          {selectedView === 'customer' && <h1 className='flex w-full'><CustomerList /></h1>}
          {selectedView === 'productadd' && <h1 className='flex w-full ml-8 mt-8 text-2xl'><ProductChild /></h1>}
          {selectedView === 'productlist' && <ProductList />}
          {selectedView === 'supplierlist' && <SupplierList />}
          {selectedView === 'sale' && <h1 className='flex w-full h-full pb-5'><Sales /></h1>}
          {selectedView === 'cate' && <h1 className='flex w-full'><Category /></h1>}
          {selectedView === 'inv' && <h1 className='flex w-full'><Inventory /></h1>}
          {selectedView === "dash" && <h1 className='w-full h-full rounded-lg overflow-hidden '><DashboardStaff /></h1>}
        </div>

      </div>
    </div>
  )
}

export default AdminPortal