import express from 'express';
import {
  getSpendingPatterns,
  getGasAnalysis,
  getTopCategories,
  getMonthlyTrends,
  getWarehouseTax,
  getSavings,
  getShoppingTimes,
  getTopItems,
  getPaymentMethods,
  getMonthlySpendingTrends,
  getProductCategoryDeepDive,
  getFavoriteProducts,
  getSavingsCouponAnalysis,
  getShoppingLocationPatterns,
  getBigTicketItems,
  getShoppingTimePatterns,
  getRefundAnalysis,
  searchItems
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/spending-patterns', getSpendingPatterns);
router.get('/gas-analysis', getGasAnalysis);
router.get('/top-categories', getTopCategories);
router.get('/monthly-trends', getMonthlyTrends);
router.get('/warehouse-tax', getWarehouseTax);
router.get('/savings', getSavings);
router.get('/shopping-times', getShoppingTimes);
router.get('/top-items', getTopItems);
router.get('/payment-methods', getPaymentMethods);

// New advanced analytics routes
router.get('/monthly-spending-trends', getMonthlySpendingTrends);
router.get('/product-category-deep-dive', getProductCategoryDeepDive);
router.get('/favorite-products', getFavoriteProducts);
router.get('/savings-coupon-analysis', getSavingsCouponAnalysis);
router.get('/shopping-location-patterns', getShoppingLocationPatterns);
router.get('/big-ticket-items', getBigTicketItems);
router.get('/shopping-time-patterns', getShoppingTimePatterns);
router.get('/refund-analysis', getRefundAnalysis);

// Search route
router.get('/search', searchItems);

export default router;