-- Chuyển bảng thành dạng utf8mb4 (cấu hình bắt buộc)
-- Chuyển CSDL thành dạng unicode
ALTER DATABASE iot_mo_cua_thong_minh
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Tạo bảng chính thức-----------------------------------------------------------
-- Có một số thay đổi so với CSDL gốc như sau: 
-- Mật khẩu: bỏ quan hệ với user, gộp chung với bảng HeThongKhoa
-- Bảng lanTruyCap --> lichSuCaiDat (quản lý lịch sử cài đặt hệ thống)
-- Thêm, sửa một vài thuộc tính cho bảng: NguoiDung, cua, vanTay, HeThongKhoa

-- Bảng Cửa
CREATE TABLE Cua (
    maCua INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    daKhoa BOOLEAN
);

-- Bảng Người Dùng
CREATE TABLE NguoiDung (
    maNguoiDung INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    chuSoHuu VARCHAR(100) NOT NULL,            -- Tên chủ sở hữu
    gioiTinh ENUM('male', 'female', 'other') NOT NULL,  -- Giới tính
    tuoi INT NOT NULL,                       -- Tuổi
    soDienThoai CHAR(10) NOT NULL UNIQUE,    -- Số điện thoại
    email VARCHAR(255) NOT NULL UNIQUE       -- Email
);

-- Bảng Hệ Thống Khóa (liên kết với bảng Cửa)
CREATE TABLE HeThongKhoa (
    maHeThong INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    tenHeThong VARCHAR(100) NOT NULL,      -- Tên chủ sở hữu
    dangHoatDong BOOLEAN,
    matKhauMaHoa VARCHAR(255),              -- Thêm trường mật khẩu đã mã hóa
    lanThayDoiCuoi DATETIME,                    -- Ngày thay đổi mật khẩu cuối
    thongBaoTuXa BOOLEAN,
    heThongID INT NOT NULL,
    maCua INT,
    FOREIGN KEY (maCua) REFERENCES Cua(maCua)
);

-- Bảng Lịch sử thao tác (liên kết với bảng Hệ Thống Khóa và Người Dùng)
CREATE TABLE LichSuThaoTac (
    maCaiDat INT PRIMARY KEY NOT NULL AUTO_INCREMENT,               -- Mã lịch sử thao tác
    ngayThayDoi DATETIME,                   -- Ngày và giờ thay đổi thao tác
    noiDungThayDoi TEXT,                    -- Nội dung chi tiết của thay đổi thao tác
    maNguoiDung INT,                        -- Mã người dùng thực hiện thay đổi
    maHeThong INT,                          -- Mã hệ thống liên quan đến thay đổi
    FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung),
    FOREIGN KEY (maHeThong) REFERENCES HeThongKhoa(maHeThong)
);

-- Bảng Nhật Ký Truy Cập (liên kết với bảng Hệ Thống Khóa)
CREATE TABLE NhatKyTruyCap (
    maNhatKy INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    thoiGian DATETIME,
    loaiTruyCap VARCHAR(50),
    thanhCong BOOLEAN,
    maHeThong INT,
    maNguoiDung INT,
    FOREIGN KEY (maHeThong) REFERENCES HeThongKhoa(maHeThong),
    FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung)
);

-- Bảng Vân Tay (liên kết với bảng Người Dùng)
CREATE TABLE VanTay (
    maVanTay INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    tenBanTay VARCHAR(255),
    ngayDangKy DATETIME,
    vanTay ENUM('ngón cái', 'ngón trỏ', 'ngón giữa', 'ngón áp út', 'ngón út') NOT NULL, -- Ngón tay
    vanTayID INT NOT NULL UNIQUE,
    maNguoiDung INT,
    FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung)
);

-- Dữ liệu test (Insert đúng thứ tự từ trên xuống dưới)-------------------------------------------------------
-- Bảng người dùng
INSERT INTO NguoiDung (chuSoHuu, gioiTinh, tuoi, soDienThoai, email) VALUES
('Nguyễn Văn A', 'male', 25, '0912345678', 'nguyenvana@gmail.com'),
('Trần Thị B', 'female', 30, '0987654321', 'tranthib@gmail.com'),
('Lê Quang C', 'male', 22, '0901234567', 'lequangc@gmail.com'),
('Phạm Minh D', 'male', 28, '0923456789', 'phamminhd@gmail.com'),
('Huỳnh Thị E', 'female', 27, '0934567890', 'huynhthie@gmail.com'),
('Đỗ Thái F', 'male', 24, '0945678901', 'dothaif@gmail.com'),
('Võ Quế G', 'female', 26, '0956789012', 'voqueg@gmail.com'),
('Ngô Thị H', 'female', 23, '0967890123', 'ngothih@gmail.com'),
('Bùi Thanh I', 'male', 29, '0978901234', 'bui.thanhi@gmail.com'),
('Dương Minh J', 'male', 31, '0989012345', 'duongminhj@gmail.com');

-- Bảng vân tay
INSERT INTO VanTay (tenBanTay, ngayDangKy, vanTay, vanTayID, maNguoiDung) VALUES
('Tay phải', '2024-01-15', 'ngón cái', 1, 1),
('Tay trái', '2024-01-20', 'ngón trỏ', 2, 2),
('Tay phải', '2024-02-10', 'ngón giữa', 3, 3),
('Tay trái', '2024-02-15', 'ngón áp út', 4, 4),
('Tay phải', '2024-03-05', 'ngón út', 5, 5),
('Tay trái', '2024-03-15', 'ngón cái', 6, 6),
('Tay phải', '2024-04-01', 'ngón trỏ', 7, 7),
('Tay trái', '2024-04-10', 'ngón giữa', 8, 8),
('Tay phải', '2024-05-05', 'ngón áp út', 9, 9),
('Tay trái', '2024-05-15', 'ngón út', 10, 10);

