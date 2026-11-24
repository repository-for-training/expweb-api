const express = require('express');
const mysql = require('mysql2/promise');
const dbConfig = require('./config/database');
const initializeDatabase = require('./utils/dbInit');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const port = process.env.PORT || 8080;
const readinessPool = mysql.createPool({
    ...dbConfig,
    database: 'expense_report',
    connectTimeout: 2000,
    connectionLimit: 2,
    waitForConnections: false,
});

app.get('/readyz', async (_req, res) => {
    res.set('Cache-Control', 'no-store');
    try {
        await readinessPool.query({ sql: 'SELECT 1 FROM expenses LIMIT 0', timeout: 1000 });
        res.status(200).json({ status: 'ready' });
    } catch {
        res.status(503).json({ status: 'unavailable' });
    }
});

app.use(express.json({ limit: '16kb' }));
app.use('/api/expense', expenseRoutes);

app.use((error, _req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'JSONの形式が正しくありません。' });
    }
    if (error.type === 'entity.too.large') {
        return res.status(413).json({ message: 'リクエストが大きすぎます。' });
    }
    console.error('経費APIでエラーが発生しました。', { code: error.code ?? 'UNKNOWN' });
    res.status(500).json({ message: '処理できませんでした。' });
});

initializeDatabase().then(() => {
    app.listen(port, () => {
        console.log(`サーバーが起動しました。ポート: ${port}`);
    });
});
