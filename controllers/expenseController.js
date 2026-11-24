const Expense = require('../models/expense');

const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_AMOUNT_YEN = 99_999_999;
const MAX_EXPENSE_ID = 2_147_483_647;

function validateExpense(body) {
    const description = typeof body?.description === 'string' ? body.description.trim() : '';
    if (description.length === 0 || description.length > MAX_DESCRIPTION_LENGTH) {
        return { error: '説明は1〜1000文字で入力してください。' };
    }
    const rawAmount = body?.amount;
    const amount = typeof rawAmount === 'string' && /^[0-9]+$/.test(rawAmount.trim())
        ? Number(rawAmount.trim())
        : rawAmount;
    if (!Number.isSafeInteger(amount) || amount < 1 || amount > MAX_AMOUNT_YEN) {
        return { error: '金額は1〜99,999,999円の整数で入力してください。' };
    }
    return { description, amount };
}

function validateId(rawId) {
    if (!/^[1-9][0-9]*$/.test(rawId)) {
        return null;
    }
    const id = Number(rawId);
    return Number.isSafeInteger(id) && id <= MAX_EXPENSE_ID ? id : null;
}

function handleDatabaseError(res, message, error) {
    console.error(message, { code: error.code ?? 'UNKNOWN' });
    return res.status(500).json({ message });
}

// 経費報告の作成
async function createExpense(req, res) {
    try {
        const input = validateExpense(req.body);
        if (input.error) {
            return res.status(400).json({ message: input.error });
        }
        const id = await Expense.createExpense(input.description, input.amount);
        res.status(201).json({ message: '経費報告が作成されました', id });
    } catch (error) {
        handleDatabaseError(res, '経費報告の作成中にエラーが発生しました', error);
    }
}

// 全ての経費報告を取得
async function getAllExpenses(req, res) {
    try {
        const expenses = await Expense.getAllExpenses();
        res.json(expenses);
    } catch (error) {
        handleDatabaseError(res, '経費報告の取得中にエラーが発生しました', error);
    }
}

// 経費報告の更新
async function updateExpense(req, res) {
    try {
        const id = validateId(req.params.id);
        if (id === null) {
            return res.status(400).json({ message: '経費IDが無効です。' });
        }
        const input = validateExpense(req.body);
        if (input.error) {
            return res.status(400).json({ message: input.error });
        }
        const success = await Expense.updateExpense(id, input.description, input.amount);
        if (success) {
            res.json({ message: '経費報告が更新されました' });
        } else {
            res.status(404).json({ message: '経費報告が見つからないか、更新できません' });
        }
    } catch (error) {
        handleDatabaseError(res, '経費報告の更新中にエラーが発生しました', error);
    }
}

// 経費報告の削除
async function deleteExpense(req, res) {
    try {
        const id = validateId(req.params.id);
        if (id === null) {
            return res.status(400).json({ message: '経費IDが無効です。' });
        }
        const success = await Expense.deleteExpense(id);
        if (success) {
            res.json({ message: '経費報告が削除されました' });
        } else {
            res.status(404).json({ message: '経費報告が見つかりません' });
        }
    } catch (error) {
        handleDatabaseError(res, '経費報告の削除中にエラーが発生しました', error);
    }
}

module.exports = {
    createExpense,
    getAllExpenses,
    updateExpense,
    deleteExpense
};