import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesAnalytics = ({ salesData }) => {
  // Log the received salesData to debug
  console.log("Sales Data Received by SalesAnalytics:", salesData);

  // If there's no sales data, show a message
  if (!salesData || salesData.length === 0) {
    return <div>No sales data available for the selected period.</div>;
  }

  // Prepare data for the chart
  const chartData = {
    labels: salesData.map(data => data.month),  // x-axis labels (month)
    datasets: [
      {
        label: 'Sales by Month',
        data: salesData.map(data => data.sales),  // y-axis (sales count)
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="sales-analytics">
      <h2>Sales Analytics (Monthly)</h2>
      <Line data={chartData} />
    </div>
  );
};

export default SalesAnalytics;
