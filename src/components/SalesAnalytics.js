import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesAnalytics = ({ salesData, view }) => {
  console.log("Sales Data Received by SalesAnalytics:", salesData);

  if (!salesData || salesData.length === 0) {
    return <div>No sales data available for the selected period.</div>;
  }

  // Configuration for Monthly Sales view
  if (view === 'monthlySales' && salesData.some(data => data.sales)) {
    const chartData = {
      labels: salesData.map(data => data.month),
      datasets: [
        {
          label: 'Sales by Month',
          data: salesData.map(data => data.sales),
          backgroundColor: 'rgba(75,192,192,0.6)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    return (
      <div className="sales-analytics flex justify-center mb-10">
        <div className='bg-white w-[750px] p-10 rounded-xl drop-shadow-md '>
          <h2>Sales Analytics (Monthly)</h2>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    );
  }

  if (view === 'topProducts' && salesData.some(data => data.count)) {
    const chartData = {
      labels: salesData.map(data => data.name),
      datasets: [
        {
          label: 'Top-Selling Products',
          data: salesData.map(data => data.count),
          backgroundColor: 'rgba(153,102,255,0.6)',
          borderColor: 'rgba(153,102,255,1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    return (
      <div className="sales-analytics flex justify-center mb-10">
        <div className='bg-white w-[750px] p-10 rounded-xl drop-shadow-md'>
          <h2>Top-Selling Products</h2>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    );
  }

  if (view === 'lowProducts' && salesData.some(data => data.count)) {
    const chartData = {
      labels: salesData.map(data => data.name),
      datasets: [
        {
          label: 'Lower Product Sales',
          data: salesData.map(data => data.count),
          backgroundColor: 'rgba(255,99,132,0.6)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    return (
      <div className="sales-analytics flex justify-center mb-10">
        <div className='bg-white w-[750px] p-10 rounded-xl drop-shadow-md'>
          <h2>Lowest Product Sales</h2>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    );
  }

  return null;
};

export default SalesAnalytics;
