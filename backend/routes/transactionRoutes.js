const express = require('express');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, data: { message: error.message } });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { amount, type, description } = req.body;

    const transaction = await Transaction.create({
      userId: req.user.id,
      amount,
      type,
      description
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, data: { message: error.message } });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const { amount, type, description } = req.body;
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ success: false, data: { message: 'Transaction not found' } });
    if (transaction.userId.toString() !== req.user.id) return res.status(401).json({ success: false, data: { message: 'Not authorized' } });

    transaction = await Transaction.findByIdAndUpdate(req.params.id, { amount, type, description }, { new: true });
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, data: { message: error.message } });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ success: false, data: { message: 'Transaction not found' } });
    if (transaction.userId.toString() !== req.user.id) return res.status(401).json({ success: false, data: { message: 'Not authorized' } });

    await transaction.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, data: { message: error.message } });
  }
});

module.exports = router;
