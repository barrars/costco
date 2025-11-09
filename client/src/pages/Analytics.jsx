import { useState, useEffect } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

import {
  Chart as ChartJS,
  CategoryScale,
  TimeScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  TimeScale,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  const [spendingPatterns, setSpendingPatterns] = useState([]);
  const [gasAnalysis, setGasAnalysis] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [warehouseTax, setWarehouseTax] = useState([]);
  const [savings, setSavings] = useState([]);
  const [shoppingTimes, setShoppingTimes] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const endpoints = [
        'spending-patterns',
        'gas-analysis',
        'top-categories',
        'monthly-trends',
        'warehouse-tax',
        'savings',
        'shopping-times',
        'top-items',
        'payment-methods'
      ];

      const responses = await Promise.all(
        endpoints.map(endpoint => fetch(`/api/analytics/${endpoint}`))
      );

      const data = await Promise.all(responses.map(res => res.json()));

      setSpendingPatterns(data[0]);
      setGasAnalysis(data[1]);
      setTopCategories(data[2]);
      setMonthlyTrends(data[3]);
      setWarehouseTax(data[4]);
      setSavings(data[5]);
      setShoppingTimes(data[6]);
      setTopItems(data[7]);
      setPaymentMethods(data[8]);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

const spendingPatternsData = {
  datasets: [
    {
      label: 'Total Spent',
      data: spendingPatterns.map(item => ({
        x: new Date(item.transactionDateTime),
        y: item.totalSpent,
      })),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
    {
      label: 'Average Transaction',
      data: spendingPatterns.map(item => ({
        x: new Date(item.transactionDateTime),
        y: item.averageTransaction,
      })),
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
    },
  ],
};

  const monthlyTrendsData = (() => {
    const allMonths = [...new Set(monthlyTrends.map(item => item._id.month))].sort();

    const inWarehouseSpent = allMonths.map(month => {
      const item = monthlyTrends.find(item => item._id.month === month && item._id.type === 'In-Warehouse');
      return item ? item.monthlySpent : null;
    });

    const gasStationSpent = allMonths.map(month => {
      const item = monthlyTrends.find(item => item._id.month === month && item._id.type === 'Gas Station');
      return item ? item.monthlySpent : null;
    });

    const inWarehouseCount = allMonths.map(month => {
      const item = monthlyTrends.find(item => item._id.month === month && item._id.type === 'In-Warehouse');
      return item ? item.transactionCount : null;
    });

    const gasStationCount = allMonths.map(month => {
      const item = monthlyTrends.find(item => item._id.month === month && item._id.type === 'Gas Station');
      return item ? item.transactionCount : null;
    });

    return {
      labels: allMonths,
      datasets: [
        {
          type: 'line',
          label: 'In-Warehouse Spending ($)',
          data: inWarehouseSpent,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Gas Station Spending ($)',
          data: gasStationSpent,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          yAxisID: 'y',
        },
        {
          type: 'bar',
          label: 'In-Warehouse Receipts',
          data: inWarehouseCount,
          backgroundColor: 'rgba(75, 192, 192, 0.4)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          yAxisID: 'y1',
        },
        {
          type: 'bar',
          label: 'Gas Station Receipts',
          data: gasStationCount,
          backgroundColor: 'rgba(255, 99, 132, 0.4)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          yAxisID: 'y1',
        },
      ],
    };
  })();

  const topCategoriesData = {
    labels: topCategories.map(item => `Dept ${item._id}`),
    datasets: [
      {
        label: 'Total Spent',
        data: topCategories.map(item => item.totalSpent),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
          'rgba(83, 102, 255, 0.6)',
          'rgba(255, 99, 255, 0.6)',
          'rgba(99, 255, 132, 0.6)',
        ],
      },
    ],
  };

  const shoppingTimesData = {
    labels: shoppingTimes.map(item => item._id),
    datasets: [
      {
        label: 'Total Spent',
        data: shoppingTimes.map(item => item.totalSpent),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'Transaction Count',
        data: shoppingTimes.map(item => item.transactionCount),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Costco Receipt Analytics</h1>

      <div style={{ marginBottom: '40px' }}>
        <h2>Spending Patterns by Receipt Type</h2>
        <Bar data={spendingPatternsData}
        options={{
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  }} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Monthly Spending Trends</h2>
        <Line
          data={monthlyTrendsData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Monthly Spending & Receipt Count by Type',
              },
            },
            scales: {
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Amount Spent ($)',
                },
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Receipts',
                },
                grid: {
                  drawOnChartArea: false,
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Month',
                },
              },
            },
            spanGaps: true,
          }}
        />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Top Product Categories</h2>
        <Pie data={topCategoriesData} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Shopping Time Patterns</h2>
        <Bar data={shoppingTimesData} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Gas Analysis</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Grade</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Location</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Gallons</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Spent</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Avg Price/Gallon</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fill-ups</th>
              </tr>
            </thead>
            <tbody>
              {gasAnalysis.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item._id.grade}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item._id.location}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.totalGallons.toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.totalSpent.toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.averagePricePerGallon.toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.fillUps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Warehouse & Tax Analysis</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>City</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>State</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Spent</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Taxes</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Avg Tax Rate</th>
              </tr>
            </thead>
            <tbody>
              {warehouseTax.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item._id.city}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item._id.state}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.totalSpent.toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.totalTaxes.toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{(item.averageTaxRate * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Savings Analysis</h2>
        {savings.length > 0 && (
          <div>
            <p>Total Savings: ${savings[0].totalSavings.toFixed(2)}</p>
            <p>Savings Transactions: {savings[0].savingsTransactions}</p>
            <p>Average Savings per Transaction: ${savings[0].averageSavingsPerTransaction.toFixed(2)}</p>
            <p>Max Single Savings: ${savings[0].maxSingleSavings.toFixed(2)}</p>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Top Items</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Item</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Spent</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Times Purchased</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Avg Price</th>
              </tr>
            </thead>
            <tbody>
              {topItems.slice(0, 15).map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item._id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.totalSpent.toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.timesPurchased}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.averagePrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Payment Methods</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Payment Method</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Spent</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Transactions</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethods.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item._id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.totalSpent.toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.transactionCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;