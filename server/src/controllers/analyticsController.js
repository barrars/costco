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

export const getMonthlySpendingTrends = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('receiptdata').aggregate([
      {
        $match: {
          "transactionDate": { $exists: true },
          "total": { $gt: 0 }
        }
      },
      {
        $project: {
          yearMonth: { $substr: ["$transactionDate", 0, 7] },
          month: { $month: { $toDate: "$transactionDateISO" } },
          year: { $year: { $toDate: "$transactionDateISO" } },
          total: 1,
          itemCount: "$totalItemCount",
          instantSavings: 1,
          warehouseState: 1
        }
      },
      {
        $group: {
          _id: "$yearMonth",
          totalSpent: { $sum: "$total" },
          transactionCount: { $sum: 1 },
          averageTransaction: { $avg: "$total" },
          totalSavings: { $sum: "$instantSavings" },
          totalItems: { $sum: "$itemCount" },
          states: { $addToSet: "$warehouseState" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductCategoryDeepDive = async (req, res) => {
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
          _id: {
            department: "$itemArray.itemDepartmentNumber",
            category: {
              $switch: {
                branches: [
                  { case: { $in: ["$itemArray.itemDepartmentNumber", [65, 18, 17, 19]] }, then: "Fresh Food" },
                  { case: { $in: ["$itemArray.itemDepartmentNumber", [12, 13]] }, then: "Pantry" },
                  { case: { $in: ["$itemArray.itemDepartmentNumber", [61]] }, then: "Meat" },
                  { case: { $in: ["$itemArray.itemDepartmentNumber", [20, 39]] }, then: "Health & Clothing" },
                  { case: { $in: ["$itemArray.itemDepartmentNumber", [23, 24, 27]] }, then: "Electronics & Home" },
                  { case: { $eq: ["$itemArray.itemDepartmentNumber", 14] }, then: "Pet Supplies" }
                ],
                default: "Other"
              }
            }
          },
          totalSpent: { $sum: "$itemArray.amount" },
          itemCount: { $sum: 1 },
          uniqueProducts: { $addToSet: "$itemArray.itemActualName" },
          averagePrice: { $avg: "$itemArray.amount" }
        }
      },
      {
        $group: {
          _id: "$_id.category",
          totalSpent: { $sum: "$totalSpent" },
          itemCount: { $sum: "$itemCount" },
          uniqueProductCount: { $sum: { $size: "$uniqueProducts" } },
          departments: { $addToSet: "$_id.department" }
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

export const getFavoriteProducts = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('receiptdata').aggregate([
      {
        $unwind: "$itemArray"
      },
      {
        $match: {
          "itemArray.amount": { $gt: 0 },
          "itemArray.itemActualName": { $exists: true, $ne: "" },
          "itemArray.itemDescription01": { $not: { $regex: "^/" } }
        }
      },
      {
        $group: {
          _id: {
            itemId: "$itemArray.itemNumber",
            name: "$itemArray.itemActualName"
          },
          timesPurchased: { $sum: 1 },
          totalSpent: { $sum: "$itemArray.amount" },
          averagePrice: { $avg: "$itemArray.amount" },
          firstPurchase: { $min: "$transactionDate" },
          lastPurchase: { $max: "$transactionDate" },
          departments: { $addToSet: "$itemArray.itemDepartmentNumber" },
          locations: { $addToSet: "$warehouseCity" }
        }
      },
      {
        $match: {
          "timesPurchased": { $gte: 2 }
        }
      },
      {
        $sort: { timesPurchased: -1, totalSpent: -1 }
      },
      {
        $limit: 20
      }
    ]).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSavingsCouponAnalysis = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('receiptdata').aggregate([
      {
        $project: {
          transactionDate: 1,
          instantSavings: 1,
          total: 1,
          hasCoupons: { $gt: [{ $size: { $ifNull: ["$couponArray", []] } }, 0] },
          couponCount: { $size: { $ifNull: ["$couponArray", []] } },
          savingsRate: {
            $cond: [
              { $gt: ["$total", 0] },
              { $divide: ["$instantSavings", "$total"] },
              0
            ]
          }
        }
      },
      {
        $match: {
          "total": { $gt: 0 }
        }
      },
      {
        $group: {
          _id: null,
          totalSavings: { $sum: "$instantSavings" },
          totalSpent: { $sum: "$total" },
          transactionsWithSavings: { $sum: { $cond: [{ $gt: ["$instantSavings", 0] }, 1, 0] } },
          transactionsWithCoupons: { $sum: { $cond: ["$hasCoupons", 1, 0] } },
          averageSavingsPerTransaction: { $avg: "$instantSavings" },
          averageSavingsRate: { $avg: "$savingsRate" },
          maxSingleSavings: { $max: "$instantSavings" }
        }
      },
      {
        $project: {
          _id: 0,
          totalSavings: 1,
          totalSpent: 1,
          effectiveSavingsRate: { $multiply: [{ $divide: ["$totalSavings", "$totalSpent"] }, 100] },
          transactionsWithSavings: 1,
          transactionsWithCoupons: 1,
          averageSavingsPerTransaction: 1,
          maxSingleSavings: 1
        }
      }
    ]).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getShoppingLocationPatterns = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('receiptdata').aggregate([
      {
        $match: {
          "total": { $gt: 0 }
        }
      },
      {
        $group: {
          _id: {
            city: "$warehouseCity",
            state: "$warehouseState"
          },
          totalSpent: { $sum: "$total" },
          transactionCount: { $sum: 1 },
          averageTransaction: { $avg: "$total" },
          totalSavings: { $sum: "$instantSavings" },
          firstVisit: { $min: "$transactionDate" },
          lastVisit: { $max: "$transactionDate" }
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

export const getBigTicketItems = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('receiptdata').aggregate([
      {
        $unwind: "$itemArray"
      },
      {
        $match: {
          "itemArray.amount": { $gte: 100 },
          "itemArray.itemDescription01": { $not: { $regex: "^/" } }
        }
      },
      {
        $project: {
          transactionDate: 1,
          itemName: "$itemArray.itemActualName",
          amount: "$itemArray.amount",
          department: "$itemArray.itemDepartmentNumber",
          warehouse: "$warehouseCity",
          hasRefund: { $regexMatch: { input: "$itemArray.itemDescription01", regex: "^/" } }
        }
      },
      {
        $sort: { amount: -1 }
      }
    ]).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getShoppingTimePatterns = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('receiptdata').aggregate([
      {
        $project: {
          hour: { $hour: { $toDate: "$transactionDateISO" } },
          dayOfWeek: { $dayOfWeek: { $toDate: "$transactionDateISO" } },
          timeOfDay: {
            $switch: {
              branches: [
                { case: { $lt: ["$hour", 12] }, then: "Morning" },
                { case: { $lt: ["$hour", 17] }, then: "Afternoon" },
                { case: { $lt: ["$hour", 20] }, then: "Evening" }
              ],
              default: "Night"
            }
          },
          total: 1,
          itemCount: "$totalItemCount"
        }
      },
      {
        $group: {
          _id: "$timeOfDay",
          transactionCount: { $sum: 1 },
          totalSpent: { $sum: "$total" },
          averageSpend: { $avg: "$total" },
          averageItems: { $avg: "$itemCount" }
        }
      },
      {
        $sort: { transactionCount: -1 }
      }
    ]).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRefundAnalysis = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('receiptdata').aggregate([
      {
        $match: {
          "transactionType": "Refund"
        }
      },
      {
        $unwind: "$itemArray"
      },
      {
        $match: {
          "itemArray.amount": { $lt: 0 }
        }
      },
      {
        $group: {
          _id: {
            itemName: "$itemArray.itemActualName",
            department: "$itemArray.itemDepartmentNumber"
          },
          totalRefunded: { $sum: "$itemArray.amount" },
          refundCount: { $sum: 1 },
          refundLocations: { $addToSet: "$warehouseCity" },
          refundDates: { $addToSet: "$transactionDate" }
        }
      },
      {
        $sort: { totalRefunded: 1 }
      }
    ]).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchItems = async (req, res) => {
  try {
    const { q: searchQuery } = req.query;
    if (!searchQuery || searchQuery.trim().length < 2) {
      return res.json([]);
    }

    const db = getDB();
    const trimmedQuery = searchQuery.trim();

    // First try text search with indexes for better performance
    let results = [];

    try {
      // Use text search for exact matches and close matches
      const textSearchResults = await db.collection('receiptdata').aggregate([
        {
          $match: {
            $text: { $search: trimmedQuery }
          }
        },
        {
          $unwind: "$itemArray"
        },
        {
          $match: {
            $or: [
              { "itemArray.itemActualName": { $regex: new RegExp(trimmedQuery, 'i') } },
              { "itemArray.itemDescription01": { $regex: new RegExp(trimmedQuery, 'i') } },
              { "itemArray.itemDescription02": { $regex: new RegExp(trimmedQuery, 'i') } }
            ],
            "itemArray.amount": { $gt: 0 } // Exclude refunds
          }
        },
        {
          $project: {
            _id: 0,
            receiptId: "$_id",
            transactionDate: 1,
            transactionDateTime: 1,
            warehouseCity: 1,
            warehouseState: 1,
            receiptType: 1,
            item: {
              itemNumber: "$itemArray.itemNumber",
              itemActualName: "$itemArray.itemActualName",
              itemDescription01: "$itemArray.itemDescription01",
              itemDescription02: "$itemArray.itemDescription02",
              amount: "$itemArray.amount",
              unitPrice: "$itemArray.itemUnitPriceAmount",
              quantity: "$itemArray.unit",
              department: "$itemArray.itemDepartmentNumber",
              image: "$itemArray.fullItemImage"
            },
            score: { $meta: "textScore" }
          }
        },
        {
          $sort: { score: -1, transactionDate: -1 }
        }
      ]).toArray();

      results = textSearchResults;
    } catch (textSearchError) {
      console.log('Text search failed, falling back to regex:', textSearchError.message);
    }

    // If text search didn't work or returned few results, try regex-only search
    if (results.length === 0) {
      try {
        const regexQuery = new RegExp(trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

        results = await db.collection('receiptdata').aggregate([
          {
            $unwind: "$itemArray"
          },
          {
            $match: {
              $or: [
                { "itemArray.itemActualName": { $regex: regexQuery } },
                { "itemArray.itemDescription01": { $regex: regexQuery } },
                { "itemArray.itemDescription02": { $regex: regexQuery } }
              ],
              "itemArray.amount": { $gt: 0 } // Exclude refunds
            }
          },
          {
            $project: {
              _id: 0,
              receiptId: "$_id",
              transactionDate: 1,
              transactionDateTime: 1,
              warehouseCity: 1,
              warehouseState: 1,
              receiptType: 1,
              item: {
                itemNumber: "$itemArray.itemNumber",
                itemActualName: "$itemArray.itemActualName",
                itemDescription01: "$itemArray.itemDescription01",
                itemDescription02: "$itemArray.itemDescription02",
                amount: "$itemArray.amount",
                unitPrice: "$itemArray.itemUnitPriceAmount",
                quantity: "$itemArray.unit",
                department: "$itemArray.itemDepartmentNumber",
                image: "$itemArray.fullItemImage"
              }
            }
          },
          {
            $sort: { transactionDate: -1 }
          }
        ]).toArray();
      } catch (regexError) {
        console.error('Regex search error:', regexError);
        results = [];
      }
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};