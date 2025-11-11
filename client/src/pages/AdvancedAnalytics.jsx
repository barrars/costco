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

function AdvancedAnalytics() {
  const [monthlySpendingTrends, setMonthlySpendingTrends] = useState([]);
  const [productCategoryDeepDive, setProductCategoryDeepDive] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [savingsCouponAnalysis, setSavingsCouponAnalysis] = useState([]);
  const [shoppingLocationPatterns, setShoppingLocationPatterns] = useState([]);
  const [bigTicketItems, setBigTicketItems] = useState([]);
  const [shoppingTimePatterns, setShoppingTimePatterns] = useState([]);
  const [refundAnalysis, setRefundAnalysis] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const endpoints = [
        'monthly-spending-trends',
        'product-category-deep-dive',
        'favorite-products',
        'savings-coupon-analysis',
        'shopping-location-patterns',
        'big-ticket-items',
        'shopping-time-patterns',
        'refund-analysis'
      ];

      const responses = await Promise.all(
        endpoints.map(endpoint => fetch(`/api/analytics/${endpoint}`))
      );

      const data = await Promise.all(responses.map(res => res.json()));

      setMonthlySpendingTrends(data[0]);
      setProductCategoryDeepDive(data[1]);
      setFavoriteProducts(data[2]);
      setSavingsCouponAnalysis(data[3]);
      setShoppingLocationPatterns(data[4]);
      setBigTicketItems(data[5]);
      setShoppingTimePatterns(data[6]);
      setRefundAnalysis(data[7]);
    } catch (error) {
      console.error('Error fetching advanced analytics data:', error);
    }
  };

  const monthlySpendingTrendsData = {
    labels: monthlySpendingTrends.map(item => item._id),
    datasets: [
      {
        label: 'Total Spent',
        data: monthlySpendingTrends.map(item => item.totalSpent),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y',
      },
      {
        label: 'Transaction Count',
        data: monthlySpendingTrends.map(item => item.transactionCount),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y1',
      },
    ],
  };

  const productCategoryData = {
    labels: productCategoryDeepDive.map(item => item._id),
    datasets: [
      {
        label: 'Total Spent',
        data: productCategoryDeepDive.map(item => item.totalSpent),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
        ],
      },
    ],
  };

  const favoriteProductsData = {
    labels: favoriteProducts.map(item => item._id.name),
    datasets: [
      {
        label: 'Times Purchased',
        data: favoriteProducts.map(item => item.timesPurchased),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const shoppingTimePatternsData = {
    labels: shoppingTimePatterns.map(item => item._id),
    datasets: [
      {
        label: 'Total Spent',
        data: shoppingTimePatterns.map(item => item.totalSpent),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Transaction Count',
        data: shoppingTimePatterns.map(item => item.transactionCount),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Advanced Costco Receipt Analytics</h1>

      <div style={{ marginBottom: '40px' }}>
        <h2>Monthly Spending Trends & Seasonality</h2>
        <Line
          data={monthlySpendingTrendsData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Monthly Spending Patterns',
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
                  text: 'Number of Transactions',
                },
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
          }}
        />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Product Category Deep Dive</h2>
        <Pie data={productCategoryData} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Your Favorite Products & Repeat Purchases</h2>
        <Bar data={favoriteProductsData} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Savings & Coupon Analysis</h2>
        {savingsCouponAnalysis.length > 0 && (
          <div>
            <p>Total Savings: ${savingsCouponAnalysis[0].totalSavings.toFixed(2)}</p>
            <p>Total Spent: ${savingsCouponAnalysis[0].totalSpent.toFixed(2)}</p>
            <p>Effective Savings Rate: {savingsCouponAnalysis[0].effectiveSavingsRate.toFixed(2)}%</p>
            <p>Transactions with Savings: {savingsCouponAnalysis[0].transactionsWithSavings}</p>
            <p>Transactions with Coupons: {savingsCouponAnalysis[0].transactionsWithCoupons}</p>
            <p>Average Savings per Transaction: ${savingsCouponAnalysis[0].averageSavingsPerTransaction.toFixed(2)}</p>
            <p>Max Single Savings: ${savingsCouponAnalysis[0].maxSingleSavings.toFixed(2)}</p>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Shopping Location Patterns</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>City</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>State</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Spent</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Transactions</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Avg Transaction</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Savings</th>
              </tr>
            </thead>
            <tbody>
              {shoppingLocationPatterns.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item._id.city}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item._id.state}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.totalSpent.toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.transactionCount}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.averageTransaction.toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.totalSavings.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Big Ticket Items & Electronics Purchases</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Item Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Amount</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Department</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Warehouse</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Transaction Date</th>
              </tr>
            </thead>
            <tbody>
              {bigTicketItems.slice(0, 20).map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.itemName}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.amount.toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.department}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.warehouse}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.transactionDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Shopping Time & Day Patterns</h2>
        <Bar data={shoppingTimePatternsData} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Refund & Return Analysis</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Item Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Refunded</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Refund Count</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Department</th>
              </tr>
            </thead>
            <tbody>
              {refundAnalysis.slice(0, 15).map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item._id.itemName}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${Math.abs(item.totalRefunded).toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.refundCount}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item._id.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdvancedAnalytics;