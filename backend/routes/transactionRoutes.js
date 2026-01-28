const express = require('express');
const router = express.Router();
const {
    processCheckout,
    getMyTransactions,
    getAllTransactions,
    getUserTransactionsAdmin,
    deleteTransactionAdmin,
    unlockItem
} = require('../controllers/transactionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/checkout', protect, processCheckout);
router.post('/unlock', protect, unlockItem);
router.get('/my', protect, getMyTransactions);
router.get('/admin', protect, admin, getAllTransactions);
router.get('/admin/user/:id', protect, admin, getUserTransactionsAdmin);
router.delete('/admin/:id', protect, admin, deleteTransactionAdmin);

module.exports = router;
