import { getDB } from '../config/database.js';

export const getSpendingPatterns = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('receiptdata').aggregate([
      {
        $group: {
          _id: "$receiptType",
          totalSpent: { $sum: "$total" },
          averageTransaction: { $avg: "$total" },
          transactionCount: { $sum: 1 },
          maxTransaction: { $max: "$total" },
          minTransaction: { $min: "$total" }
        }
      }
    ]).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGasAnalysis = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('receiptdata').aggregate([
      {
        $match: {
          "receiptType": "Gas Station",
          "itemArray.fuelGradeDescription": { $exists: true }
        }
      },
      {
        $unwind: "$itemArray"
      },
      {
        $match: {
          "itemArray.fuelGradeDescription": { $exists: true }
        }
      },
      {
        $group: {
          _id: {
            grade: "$itemArray.fuelGradeDescription",
            location: "$warehouseCity"
          },
          totalGallons: { $sum: "$itemArray.fuelUnitQuantity" },
          totalSpent: { $sum: "$total" },
          averagePricePerGallon: { $avg: "$itemArray.itemUnitPriceAmount" },
          fillUps: { $sum: 1 },
          averageFillAmount: { $avg: "$itemArray.fuelUnitQuantity" }
        }
      }
    ]).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTopCategories = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('receiptdata').aggregate([
      {
        $unwind: "$itemArray"
      },
      {
        $match: {
          "itemArray.amount": { $gt: 0 }
        }
      },
      {
        $group: {
          _id: "$itemArray.itemDepartmentNumber",
          totalSpent: { $sum: "$itemArray.amount" },
          itemCount: { $sum: 1 },
          averageItemPrice: { $avg: "$itemArray.amount" },
          items: {
            $addToSet: {
              description: "$itemArray.itemDescription01",
              price: "$itemArray.amount"
            }
          }
        }
      },
      {
        $sort: { totalSpent: -1 }
      },
      {
        $limit: 10
      }
    ]).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMonthlyTrends = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('receiptdata').aggregate([
      {
        $project: {
          yearMonth: { $substr: ["$transactionDateTime", 0, 7] },
          total: 1,
          receiptType: 1,
          warehouseCity: 1
        }
      },
      {
        $group: {
          _id: {
            month: "$yearMonth",
            type: "$receiptType"
          },
          monthlySpent: { $sum: "$total" },
          transactionCount: { $sum: 1 },
          locations: { $addToSet: "$warehouseCity" }
        }
      },
      {
        $sort: { "_id.month": 1 }
      }
    ]).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWarehouseTax = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('receiptdata').aggregate([
      {
        $group: {
          _id: {
            city: "$warehouseCity",
            state: "$warehouseState"
          },
          totalSpent: { $sum: "$total" },
          totalTaxes: { $sum: "$taxes" },
          transactionCount: { $sum: 1 },
          averageTaxRate: {
            $avg: {
              $cond: [
                { $gt: ["$subTotal", 0] },
                { $divide: ["$taxes", "$subTotal"] },
                0
              ]
            }
          }
        }
      },
      {
        $sort: { totalSpent: -1 }
      }
    ]).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSavings = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('receiptdata').aggregate([
      {
        $match: { "instantSavings": { $gt: 0 } }
      },
      {
        $group: {
          _id: null,
          totalSavings: { $sum: "$instantSavings" },
          savingsTransactions: { $sum: 1 },
          averageSavingsPerTransaction: { $avg: "$instantSavings" },
          maxSingleSavings: { $max: "$instantSavings" }
        }
      }
    ]).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getShoppingTimes = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('receiptdata').aggregate([
      {
        $project: {
          hour: { $toInt: { $substr: ["$transactionDateTime", 11, 2] } },
          dayOfWeek: { $dayOfWeek: { $toDate: "$transactionDateTime" } },
          total: 1,
          receiptType: 1
        }
      },
      {
        $bucket: {
          groupBy: "$hour",
          boundaries: [0, 6, 12, 18, 24],
          default: "Other",
          output: {
            totalSpent: { $sum: "$total" },
            transactionCount: { $sum: 1 },
            averageSpend: { $avg: "$total" }
          }
        }
      }
    ]).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTopItems = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('receiptdata').aggregate([
      {
        $unwind: "$itemArray"
      },
      {
        $match: {
          "itemArray.amount": { $gt: 0 },
          "itemArray.itemDescription01": { $not: { $regex: "^/" } }
        }
      },
      {
        $group: {
          _id: "$itemArray.itemDescription01",
          totalSpent: { $sum: "$itemArray.amount" },
          timesPurchased: { $sum: 1 },
          averagePrice: { $avg: "$itemArray.amount" },
          departments: { $addToSet: "$itemArray.itemDepartmentNumber" },
          locations: { $addToSet: "$warehouseCity" }
        }
      },
      {
        $sort: { timesPurchased: -1 }
      },
      {
        $limit: 15
      }
    ]).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentMethods = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('receiptdata').aggregate([
      {
        $unwind: "$tenderArray"
      },
      {
        $group: {
          _id: "$tenderArray.tenderTypeName",
          totalSpent: { $sum: "$tenderArray.amountTender" },
          transactionCount: { $sum: 1 },
          lastFourDigits: { $addToSet: "$tenderArray.displayAccountNumber" }
        }
      }
    ]).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};