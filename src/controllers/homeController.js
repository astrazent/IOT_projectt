const connection = require("../config/database");

const getHomepage = async (req, res) => {
    const [results, fields] = await connection.query(`select * from Users`); // dùng `` được phép xuống dòng
    return res.render('home.ejs', {Users: results}); // có return hay không đều được, tốt nhất nên có
}
const getABC = (req, res) => {
    res.render('sample.ejs');
}
const getInfo = (req, res) => {
    console.log("req.body: ", req.body); //in ra nội dung các trường có thuộc tính name
    res.send('create user');
}
const getCreateUser = async (req, res) => {
    const [results, fields] = await connection.query(`select * from Users`); // dùng `` được phép xuống dòng
    console.log("result: ", results);
    // Nếu không có nội dung render(), trang web sẽ quay 10 vòng trái đất
    return res.send('oce')
}
const getUpdatePage = async (req, res) => {
    console.log("request.param: ", req.params); //in ra tham số trong url
    return res.send('ok');
}
const getIotHomePage = async (req, res) => {
    return res.render('iot.ejs');
}

module.exports = {
    getHomepage, getABC, getInfo, getCreateUser, getUpdatePage, getIotHomePage
}