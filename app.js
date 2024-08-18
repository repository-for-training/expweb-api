const express = require('express');
const initializeDatabase = require('./utils/dbInit');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const port = process.env.PORT || 8080;

// JSONボディパーサーの設定
app.use(express.json());

// データベースの初期化
initializeDatabase();

// ルートの設定
app.use('/api/expense', expenseRoutes);

// サーバーの起動
app.listen(port, () => {
    console.log(`サーバーが起動しました。ポート: ${port}`);
});