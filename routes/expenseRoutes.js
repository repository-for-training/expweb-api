const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// 経費報告の作成
router.post('/', expenseController.createExpense);

// 全ての経費報告を取得
router.get('/', expenseController.getAllExpenses);

// 経費報告の更新
router.put('/:id', expenseController.updateExpense);

// 経費報告の削除
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;