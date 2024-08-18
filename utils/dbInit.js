const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

// データベースとテーブルの初期化
async function initializeDatabase() {
    try {
        // データベース接続（DB名指定なし）
        const connection = await mysql.createConnection(dbConfig);

        // データベースの作成（存在しない場合）
        await connection.query('CREATE DATABASE IF NOT EXISTS expense_report');

        // 作成したデータベースを使用
        await connection.query('USE expense_report');

        // テーブルの作成（存在しない場合）
        await connection.query(`
            CREATE TABLE IF NOT EXISTS expenses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                description TEXT NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                status ENUM('申請済み', '承認済み', '却下') DEFAULT '申請済み',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('データベースとテーブルの初期化が完了しました。');
        await connection.end();
    } catch (error) {
        console.error('データベースの初期化中にエラーが発生しました:', error);
        process.exit(1);
    }
}

module.exports = initializeDatabase;