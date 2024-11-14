import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import LoadingButtons from './LoadingButtons';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SalesAnalytics() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const receivedCollection = collection(db, 'received');
        const snapshot = await getDocs(receivedCollection);

        const sales = snapshot.docs.map(doc => doc.data());
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
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const chartLabels = salesData.map(data => {
    const date = new Date(data.month);
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${monthName}-${year}`;
  });

  const chartSales = salesData.map(data => data.sales);

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Sales per Month',
        data: chartSales,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Sales Analytics',
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  if (loading) {
    return <LoadingButtons />;
  }

  return (
    <div className="w-full mx-auto p-4">
      <div className="relative h-96 sm:h-[500px] lg:h-[600px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default SalesAnalytics;