-- Bảng cửa
INSERT INTO Cua (daKhoa)
VALUES
    (TRUE),   -- maCua = 1
    (FALSE),  -- maCua = 2
    (TRUE),   -- maCua = 3
    (FALSE),  -- maCua = 4
    (TRUE);   -- maCua = 5

-- Bảng hệ thống khoá
INSERT INTO HeThongKhoa (tenHeThong, dangHoatDong, matKhauMaHoa, lanThayDoiCuoi, thongBaoTuXa, heThongID, maCua)
VALUES
('Hệ Thống Cửa Chính', TRUE, '$2a$08$x6qGhZHC0/KEObtjBka.z.ksaaOHRgsme8wRGcgrkD874ZH.ihZsy', DATE_ADD('2024-01-01 08:00:00', INTERVAL FLOOR(RAND() * 1000) DAY_SECOND), 0, 1, 1), --Mật khẩu mặc định: 5555
('Hệ Thống Cửa Phụ', FALSE, LPAD(FLOOR(RAND() * 10000), 4, '0'), DATE_ADD('2024-01-01 08:00:00', INTERVAL FLOOR(RAND() * 1000) DAY_SECOND), 0, 2, 2),
('Hệ Thống Cửa Văn Phòng', TRUE, LPAD(FLOOR(RAND() * 10000), 4, '0'), DATE_ADD('2024-01-01 08:00:00', INTERVAL FLOOR(RAND() * 1000) DAY_SECOND), 0, 3, 3),
('Hệ Thống Cửa Kho', FALSE, LPAD(FLOOR(RAND() * 10000), 4, '0'), DATE_ADD('2024-01-01 08:00:00', INTERVAL FLOOR(RAND() * 1000) DAY_SECOND), 0, 4, 4),
('Hệ Thống Cửa Gara', TRUE, LPAD(FLOOR(RAND() * 10000), 4, '0'), DATE_ADD('2024-01-01 08:00:00', INTERVAL FLOOR(RAND() * 1000) DAY_SECOND), 0, 5, 5);

--Bảng nhật ký truy cập
INSERT INTO NhatKyTruyCap (thoiGian, loaiTruyCap, thanhCong, maHeThong, maNguoiDung) VALUES
('2024-11-10 08:30:00', 'mật khẩu', TRUE, 1, 1),
('2024-11-10 09:00:15', 'vân tay', TRUE, 1, 2),
('2024-11-11 10:15:00', 'mật khẩu', FALSE, 1, 3),
('2024-11-11 11:00:45', 'vân tay', TRUE, 1, 4),
('2024-11-12 14:30:30', 'mật khẩu', TRUE, 1, 5),
('2024-11-12 15:00:00', 'vân tay', FALSE, 1, 6),
('2024-11-13 09:45:20', 'mật khẩu', TRUE, 1, 7),
('2024-11-13 10:30:10', 'vân tay', TRUE, 1, 8);

-- Bảng lịch sử thao tác
INSERT INTO LichSuThaoTac (ngayThayDoi, noiDungThayDoi, maNguoiDung, maHeThong)
VALUES
('2024-11-10 08:30:00', 'Cập nhật thông tin người dùng', 1, 1),
('2024-11-10 09:00:00', 'Thay đổi mật khẩu người dùng', 2, 1),
('2024-11-11 10:15:00', 'Cài đặt hệ thống thành công', 3, 1),
('2024-11-11 11:00:00', 'Khôi phục mật khẩu cho người dùng', 4, 1),
('2024-11-12 14:45:00', 'Cập nhật thông báo hệ thống', 5, 1),
('2024-11-12 16:00:00', 'Thay đổi quyền truy cập người dùng', 6, 1);

-- Xoá tất cả các bảng vừa tạo (Drop đúng thứ tự từ trên xuống dưới)-------------------------------------------------------------
DROP TABLE IF EXISTS LanTruyCap;
DROP TABLE IF EXISTS NhatKyTruyCap;
DROP TABLE IF EXISTS VanTay;
DROP TABLE IF EXISTS LichSuThaoTac;
DROP TABLE IF EXISTS HeThongKhoa;
DROP TABLE IF EXISTS NguoiDung;
DROP TABLE IF EXISTS Cua;

-- Xoá toàn bộ dữ liệu trong bảng (bảng chứa khoá chính không thể xoá bằng cách này)---------------------------------
TRUNCATE TABLE NguoiDung;

-- Chuyển bảng cụ thể thành dạng utf8mb4-------------------------------------------------------------------------
ALTER TABLE UserInfo CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

--Thao tác với từng trường dữ liệu-------------------------------------------------------
-- Thêm cột cho bảng
ALTER TABLE UserInfo
ADD password VARCHAR(255) NOT NULL;

-- Xoá cột cho bảng
ALTER TABLE UserInfo
DROP COLUMN password;

-- sửa tên cột
ALTER TABLE VanTay CHANGE tenVanTay tenBanTay VARCHAR(50);

-- đổi vị trí cột
ALTER TABLE HeThongKhoa  
MODIFY COLUMN heThongID INT AFTER dangHoatDong;