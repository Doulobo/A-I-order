var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'restaurant';  // 确保数据库名称正确

let db;

// 连接到 MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log('Connected successfully to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

connectToMongoDB();

// 设置视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 中间件设置
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 路由设置
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 定义 /data 路由，返回 MongoDB 中的所有文档
app.get('/data', async (req, res) => {
  try {
    const collection = db.collection('documents');
    const data = await collection.find({}).toArray();
    res.json(data);  // 返回 JSON 格式的数据
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).json({ error: 'Error fetching data from MongoDB' });
  }
});

// 定义 /menu 路由，返回 _id 为 "富順樓" 的文档
app.get('/menu', async (req, res) => {
  try {
    const collection = db.collection('restaurant'); // 确保集合名称正确
    const menuData = await collection.findOne({ _id: "富順樓" });
    if (menuData) {
      res.json(menuData);  // 返回菜单数据
    } else {
      res.status(404).json({ error: 'Restaurant not found' });
    }
  } catch (err) {
    console.error('Error fetching menu from MongoDB:', err);
    res.status(500).json({ error: 'Error fetching menu from MongoDB' });
  }
});

// 404 错误处理
app.use(function(req, res, next) {
  next(createError(404));
});

// 其他错误处理
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// 设置服务器监听的端口号
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
