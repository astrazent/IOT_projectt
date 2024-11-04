require('dotenv').config(); // config biến môi trường
const express = require('express');
const path = require('path'); // để sử dụng đường dẫn tương đối
const configviewengine = require('./config/viewengine'); // nơi cấu hình file giao diện và file tĩnh
const webRoutes = require('./routes/web'); // nơi chứa toàn bộ route của chương trình
const connection = require("./config/database");

const app = express(); // app express
const port = process.env.PORT || 8888; //port
const hostname = process.env.HOST_NAME; //localhost


//config req.body
app.use(express.json()); //for json()
app.use(express.urlencoded({extended: true})); //for form data


//config template engine
configviewengine(app);


// khai báo route
app.use('/', webRoutes);

// chạy app
app.listen(port, hostname, () => {
  console.log(`${hostname} app listening on port ${port}`);
})