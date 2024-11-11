const overlay = document.getElementById("overlay");

//Gửi tin nhắn mỗi khi mở cửa
document.getElementById("buttonA").addEventListener("click", function () {
    document.querySelector(".notification-container").style.display = "block";
    overlay.style.display = "block";
});
document.querySelector(".close-button").addEventListener("click", function () {
    document.querySelector(".notification-container").style.display = "none";
    overlay.style.display = "none";
});

// Lấy phần tử checkbox
const toggleSwitch = document.getElementById('notificationToggle');


//Lấy trạng thái của toggle
async function getToggleStatus(id) {
    const apiUrl = "http://localhost:8080/api/getToggleStatus"; // Thay URL này bằng URL của API thực tế
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ maHeThong: id })
        });
        if (response.ok) {
            const data = await response.json();
            if (data.status == "success") {
                //Lấy danh sách về thành công (test)
                console.log("lấy trạng thái tin nhắn thành công!");
                const status = data.data[0].thongBaoTuXa;
                if(status){
                    toggleSwitch.checked = true;
                }
                else{
                    toggleSwitch.checked = false;
                }
            } else {
                // Lấy danh sách thát bại (test)
                console.log("lấy trạng thái tin nhắn thất bại.");
            }
        } else {
            console.error("Request failed:", response.status);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

//Lấy trạng thái của toggle
async function getSystemID() {
    const apiUrl = "http://localhost:8080/api/arduino/getSystemID"; // Thay URL này bằng URL của API thực tế
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const data = await response.json();
            if (data.status == "success") {
                //Lấy mã hệ thống về thành công (test)
                console.log("lấy mã hệ thống thành công!");
                getToggleStatus(data.data[0].maHeThong);
            } else {
                // Lấy mã hệ thống thát bại (test)
                console.log("lấy mã hệ thống thất bại.");
            }
        } else {
            console.error("Request failed:", response.status);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
getSystemID();

// Bắt sự kiện thay đổi trạng thái checkbox
toggleSwitch.addEventListener('change', function () {
    if (this.checked) {
        // Nếu checkbox được tích (bật)
        console.log("Thông báo đã được bật");
        // Thực hiện hành động khi bật (ví dụ: gửi thông báo)
    } else {
        // Nếu checkbox không được tích (tắt)
        console.log("Thông báo đã được tắt");
        // Thực hiện hành động khi tắt (ví dụ: ngừng gửi thông báo)
    }
});


// Đóng thông báo khi bấm ra ngoài modal
window.addEventListener("click", function (event) {
    if (event.target === overlay) {
        document.querySelector(".notification-container").style.display = "none";
        overlay.style.display = "none";
    }
});

function populateTable(data) {
    const tableBody = document.getElementById("userTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Xóa nội dung cũ (nếu có)

    // Sắp xếp data theo thứ tự tên chuSoHuu
    data.sort((a, b) => a.chuSoHuu.localeCompare(b.chuSoHuu));

    data.forEach((item, index) => {
        const row = document.createElement("tr");

        // Thêm maNguoiDung vào thuộc tính data-maNguoiDung của thẻ tr
        row.setAttribute("data-maNguoiDung", item.maNguoiDung);

        // Tạo ô cho số thứ tự
        const serialCell = document.createElement("td");
        serialCell.textContent = index + 1; // Số thứ tự bắt đầu từ 1
        row.appendChild(serialCell);

        // Tạo ô cho chuSoHuu
        const ownerCell = document.createElement("td");
        ownerCell.textContent = item.chuSoHuu;
        row.appendChild(ownerCell);

        // Tạo ô cho gioiTinh và chuyển đổi sang tiếng Việt
        const genderCell = document.createElement("td");
        genderCell.textContent = item.gioiTinh === 'male' ? 'Nam' 
                                : item.gioiTinh === 'female' ? 'Nữ' 
                                : 'Khác';
        row.appendChild(genderCell);

        // Tạo ô cho tuoi
        const ageCell = document.createElement("td");
        ageCell.textContent = item.tuoi;
        row.appendChild(ageCell);

        // Tạo ô cho soDienThoai
        const phoneCell = document.createElement("td");
        phoneCell.textContent = item.soDienThoai;
        row.appendChild(phoneCell);

        // Tạo ô cho email
        const emailCell = document.createElement("td");
        emailCell.textContent = item.email;
        row.appendChild(emailCell);

        tableBody.appendChild(row);
    });
}

// Quản lý danh sách người dùng
const modal2 = document.querySelector(".modal3");
const closeButton2 = document.querySelector(".close3");
// Hiện thông báo khi bấm nút
document.getElementById("buttonB").addEventListener("click", function () {
    // Đoạn mã JavaScript dùng fetch để gửi yêu cầu POST
    const apiUrl = "http://localhost:8080/api/getListUser"; // Thay URL này bằng URL của API thực tế
    async function getListUser() {
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                if (data.status == "success") {
                    //Lấy danh sách về thành công (test)
                    console.log("lấy danh sách người dùng thành công!");
                    // Gọi hàm để hiển thị dữ liệu
                    populateTable(data.data);
                } else {
                    // Lấy danh sách thát bại (test)
                    console.log("lấy danh sách người dùng thất bại.");
                }
            } else {
                console.error("Request failed:", response.status);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    getListUser();
    modal2.style.display = "flex"; // Hiện modal với display flex để căn giữa
});

// Xử lý lọc tìm kiếm
document.getElementById("searchInput").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#userTable tbody tr");

    rows.forEach((row) => {
        // Kiểm tra tất cả các ô trong hàng
        const cells = Array.from(row.cells);
        const rowMatches = cells.some((cell) => cell.textContent.toLowerCase().includes(filter));

        if (rowMatches) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});


// Đóng thông báo khi bấm nút đóng
closeButton2.addEventListener("click", function () {
    modal2.style.display = "none"; // Ẩn modal
});

// Đóng thông báo khi bấm ra ngoài modal
window.addEventListener("click", function (event) {
    if (event.target === modal2) {
        modal2.style.display = "none"; // Ẩn modal nếu click ra ngoài
        document.querySelector(".modal-content3").style.display = "block";
    }
});

//Lịch sử mở cửa
function populateTable2(data) {
    const tableBody = document.getElementById("diaryTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Xóa nội dung cũ (nếu có)
    data.forEach((item, index) => {
        const row = document.createElement("tr");

        // Tạo ô cho số thứ tự
        const serialCell = document.createElement("td");
        serialCell.textContent = index + 1; // Số thứ tự bắt đầu từ 1
        row.appendChild(serialCell);

        // Tạo ô cho ngày (tách từ thoiGian)
        const dateCell = document.createElement("td");
        const date = new Date(item.thoiGian);
        dateCell.textContent = date.toLocaleDateString("vi-VN"); // Hiển thị ngày theo định dạng Việt Nam
        row.appendChild(dateCell);

        // Tạo ô cho giờ (tách từ thoiGian)
        const timeCell = document.createElement("td");
        timeCell.textContent = date.toLocaleTimeString("vi-VN"); // Hiển thị giờ theo định dạng Việt Nam
        row.appendChild(timeCell);

        // Tạo ô cho loaiTruyCap
        const accessTypeCell = document.createElement("td");
        accessTypeCell.textContent = item.loaiTruyCap;
        row.appendChild(accessTypeCell);

        // Tạo ô cho thanhCong, chuyển đổi giá trị true/false thành "Thành công" hoặc "Thất bại"
        const successCell = document.createElement("td");
        successCell.textContent = item.thanhCong ? "Thành công" : "Thất bại";
        row.appendChild(successCell);

        tableBody.appendChild(row);
    });
}


// Lịch sử mở cửa
const modal3 = document.querySelector(".modal4");
const closeButton3 = document.querySelector(".close4");
// Hiện thông báo khi bấm nút
document.getElementById("buttonC").addEventListener("click", function () {
    // Đoạn mã JavaScript dùng fetch để gửi yêu cầu POST
    const apiUrl = "http://localhost:8080/api/getListDiary"; // Thay URL này bằng URL của API thực tế
    async function getListDiary() {
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                if (data.status == "success") {
                    //Lấy danh sách về thành công (test)
                    console.log("lấy danh sách lịch sử mở cửa thành công!");
                    // Gọi hàm để hiển thị dữ liệu
                    populateTable2(data.data);
                } else {
                    // Lấy danh sách thát bại (test)
                    console.log("lấy danh sách lịch sử mở cửa thất bại.");
                }
            } else {
                console.error("Request failed:", response.status);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    getListDiary();
    modal3.style.display = "flex"; // Hiện modal với display flex để căn giữa
});

// Xử lý lọc tìm kiếm
document.getElementById("searchInput2").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#diaryTable tbody tr");

    rows.forEach((row) => {
        // Kiểm tra tất cả các ô trong hàng
        const cells = Array.from(row.cells);
        const rowMatches = cells.some((cell) => cell.textContent.toLowerCase().includes(filter));

        if (rowMatches) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});


// Đóng thông báo khi bấm nút đóng
closeButton3.addEventListener("click", function () {
    modal3.style.display = "none"; // Ẩn modal
});

// Đóng thông báo khi bấm ra ngoài modal
window.addEventListener("click", function (event) {
    if (event.target === modal3) {
        modal3.style.display = "none"; // Ẩn modal nếu click ra ngoài
        document.querySelector(".modal-content4").style.display = "block";
    }
});

//Lịch sử thao tác
function populateTable3(data) {
    const tableBody = document.getElementById("actionTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Xóa nội dung cũ (nếu có)

    data.forEach((item, index) => {
        const row = document.createElement("tr");

        // Tạo ô cho số thứ tự
        const serialCell = document.createElement("td");
        serialCell.textContent = index + 1; // Số thứ tự bắt đầu từ 1
        row.appendChild(serialCell);

        // Tạo ô cho ngày (tách từ ngayThayDoi)
        const dateCell = document.createElement("td");
        const date = new Date(item.ngayThayDoi);
        dateCell.textContent = date.toLocaleDateString("vi-VN"); // Hiển thị ngày theo định dạng Việt Nam
        row.appendChild(dateCell);

        // Tạo ô cho giờ (tách từ ngayThayDoi)
        const timeCell = document.createElement("td");
        timeCell.textContent = date.toLocaleTimeString("vi-VN"); // Hiển thị giờ theo định dạng Việt Nam
        row.appendChild(timeCell);

        // Tạo ô cho noiDungThayDoi
        const changeContentCell = document.createElement("td");
        changeContentCell.textContent = item.noiDungThayDoi;
        row.appendChild(changeContentCell);

        tableBody.appendChild(row);
    });
}

// Lịch sử mở cửa
const modal4 = document.querySelector(".modal5");
const closeButton4 = document.querySelector(".close5");
// Hiện thông báo khi bấm nút
document.getElementById("buttonD").addEventListener("click", function () {
    // Đoạn mã JavaScript dùng fetch để gửi yêu cầu POST
    const apiUrl = "http://localhost:8080/api/getListAction"; // Thay URL này bằng URL của API thực tế
    async function getListAction() {
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                if (data.status == "success") {
                    //Lấy danh sách về thành công (test)
                    console.log("lấy danh sách lịch sử thao tác thành công!");
                    // Gọi hàm để hiển thị dữ liệu
                    populateTable3(data.data);
                } else {
                    // Lấy danh sách thát bại (test)
                    console.log("lấy danh sách lịch sử thao tác thất bại.");
                }
            } else {
                console.error("Request failed:", response.status);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    getListAction();
    modal4.style.display = "flex"; // Hiện modal với display flex để căn giữa
});

// Xử lý lọc tìm kiếm
document.getElementById("searchInput3").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#actionTable tbody tr");

    rows.forEach((row) => {
        const cells = Array.from(row.cells);

        // Kiểm tra nếu ô trong hàng chứa nội dung tìm kiếm
        const rowMatches = cells.some((cell, index) => {
            // Chỉ tìm kiếm trong các cột cụ thể
            if (index === 1 || index === 2 || index === 3) {  // Giả sử bạn tìm kiếm trong cột số thứ tự, ngày và nội dung thay đổi
                return cell.textContent.toLowerCase().includes(filter);
            }
            return false;  // Bỏ qua các cột khác
        });

        if (rowMatches) {
            row.style.display = "";  // Hiển thị nếu có kết quả
        } else {
            row.style.display = "none";  // Ẩn nếu không khớp
        }
    });
});

// Đóng thông báo khi bấm nút đóng
closeButton4.addEventListener("click", function () {
    modal4.style.display = "none"; // Ẩn modal
});

// Đóng thông báo khi bấm ra ngoài modal
window.addEventListener("click", function (event) {
    if (event.target === modal4) {
        modal4.style.display = "none"; // Ẩn modal nếu click ra ngoài
        document.querySelector(".modal-content4").style.display = "block";
    }
});
