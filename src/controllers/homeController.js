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
    const [results, fields] = await connection.query(`SELECT finger, owner, fingerprintID FROM UserInfo;`); // dùng `` được phép xuống dòng
    return res.json({
        "status": "success",
        "message": "Get list fingerprint success!",
        "data": results
    });
}
const addNewFinger = async (req, res) => {
    console.log("delay respone 3 second...");
    const result = await delayedFunction();
    return res.json({"status": "success", "message": "Add fingerprint success!", "data": [{"fingerprintID": 1}] })
}
const addNewFingerDB = async (req, res) => {
    const { owner, gender, age, phone, email, finger, fingerprintID } = req.body.userInfo;
    const [results, fields] = await connection.query(
        `INSERT INTO UserInfo (owner, gender, age, phone, email, finger, fingerprintID)
        VALUES (?, ?, ?, ?, ?, ?, ?);`, [owner, gender, age, phone, email, finger, fingerprintID]
    ); // dùng `` được phép xuống dòng
    return res.json({"status": "success", "message": "Add fingerprint to DB success!" })
}
const deleteFinger = async (req, res) => {
    return res.json({"status": "success", "message": "Delete fingerprint success!" })
}
const deleteFingerDB = async (req, res) => {
    setTimeout(() => {
        console.log("delay respone 3 second...");
    }, 3000);
    return res.json({"status": "success", "message": "Delete fingerprint on success!" })
}
const updatePassword = async (req, res) => {
    setTimeout(() => {
        console.log("delay respone 3 second...");
    }, 3000);
    return res.json({"status": "success", "message": "Update password success!" })
}
const updatePasswordDB = async (req, res) => {
    setTimeout(() => {
        console.log("delay respone 3 second...");
    }, 3000);
    return res.json({"status": "success", "message": "Update password to DB success!" })
}

module.exports = {
    getHomepage, getABC, getInfo, getCreateUser, getUpdatePage, getIotHomePage, unlockByFinger, unlockByPassword, getListFinger, addNewFinger, addNewFingerDB, deleteFinger, deleteFingerDB, updatePassword, updatePasswordDB
}