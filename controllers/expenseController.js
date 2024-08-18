const Expense = require('../models/expense');

// 経費報告の作成
async function createExpense(req, res) {
    try {
        const { description, amount } = req.body;
        const id = await Expense.createExpense(description, amount);
        res.status(201).json({ message: '経費報告が作成されました', id });
    } catch (error) {
        res.status(500).json({ message: '経費報告の作成中にエラーが発生しました', error: error.message });
    }
}

// 全ての経費報告を取得
async function getAllExpenses(req, res) {
    try {
        const expenses = await Expense.getAllExpenses();
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: '経費報告の取得中にエラーが発生しました', error: error.message });
    }
}

// 経費報告の更新
async function updateExpense(req, res) {
    try {
        const { id } = req.params;
        const { description, amount } = req.body;
        const success = await Expense.updateExpense(id, description, amount);
        if (success) {
            res.json({ message: '経費報告が更新されました' });
        } else {
            res.status(404).json({ message: '経費報告が見つからないか、更新できません' });
        }
    } catch (error) {
        res.status(500).json({ message: '経費報告の更新中にエラーが発生しました', error: error.message });
    }
}

// 経費報告の削除
async function deleteExpense(req, res) {
    try {
        const { id } = req.params;
        const success = await Expense.deleteExpense(id);
        if (success) {
            res.json({ message: '経費報告が削除されました' });
        } else {
            res.status(404).json({ message: '経費報告が見つかりません' });
        }
    } catch (error) {
        res.status(500).json({ message: '経費報告の削除中にエラーが発生しました', error: error.message });
    }
}

module.exports = {
    createExpense,
    getAllExpenses,
    updateExpense,
    deleteExpense
};