import React, { useEffect, useState } from 'react';
import SalesAnalytics from './SalesAnalytics';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function BarGraphDashboard() {
  const [salesData, setSalesData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('monthlySales');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (view === 'monthlySales') {
        fetchSalesData();
      } else if (view === 'topProducts') {
        fetchTopProductsData();
      } else if (view === 'lowProducts') {
        fetchLowestProductsData();
      }
    };
    fetchData();
  }, [view]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const receivedCollection = collection(db, 'received');
      const receivedSnapshot = await getDocs(receivedCollection);

      const salesByMonth = {};
      const months = [
        '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
        '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'
      ];

      months.forEach(month => {
        salesByMonth[month] = 0;
      });

      receivedSnapshot.docs.forEach(doc => {
        const saleData = doc.data();
        const date = saleData.date;
        if (date) {
          const monthYear = date.substring(0, 7); 
          if (salesByMonth[monthYear] !== undefined) {
            salesByMonth[monthYear] += 1;
          }
        }
      });

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const chartData = months.map((month, index) => ({
        month: monthNames[index],
        sales: salesByMonth[month],
      }));

      setSalesData(chartData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setLoading(false);
    }
  };

  const fetchTopProductsData = async () => {
    try {
      const receivedCollection = collection(db, 'received');
      const receivedSnapshot = await getDocs(receivedCollection);

      const productCountMap = {};

      receivedSnapshot.docs.forEach(doc => {
        const saleData = doc.data();
        const items = saleData.items;

        if (items) {
          items.forEach(item => {
            const productName = item.productName;
            if (productName) {
              productCountMap[productName] = (productCountMap[productName] || 0) + 1;
            }
          });
        }
      });

      const topProducts = Object.entries(productCountMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4); // Top 4 products

      setTopProductsData(topProducts);
    } catch (error) {
      console.error("Error fetching top products data:", error);
    }
  };

  const fetchLowestProductsData = async () => {
    try {
      const receivedCollection = collection(db, 'received');
      const receivedSnapshot = await getDocs(receivedCollection);

      const productCountMap = {};

      receivedSnapshot.docs.forEach(doc => {
        const saleData = doc.data();
        const items = saleData.items;

        if (items) {
          items.forEach(item => {
            const productName = item.productName;
            if (productName) {
              productCountMap[productName] = (productCountMap[productName] || 0) + 1;
            }
          });
        }
      });

      const lowestProducts = Object.entries(productCountMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.count - b.count)
        .slice(0, 4); // Bottom 4 products

      setTopProductsData(lowestProducts);
    } catch (error) {
      console.error("Error fetching lowest products data:", error);
    }
  };

  return (
    <div>
      <div className="mb-4 mt-5 flex justify-end drop-shadow-md">
        <select
          id="viewSelect"
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="monthlySales">Sales by Month</option>
          <option value="topProducts">Top-Selling Products</option>
          <option value="lowProducts">Lowest Product Sales</option>
        </select>
      </div>

      <div className='hidden'>{loading}</div>

      <SalesAnalytics 
        salesData={view === 'monthlySales' ? salesData : topProductsData} 
        view={view}
      />
    </div>
  );
}

export default BarGraphDashboard;
