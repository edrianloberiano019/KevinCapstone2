import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Inventory from '../components/Inventory';
import CustomerList from '../components/CustomerList';
import Dashboard from '../components/Dashboard';
import CustomerListChild from '../components/CustomerListChild';
import WalaPa from '../components/WalaPa';
import SupplierCreateAccount from '../components/SupplierCreateAccount';

function StaffPortal() {
  const [selectedView, setSelectedView] = useState('home');

  return (
    <div>
      <div className=''>
        <Navbar />
      </div>
      <div className='flex w-full h-screen pt-16'>
        <div>
          <Sidebar setSelectedView={setSelectedView} />
        </div>
        <div className=''>
          {selectedView === 'dashboard' && <h1 className="text-3xl w-full"><Dashboard /></h1>}
          {selectedView === 'clist' && <h1 className="text-3xl w-full"><CustomerListChild /></h1>}
          {selectedView === 'wp' && <h1 className="text-3xl w-full"><WalaPa /></h1>}
          {selectedView === 'sca' && <h1 className="text-3xl w-full"><SupplierCreateAccount /></h1>}

          {selectedView === 'inventory' && <h1 className="text-3xl"><Inventory /></h1>}
          {selectedView === 'sales' && <h1 className="text-3xl">Sales</h1>}
          {selectedView === 'receiving' && <h1 className="text-3xl">Receiving List</h1>}
          {selectedView === 'product' && <h1 className="text-3xl">Product List</h1>}
          {selectedView === 'supplier' && <h1 className="text-3xl">Supplier List</h1>}
          {selectedView === 'customer' && <h1 className="text-3xl"><CustomerList /></h1>}
          {selectedView === 'users' && <h1 className="text-3xl">Users Section</h1>}
        </div>
      </div>
    </div>
  );
}

export default StaffPortal;
