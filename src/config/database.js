require('dotenv').config(); // config biến môi trường
const mysql = require('mysql2/promise'); // truy vấn sql (sử dụng promise)

// mỗi 1 lần gọi connection --> một lần gọi tới db --> tốn tài 
//nguyên --> dùng connection pool thay cho createconnection()

//connection pool: tái sử dụng lại connection trước đó --> giảm thời gian kết nối đến MySQL

//tạo kết nối đến database
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT, //default: 3306
//     user: process.env.DB_USER, //default: empty
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// }) 

// Create the connection pool. The pool-specific settings are the defaults
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, //default: 3306
    user: process.env.DB_USER, //default: empty
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

module.exports = connection;