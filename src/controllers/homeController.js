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

// mock api
function delayedFunction() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Hàm đã trả về sau 3 giây");
        }, 3000);
    });
}
function getRandomInt0to9() {
    return Math.floor(Math.random() * 10);
}
const unlockByFinger = async (req, res) => {
    console.log("delay respone 3 second...");
    const result = await delayedFunction();
    if(getRandomInt0to9() % 2 === 0){
        return res.json({ "status": "success", "message": "Door unlocked!" })
    }
    else{
        return res.json({ "status": "error", "message": "Unlock Failed!" })
    }
}
const unlockByPassword = async (req, res) => {
    console.log("delay respone 3 second...");
    const result = await delayedFunction();
    return res.json({"status": "success", "message": "Door unlocked!" })
}
const getListFinger = async (req, res) => {
    console.log("get list finger --> check");
    return res.json({
        "status": "success",
        "message": "Get list fingerprint success!",
        "data": [
            {"ID": 1, "Tên ngón": "Ngón cái", "Chủ sở hữu": "Nguyễn Văn A"},
            {"ID": 2, "Tên ngón": "Ngón trỏ", "Chủ sở hữu": "Trần Thị B"},
            {"ID": 3, "Tên ngón": "Ngón giữa", "Chủ sở hữu": "Lê Văn C"},
            {"ID": 4, "Tên ngón": "Ngón áp út", "Chủ sở hữu": "Phạm Văn D"},
            {"ID": 5, "Tên ngón": "Ngón út", "Chủ sở hữu": "Nguyễn Thị E"}
        ]
    });
}
const addNewFinger = async (req, res) => {
    setTimeout(() => {
        console.log("delay respone 3 second...");
    }, 3000);
    return res.json({"status": "success", "message": "Add fingerprint success!" })
}
const deleteFinger = async (req, res) => {
    setTimeout(() => {
        console.log("delay respone 3 second...");
    }, 3000);
    return res.json({"status": "success", "message": "Delete fingerprint success!" })
}
const updatePassword = async (req, res) => {
    setTimeout(() => {
        console.log("delay respone 3 second...");
    }, 3000);
    return res.json({"status": "success", "message": "Update password success!" })
}

module.exports = {
    getHomepage, getABC, getInfo, getCreateUser, getUpdatePage, getIotHomePage, unlockByFinger, unlockByPassword, getListFinger, addNewFinger, deleteFinger, updatePassword
}