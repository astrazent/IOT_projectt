const connection = require("../config/database");
const bcrypt = require("bcryptjs");
const fs = require("fs");

//Homepage
const getIotHomePage = async (req, res) => {
    return res.render("iot.ejs");
};
const getPersonalPage = async (req, res) => {
    return res.render("personal.ejs");
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
    return res.json({ status: "success", message: "Door unlocked!", data: [{ fingerprintID: 1, dateTime: timeConvert(), systemID: 1 }] });
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
    let maNguoiDung = null, owner = null, email = null, tenHeThong = null, method = null, emailUnlock = null;
    try {
        await nt.beginTransaction(); // Bắt đầu giao dịch
        // Bước 1: Lấy maNguoiDung từ bảng VanTay dựa trên fingerprintID
        if (fingerprintID != null) {
            const [user] = await nt.execute(`SELECT maNguoiDung FROM VanTay WHERE vanTayID = ?;`, [fingerprintID]);
            if (user.length === 0) {
                throw new Error("Người dùng không tồn tại.");
            }
            maNguoiDung = user[0].maNguoiDung;
            
            // Dùng cho sendEmail()
            const [chuSoHuu] = await nt.execute(`SELECT chuSoHuu, email FROM NguoiDung WHERE maNguoiDung = ?`, [maNguoiDung]);
            if (chuSoHuu.length === 0) {
                throw new Error("Chủ sở hữu không tồn tại.");
            }
            owner = chuSoHuu[0].chuSoHuu;
            emailUnlock = chuSoHuu[0].email;
        }
        // Lấy email nhận và tên hệ thống cho gửi email
        const [emailNhan] = await nt.execute(`SELECT emailNhanTB, tenHeThong FROM HeThongKhoa WHERE heThongID = ?`, [systemID]);
        if (emailNhan.length === 0) {
            throw new Error("Email nhận không tồn tại.");
        }
        email = emailNhan[0].emailNhanTB;
        tenHeThong = emailNhan[0].tenHeThong;

        // Lấy mã hệ thống
        const [system] = await nt.execute(
            `SELECT maHeThong
            FROM HeThongKhoa
            WHERE heThongID = ?;`,
            [systemID]
        );
        const maHeThong = system[0].maHeThong;
        // Bước 3: Chèn thông tin truy cập mới vào LichSuMoCua
        const [kq] = await nt.execute(
            `INSERT INTO LichSuMoCua (thoiGian, loaiTruyCap, thanhCong, maHeThong, maNguoiDung)
            VALUES (?, ?, ?, ?, ?)`,
            [timestamp, unlockType, unlockStatus, maHeThong, maNguoiDung]
        );

        // Dùng cho sendEmail()
        const [phuongThuc] = await nt.execute(`SELECT loaiTruyCap FROM LichSuMoCua WHERE maNhatKy = ?`, [kq.insertId]);
        if (phuongThuc.length === 0) {
            throw new Error("Phương thức không tồn tại.");
        }
        method = phuongThuc[0].loaiTruyCap;
        await nt.commit(); // Commit giao dịch nếu mọi thứ thành công
        console.log("Ghi nhật ký truy cập thành công.");
    } catch (error) {
        await nt.rollback(); // Rollback nếu có lỗi
        console.error("Lỗi:", error.message);
    } finally {
        nt.release(); // Chỉ gọi release() nếu nó tồn tại
    }
    return res.json({ status: "success", message: "Save unlockHistory success!", data: [{ owner: owner, emailUnlock: emailUnlock, method: method, email: email, systemName: tenHeThong}] });
};
const getListFinger = async (req, res) => {
    const [results, fields] = await connection.query(`
        SELECT 
            NguoiDung.chuSoHuu, 
            NguoiDung.email, 
            VanTay.tenBanTay, 
            VanTay.vanTay,
            VanTay.vanTayID
        FROM 
            NguoiDung
        JOIN 
            VanTay ON NguoiDung.maNguoiDung = VanTay.maNguoiDung;
        `); // dùng `` được phép xuống dòng
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
let i = 10; // bắt đầu từ 11 vì dữ liệu mẫu kết thúc ở 10 (test)
const addNewFinger = async (req, res) => {
    console.log("delay respone 3 second...");
    const result = await delayedFunction();
    i += 1;
    return res.json({ status: "success", message: "Add fingerprint success!", data: [{ fingerprintID: i }] });
};
const addNewFingerDB = async (req, res) => {
    const { owner, ownerSelect, ownerStatus, gender, age, phone, email, hand, finger, fingerprintID } = req.body.userInfo;
    // Lấy kết nối từ pool
    const nt = await connection.getConnection();
    try {
        await nt.beginTransaction(); // Bắt đầu giao dịch
        let userID;
        if (ownerStatus) {
            //Thêm thông tin người dùng
            const [userInfo] = await nt.execute(`INSERT INTO NguoiDung (chuSoHuu, gioiTinh, tuoi, soDienThoai, email) VALUES (?, ?, ?, ?, ?)`, [owner, gender, age, phone, email]);
            userID = userInfo.insertId;
        } else {
            // Lấy mã người dùng khi biết vanTayID
            userID = ownerSelect;
        }

        //Kiểm tra xem bàn tay, vân tay, người dùng có bị trùng lặp nhau hay không
        const [checkFinger] = await nt.execute(
            `SELECT 
            COUNT(*) AS soLanTrungLap
            FROM 
                VanTay
            WHERE 
                maNguoiDung = ? 
                AND tenBanTay = ? 
                AND vanTay = ?`,
            [userID, hand, finger]
        );
        if (checkFinger[0].soLanTrungLap > 0) {
            return res.json({ status: "error", message: "Vân tay đã tồn tại." });
        }
        await nt.execute(`INSERT INTO VanTay (tenBanTay, ngayDangKy, vanTay, vanTayID, maNguoiDung) VALUES (?, ?, ?, ?, ?)`, [hand, timeConvert(), finger, fingerprintID, userID]);
        //Thêm lịch sử thao tác
        const [history] = await nt.execute(`INSERT INTO LichSuThaoTac (ngayThayDoi, noiDungThayDoi, maNguoiDung, maHeThong) VALUES (?, ?, ?, ?)`, [timeConvert(), "Thêm vân tay mới", null, req.cookies.systemID]);
        if (history.length === 0) {
            throw new Error("Cập nhật lịch sử thao tác thất bại.");
        }
        await nt.commit(); // Commit giao dịch nếu mọi thứ thành công
        console.log("Ghi nhật ký truy cập thành công.");
    } catch (error) {
        await nt.rollback(); // Rollback nếu có lỗi
        console.error("Lỗi:", error.message);
        return res.json({ status: "error", message: error.message });
    } finally {
        nt.release(); // Chỉ gọi release() nếu nó tồn tại
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
    // Lấy kết nối từ pool
    const nt = await connection.getConnection();
    let deleteFingerprint;
    try {
        await nt.beginTransaction(); // Bắt đầu giao dịch
        //Xoá vân tay trong bảng
        deleteFingerprint = await nt.execute(`DELETE FROM VanTay WHERE vanTayID = ?;`, [fingerprintId]);

        //Thêm lịch sử thao tác
        const [history] = await nt.execute(`INSERT INTO LichSuThaoTac (ngayThayDoi, noiDungThayDoi, maNguoiDung, maHeThong) VALUES (?, ?, ?, ?)`, [timeConvert(), "Xoá vân tay trong hệ thống", null, req.cookies.systemID]);
        if (history.length === 0) {
            throw new Error("Cập nhật lịch sử thao tác thất bại.");
        }
        await nt.commit(); // Commit giao dịch nếu mọi thứ thành công
        console.log("Ghi nhật ký truy cập thành công.");
    } catch (error) {
        await nt.rollback(); // Rollback nếu có lỗi
        console.error("Lỗi:", error.message);
        return res.json({ status: "error", message: error.message });
    } finally {
        nt.release(); // Chỉ gọi release() nếu nó tồn tại
    }
    if (deleteFingerprint[0].affectedRows) {
        return res.json({ status: "success", message: "Delete fingerprint on DB success!" });
    } else {
        return res.json({ status: "error", message: "Delete fingerprint on DB fail." });
    }
};
const updatePassword = async (req, res) => {
    console.log("delay respone 3 second...");
    const result = await delayedFunction();
    return res.json({ status: "success", message: "Update password success!", data: [{ maHeThong: 1 }] });
};
const updatePasswordDB = async (req, res) => {
    let { maHeThong, oldPassword, newPassword } = req.body.passwordInfo;
    // Lấy kết nối từ pool
    const nt = await connection.getConnection();
    try {
        await nt.beginTransaction(); // Bắt đầu giao dịch
        //Kiểm tra mật khẩu cũ
        const [reslt] = await nt.execute("SELECT matKhauMaHoa FROM HeThongKhoa WHERE maHeThong = ?", [maHeThong]);
        if (reslt.length == 0) {
            return res.json({ status: "error", message: "Hệ thống không tồn tại." });
        }
        const currentPassword = reslt[0].matKhauMaHoa;
        if (!(await bcrypt.compare(oldPassword, currentPassword))) {
            return res.json({ status: "error", message: "Mật khẩu cũ không đúng." });
        } else if ((await bcrypt.compare(newPassword, currentPassword))) {
            return res.json({ status: "error", message: "Mật khẩu mới bị trùng với các mật khẩu trước đây." });
        }
        // Dữ liệu bạn muốn lưu
        const data = "Mật khẩu hệ thống: " + newPassword;
        newPassword = await bcrypt.hash(newPassword, 8);
        //Cập nhật mật khẩu
        const [result] = await nt.execute("UPDATE HeThongKhoa SET matKhauMaHoa = ?, lanThayDoiMKCuoi = NOW() WHERE maHeThong = ?", [newPassword, maHeThong]);

        // Lưu dữ liệu vào file 'output.txt'
        fs.writeFile("password_IOT.txt", data, (err) => {
            if (err) {
                console.error("Lỗi khi ghi file:", err);
            } else {
                console.log("Mật khẩu đã được lưu vào file password_IOT.txt");
            }
        });

        //Thêm lịch sử thao tác
        const [history] = await nt.execute(`INSERT INTO LichSuThaoTac (ngayThayDoi, noiDungThayDoi, maNguoiDung, maHeThong) VALUES (?, ?, ?, ?)`, [timeConvert(), "Cập nhật mật khẩu mới", null, req.cookies.systemID]);
        if (history.length === 0) {
            throw new Error("Cập nhật lịch sử thao tác thất bại.");
        }
        await nt.commit(); // Commit giao dịch nếu mọi thứ thành công
        console.log("Ghi nhật ký truy cập thành công.");
    } catch (error) {
        await nt.rollback(); // Rollback nếu có lỗi
        console.error("Lỗi:", error.message);
        return res.json({ status: "error", message: error.message });
    } finally {
        nt.release(); // Chỉ gọi release() nếu nó tồn tại
    }
    return res.json({ status: "success", message: "Update password to DB success!" });
};

const getListUser = async (req, res) => {
    const [results, fields] = await connection.query(`
        SELECT maNguoiDung, chuSoHuu, gioiTinh, tuoi, soDienThoai, email
        FROM NguoiDung;
        `); // dùng `` được phép xuống dòng
    return res.json({
        status: "success",
        message: "Get list users success!",
        data: results,
    });
};
const getSystemID = async (req, res) => {
    const systemID = 1;
    const cookiesOptions = {
        expires: new Date(Date.now() + process.env.COOKIES_EXPIRE * 86400 * 1000),
        httpOnly: false //Không dùng httpOnly mới có thể lấy từ phía frotend
    }
    res.cookie("systemID", systemID, cookiesOptions);
    return res.json({ status: "success", message: "Get systemID success!", data: [{ maHeThong: systemID }] });
};
const getToggleStatus = async (req, res) => {
    const { maHeThong } = req.body;
    const [results, fields] = await connection.query(`
        SELECT thongBaoTuXa, emailNhanTB FROM HeThongKhoa WHERE maHeThong = ?`, [maHeThong]); // dùng `` được phép xuống dòng
    return res.json({
        status: "success",
        message: "Get toggle status success!",
        data: results,
    });
};
const updateToggleStatus = async (req, res) => {
    const { status, maHeThong } = req.body.status;
    const [results, fields] = await connection.query(`
        UPDATE HeThongKhoa SET thongBaoTuXa = ? WHERE maHeThong = ?
        `, [status, maHeThong]); // dùng `` được phép xuống dòng
    
    //Thêm lịch sử thao tác
    const [history] = await connection.execute(`INSERT INTO LichSuThaoTac (ngayThayDoi, noiDungThayDoi, maNguoiDung, maHeThong) VALUES (?, ?, ?, ?)`, [timeConvert(), "Bật/tắt chức năng gửi tin nhắn", null, req.cookies.systemID]);
    if (history.length === 0) {
        throw new Error("Cập nhật lịch sử thao tác thất bại.");
    }
    return res.json({
        status: "success",
        message: "Update toggle status on DB success!",
        data: results,
    });
};
const updateEmailReceive = async (req, res) => {
    const { email, maHeThong } = req.body.status;
    const [results, fields] = await connection.query(`
        UPDATE HeThongKhoa SET emailNhanTB = ? WHERE maHeThong = ?
        `, [email, maHeThong]); // dùng `` được phép xuống dòng
    
    const [history] = await connection.execute(`INSERT INTO LichSuThaoTac (ngayThayDoi, noiDungThayDoi, maNguoiDung, maHeThong) VALUES (?, ?, ?, ?)`, [timeConvert(), "Cập nhật email nhận tin nhắn", null, req.cookies.systemID]);
    if (history.length === 0) {
        throw new Error("Cập nhật lịch sử thao tác thất bại.");
    }
    return res.json({
        status: "success",
        message: "Update email receive on DB success!",
        data: results,
    });
};
const getListDiary = async (req, res) => {
    const [results, fields] = await connection.query(`
        SELECT thoiGian, loaiTruyCap, thanhCong
        FROM LichSuMoCua;
        `); // dùng `` được phép xuống dòng
    return res.json({
        status: "success",
        message: "Get list diary success!",
        data: results,
    });
};
const getListAction = async (req, res) => {
    const [results, fields] = await connection.query(`
        SELECT ngayThayDoi, noiDungThayDoi
        FROM LichSuThaoTac;
        `); // dùng `` được phép xuống dòng
    return res.json({
        status: "success",
        message: "Get list action success!",
        data: results,
    });
};

module.exports = {
    getIotHomePage,
    getPersonalPage,
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
    updatePasswordDB,
    getListUser,
    getSystemID,
    getToggleStatus,
    updateToggleStatus,
    updateEmailReceive,
    getListDiary,
    getListAction
};
