const express = require('express');
const router = express.Router();
const {
    generateCoupon,
    validateCoupon,
    getCoupons,
    deleteCoupon,
    updateCoupon
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getCoupons)
    .post(protect, admin, generateCoupon);

router.post('/validate', protect, validateCoupon);

router.route('/:id')
    .delete(protect, admin, deleteCoupon)
    .put(protect, admin, updateCoupon);

module.exports = router;
