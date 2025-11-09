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
  getPaymentMethods
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

export default router;