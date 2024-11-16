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
  const [totalStock, setTotalStock] = useState(0); 
  const [totalStock2, setTotalStock2] = useState(0); 

  const fetchCount = async (collectionName, setter) => {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      setter(snapshot.size);
    } catch (error) {
      toast.error(`Error fetching ${collectionName} count: ${error.message}`);
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
        const monthYear = `${date.substring(0, 7)}`;
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

  const fetchTotalStock = async () => {
    try {
      const productCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productCollection);
      let total = 0;
  
      productSnapshot.forEach((doc) => {
        const productData = doc.data();
        if (productData.variants && Array.isArray(productData.variants)) {
          productData.variants.forEach(variant => {
            if (variant.outStock) {
              total += variant.outStock;
            }
          });
        }
      });
  
      setTotalStock(total);
    } catch (error) {
      toast.error("Error fetching product stock: ", error);
    }
  };

  const fetchTotalStock2 = async () => {
    try {
      const productCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productCollection);
      let total = 0;
  
      productSnapshot.forEach((doc) => {
        const productData = doc.data();
        if (productData.variants && Array.isArray(productData.variants)) {
          productData.variants.forEach(variant => {
            if (variant.quantity) {
              total += Number(variant.quantity); // Ensure quantity is treated as a number
            }
          });
        }
      });
  
      setTotalStock2(total);
    } catch (error) {
      toast.error("Error fetching product stock: ", error);
    }
  };
  

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      await Promise.all([
        fetchCount('customerusers', setCustomerCount),
        fetchCount('supplier', setSupplierCount),
        fetchCount('products', setProductCount)
      ]);
      fetchSalesData();
      fetchTotalStock(); 
      fetchTotalStock2(); 
    };
    fetchCounts();
  }, []);

  const totalUsers = customerCount + supplierCount;

  return (
    <div className="mt-10 px-4 sm:px-10">
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-5">
        <div className="flex w-flex gap-x-5">
          <div className="flex bg-red-800 hover:bg-red-900 font-bold text-white backdrop-blur-md bg-opacity-70 rounded-xl w-full drop-shadow-md transition-all hover:scale-105">
            <div className="pr-6 sm:pr-10 pl-4 py-6 text-left">
              <div className="text-sm drop-shadow-md uppercase">Total Users</div>
              {loading ? (
                <div className="w-5 h-5 border-4 border-green-700 border-solid rounded-full border-t-transparent animate-spin mt-4"></div>
              ) : (
                <div className="text-2xl sm:text-3xl">{totalUsers}</div>
              )}
            </div>
          </div>
          <div className="flex hover:bg-blue-900 text-white backdrop-blur-md bg-opacity-70 font-bold drop-shadow-md bg-blue-800 rounded-xl w-full transition-all hover:scale-105">
            <div className="pr-6 sm:pr-10 pl-4 py-6 text-left">
              <div className="text-sm uppercase">Customers</div>
              {loading ? (
                <div className="w-5 h-5 border-4 border-green-700 border-solid rounded-full border-t-transparent animate-spin mt-4"></div>
              ) : (
                <div className="text-2xl sm:text-3xl">{customerCount}</div>
              )}
            </div>
          </div>
          <div className="flex hover:bg-orange-900 text-white backdrop-blur-md bg-opacity-70 font-bold bg-orange-800 rounded-xl w-full drop-shadow-md transition-all hover:scale-105">
            <div className="pr-6 sm:pr-10 pl-4 py-6 text-left">
              <div className="text-sm uppercase">Suppliers</div>
              {loading ? (
                <div className="w-5 h-5 border-4 border-green-700 border-solid rounded-full border-t-transparent animate-spin mt-4"></div>
              ) : (
                <div className="text-2xl sm:text-3xl">{supplierCount}</div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-x-5">
          <div className="flex hover:bg-pink-900 text-white backdrop-blur-md bg-opacity-70 font-bold bg-pink-800 rounded-xl drop-shadow-md transition-all hover:scale-105">
            <div className="pr-6 sm:pr-10 pl-4 py-6 text-left">
              <div className="text-sm uppercase">Products</div>
              {loading ? (
                <div className="w-5 h-5 border-4 border-green-700 border-solid rounded-full border-t-transparent animate-spin mt-4"></div>
              ) : (
                <div className="text-2xl sm:text-3xl">{productCount}</div>
              )}
            </div>
          </div>
          <div className="flex hover:bg-yellow-900 text-white backdrop-blur-md bg-opacity-70 font-bold bg-yellow-800 rounded-xl drop-shadow-md transition-all hover:scale-105">
            <div className="pr-6 sm:pr-10 pl-4 py-6 text-left">
              <div className="text-sm uppercase">Total Sales</div>
              {loading ? (
                <div className="w-5 h-5 border-4 border-green-700 border-solid rounded-full border-t-transparent animate-spin mt-4"></div>
              ) : (
                <div className="text-2xl sm:text-3xl">{salesData.reduce((acc, curr) => acc + curr.sales, 0)}</div>
              )}
            </div>
          </div>
          <div className="flex hover:bg-yellow-900 text-white backdrop-blur-md bg-opacity-70 font-bold bg-yellow-800 rounded-xl drop-shadow-md transition-all hover:scale-105">
            <div className="pr-6 sm:pr-10 pl-4 py-6 text-left">
              <div className="text-sm uppercase">Total product out-stock</div>
              {loading ? (
                <div className="w-5 h-5 border-4 border-green-700 border-solid rounded-full border-t-transparent animate-spin mt-4"></div>
              ) : (
                <div className="text-2xl sm:text-3xl">{totalStock}</div>
              )}
            </div>
          </div>
          <div className="flex hover:bg-yellow-900 text-white backdrop-blur-md bg-opacity-70 font-bold bg-yellow-800 rounded-xl drop-shadow-md transition-all hover:scale-105">
            <div className="pr-6 sm:pr-10 pl-4 py-6 text-left">
              <div className="text-sm uppercase">Total product in-stock</div>
              {loading ? (
                <div className="w-5 h-5 border-4 border-green-700 border-solid rounded-full border-t-transparent animate-spin mt-4"></div>
              ) : (
                <div className="text-2xl sm:text-3xl">{totalStock2}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <SalesAnalytics salesData={salesData} />
    </div>
  );
}

export default Dashboard;
