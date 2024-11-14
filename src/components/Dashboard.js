import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import SalesAnalytics from './SalesAnalytics';

function Dashboard({ setSelectedView }) {
  const [customerCount, setCustomerCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomerCount = async () => {
    try {
      const customerCollection = collection(db, 'customerusers');
      const customerSnapshot = await getDocs(customerCollection);
      setCustomerCount(customerSnapshot.size);
    } catch (error) {
      toast.error("Error fetching customer count: ", error);
    }
  };

  const fetchProductCount = async () => {
    try {
      const productCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productCollection);
      setProductCount(productSnapshot.size);
    } catch (error) {
      toast.error("Error fetching product count: ", error);
    }
  };

  const fetchSupplierCount = async () => {
    try {
      const supplierCollection = collection(db, 'supplier');
      const supplierSnapshot = await getDocs(supplierCollection);
      setSupplierCount(supplierSnapshot.size);
    } catch (error) {
      toast.error("Error fetching supplier count: ", error);
    }
  };

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const receivedCollection = collection(db, 'received');
      const receivedSnapshot = await getDocs(receivedCollection);
      const sales = receivedSnapshot.docs.map(doc => doc.data());
      
      const salesByMonth = {};
      const months = [
        '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
        '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'
      ];

      months.forEach(month => {
        salesByMonth[month] = 0;
      });

      sales.forEach(sale => {
        const date = sale.date;
        const monthYear = `${date.substring(0, 7)}`; // Extracts YYYY-MM from the date (e.g., 2024-11)
        if (salesByMonth[monthYear] !== undefined) {
          salesByMonth[monthYear] += 1;
        }
      });

      const chartData = months.map(month => ({
        month,
        sales: salesByMonth[month],
      }));

      setSalesData(chartData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      await Promise.all([fetchCustomerCount(), fetchSupplierCount(), fetchProductCount()]);
      fetchSalesData();
    };
    fetchCounts();
  }, []);

  const totalUsers = customerCount + supplierCount;

  return (
    <div className="mt-10 px-4 sm:px-10">
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-5">
        <div className="flex w-flex gap-x-5">
          <div className="flex bg-white rounded-xl w-full drop-shadow-md transition-all hover:scale-105">
            <div className="pr-6 sm:pr-10 pl-4 py-6 text-left">
              <div className="text-sm">Total Users</div>
              {loading ? (
                <div className="w-5 h-5 border-4 border-green-700 border-solid rounded-full border-t-transparent animate-spin mt-4"></div>
              ) : (
                <div className="text-2xl sm:text-3xl">{totalUsers}</div>
              )}
            </div>
          </div>
          <div className="flex bg-white rounded-xl w-full drop-shadow-md transition-all hover:scale-105">
            <div className="pr-6 sm:pr-10 pl-4 py-6 text-left">
              <div className="text-sm">Customers</div>
              {loading ? (
                <div className="w-5 h-5 border-4 border-green-700 border-solid rounded-full border-t-transparent animate-spin mt-4"></div>
              ) : (
                <div className="text-2xl sm:text-3xl">{customerCount}</div>
              )}
            </div>
          </div>
          <div className="flex bg-white rounded-xl w-full drop-shadow-md transition-all hover:scale-105">
            <div className="pr-6 sm:pr-10 pl-4 py-6 text-left">
              <div className="text-sm">Suppliers</div>
              {loading ? (
                <div className="w-5 h-5 border-4 border-green-700 border-solid rounded-full border-t-transparent animate-spin mt-4"></div>
              ) : (
                <div className="text-2xl sm:text-3xl">{supplierCount}</div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-5">
          <div className="flex bg-white rounded-xl drop-shadow-md transition-all hover:scale-105">
            <div className="pr-6 sm:pr-10 pl-4 py-6 text-left">
              <div className="text-sm">Products</div>
              {loading ? (
                <div className="w-5 h-5 border-4 border-green-700 border-solid rounded-full border-t-transparent animate-spin mt-4"></div>
              ) : (
                <div className="text-2xl sm:text-3xl">{productCount}</div>
              )}
            </div>
          </div>

          <div className="flex bg-white rounded-xl drop-shadow-md transition-all hover:scale-105">
            <div className="pr-6 sm:pr-10 pl-4 py-6 text-left">
              <div className="text-sm">Total Sales</div>
              {loading ? (
                <div className="w-5 h-5 border-4 border-green-700 border-solid rounded-full border-t-transparent animate-spin mt-4"></div>
              ) : (
                <div className="text-2xl sm:text-3xl">{salesData.reduce((acc, curr) => acc + curr.sales, 0)}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <SalesAnalytics salesData={salesData} />
      </div>
    </div>
  );
}

export default Dashboard;