const nodemailer = require("nodemailer");
// Cấu hình SMTP
const transporter = nodemailer.createTransport({
    service: "gmail", // Bạn cũng có thể sử dụng "yahoo", "outlook", v.v.
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "phannguyen2300@gmail.com", // Email của bạn
        pass: "hwpd ivlr vzie rgse", // Mật khẩu ứng dụng (App Password)  https://security.google.com/settings/security/apppasswords
    }
});

module.exports = transporter;
