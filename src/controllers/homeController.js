const connection = require("../config/database");

const getHomepage = async (req, res) => {
    const [results, fields] = await connection.query(`select * from Users`); // dùng `` được phép xuống dòng
    return res.render("home.ejs", { Users: results }); // có return hay không đều được, tốt nhất nên có
};
const getABC = (req, res) => {
    res.render("sample.ejs");
};
const getInfo = (req, res) => {
    console.log("req.body: ", req.body); //in ra nội dung các trường có thuộc tính name
    res.send("create user");
};
const getCreateUser = async (req, res) => {
    const [results, fields] = await connection.query(`select * from Users`); // dùng `` được phép xuống dòng
    console.log("result: ", results);
    // Nếu không có nội dung render(), trang web sẽ quay 10 vòng trái đất
    return res.send("oce");
};
const getUpdatePage = async (req, res) => {
    console.log("request.param: ", req.params); //in ra tham số trong url
    return res.send("ok");
};
const getIotHomePage = async (req, res) => {
    return res.render("iot.ejs");
};

// mock api
function delayedFunction() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Hàm đã trả về sau 3 giây");
        }, 3000);
    });
}
function getRandomInt0to99() {
    //test thông báo lỗi và thông báo thành công
    return Math.floor(Math.random() * 100);
}
const timeConvert = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
};
const unlockByFinger = async (req, res) => {
    console.log("delay respone 3 second...");
    const result = await delayedFunction();
    return res.json({ status: "success", message: "Door unlocked!", data: [{ fingerprintID: 101, dateTime: timeConvert(), systemID: 1 }] });
};
const unlockByPassword = async (req, res) => {
    console.log("delay respone 3 second...");
    const result = await delayedFunction();
    return res.json({ status: "success", message: "Door unlocked!", data: [{ fingerprintID: null, dateTime: timeConvert(), systemID: 1 }] });
};
const unlockHistory = async (req, res) => {
    const { unlockStatus, unlockType, fingerprintID, timestamp, systemID } = req.body;
    // Lấy kết nối từ pool
    const nt = await connection.getConnection();
    let maNguoiDung;
    try {
        await nt.beginTransaction();  // Bắt đầu giao dịch
        // Bước 1: Lấy maNguoiDung từ bảng VanTay dựa trên fingerprintID
        if(fingerprintID != null){
            const [user] = await nt.execute(
                `SELECT maNguoiDung FROM VanTay WHERE vanTayID = ?;`,
                [fingerprintID]
            );
            if (user.length === 0) {
                throw new Error("Người dùng không tồn tại.");
            }
            maNguoiDung = user[0].maNguoiDung;
        }
        else{
            maNguoiDung = null;
        }
        const [system] = await nt.execute(
            `SELECT maHeThong
            FROM HeThongKhoa
            WHERE heThongID = ?;`,
            [systemID]
        );
        const maHeThong = system[0].maHeThong;
        // Bước 3: Chèn thông tin truy cập mới vào NhatKyTruyCap
        await nt.execute(
            `INSERT INTO NhatKyTruyCap (thoiGian, loaiTruyCap, thanhCong, maHeThong, maNguoiDung)
            VALUES (?, ?, ?, ?, ?)`,
            [timestamp, unlockType, unlockStatus, maHeThong, maNguoiDung]
        );
        await nt.commit();  // Commit giao dịch nếu mọi thứ thành công
        console.log("Ghi nhật ký truy cập thành công.");
    } catch (error) {
        await nt.rollback();  // Rollback nếu có lỗi
        console.error("Lỗi:", error.message);
    } finally {
        nt.release();  // Chỉ gọi release() nếu nó tồn tại
    }
    return res.json({ status: "success", message: "Save unlockHistory success!" });
};
const getListFinger = async (req, res) => {
    const [results, fields] = await connection.query(`SELECT finger, owner, fingerprintID FROM UserInfo;`); // dùng `` được phép xuống dòng
    return res.json({
        status: "success",
        message: "Get list fingerprint success!",
        data: results,
    });
};
const getListOwner = async (req, res) => {
    const [results, fields] = await connection.query(`SELECT maNguoiDung, chuSoHuu FROM NguoiDung`); // dùng `` được phép xuống dòng
    return res.json({
        status: "success",
        message: "Get list owner success!",
        data: results,
    });
};
const addNewFinger = async (req, res) => {
    console.log("delay respone 3 second...");
    const result = await delayedFunction();
    return res.json({ status: "success", message: "Add fingerprint success!", data: [{ fingerprintID: 1 }] });
};
const addNewFingerDB = async (req, res) => {
    const { owner, ownerSelect, ownerStatus, gender, age, phone, email, hand, finger, fingerprintID } = req.body.userInfo;
    // Lấy kết nối từ pool
    const nt = await connection.getConnection();
    try {
        await nt.beginTransaction();  // Bắt đầu giao dịch
        let userID;
        if(ownerStatus){
            //Thêm thông tin người dùng
            const [userInfo] = await nt.execute(
                `INSERT INTO NguoiDung (chuSoHuu, gioiTinh, tuoi, soDienThoai, email) VALUES (?, ?, ?, ?, ?)`,
                [owner, gender, age, phone, email]
            );
            userID = userInfo.insertId;
        }
        else{
            // Lấy mã người dùng khi biết vanTayID
            userID = ownerSelect;
        }
        //Thêm thông tin vân tay
        await nt.execute(
            `INSERT INTO VanTay (tenBanTay, ngayDangKy, vanTay, vanTayID, maNguoiDung) VALUES (?, ?, ?, ?, ?)`,
            [hand, timeConvert(), finger, fingerprintID, userID]
        );
        await nt.commit();  // Commit giao dịch nếu mọi thứ thành công
        console.log("Ghi nhật ký truy cập thành công.");
    } catch (error) {
        await nt.rollback();  // Rollback nếu có lỗi
        console.error("Lỗi:", error.message);
        return res.json({ status: "error", message: error.message });
    } finally {
        nt.release();  // Chỉ gọi release() nếu nó tồn tại
    }
    return res.json({ status: "success", message: "Add fingerprint to DB success!" });
};
const deleteFinger = async (req, res) => {
    console.log("delay respone 3 second...");
    const result = await delayedFunction();
    return res.json({ status: "success", message: "Delete fingerprint success!" });
};
const deleteFingerDB = async (req, res) => {
    const { fingerprintId } = req.body;
    const [results, fields] = await connection.query(`DELETE FROM UserInfo WHERE fingerprintID = ?;`, [fingerprintId]); // dùng `` được phép xuống dòng
    if (results.affectedRows) {
        return res.json({ status: "success", message: "Delete fingerprint on DB success!" });
    } else {
        return res.json({ status: "error", message: "Delete fingerprint on DB fail." });
    }
};
const updatePassword = async (req, res) => {
    console.log("delay respone 3 second...");
    const result = await delayedFunction();
    return res.json({ status: "success", message: "Update password success!" });
};
const updatePasswordDB = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const [results, fields] = await connection.query("SELECT * FROM UserInfo WHERE Name = ?", [registerName, registerEmail]);
    await connection.query("INSERT INTO UserInfo (Password) VALUES (?)", [password]);
    return res.json({ status: "success", message: "Update password to DB success!" });
};

module.exports = {
    getHomepage,
    getABC,
    getInfo,
    getCreateUser,
    getUpdatePage,
    getIotHomePage,
    unlockByFinger,
    unlockByPassword,
    unlockHistory,
    getListFinger,
    getListOwner,
    addNewFinger,
    addNewFingerDB,
    deleteFinger,
    deleteFingerDB,
    updatePassword,
    updatePasswordDB
};
