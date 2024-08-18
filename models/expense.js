const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

class Expense {
    static async createExpense(description, amount) {
        const connection = await mysql.createConnection({
            ...dbConfig,
            database: 'expense_report'
        });
        try {
            const [result] = await connection.query(
                'INSERT INTO expenses (description, amount) VALUES (?, ?)',
                [description, amount]
            );
            return result.insertId;
        } finally {
            await connection.end();
        }
    }

    static async getAllExpenses() {
        const connection = await mysql.createConnection({
            ...dbConfig,
            database: 'expense_report'
        });
        try {
            const [rows] = await connection.query('SELECT * FROM expenses ORDER BY created_at DESC');
            return rows;
        } finally {
            await connection.end();
        }
    }

    static async updateExpense(id, description, amount) {
        const connection = await mysql.createConnection({
            ...dbConfig,
            database: 'expense_report'
        });
        try {
            const [result] = await connection.query(
                'UPDATE expenses SET description = ?, amount = ? WHERE id = ? AND status = "申請済み"',
                [description, amount, id]
            );
            return result.affectedRows > 0;
        } finally {
            await connection.end();
        }
    }

    static async deleteExpense(id) {
        const connection = await mysql.createConnection({
            ...dbConfig,
            database: 'expense_report'
        });
        try {
            const [result] = await connection.query('DELETE FROM expenses WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } finally {
            await connection.end();
        }
    }
}

module.exports = Expense;