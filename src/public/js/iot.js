//Thông báo lunadev
let notifications = document.querySelector(".notifications");
function createToast(type, icon, title, text) {
    let newToast = document.createElement("div");
    newToast.innerHTML = `
            <div class="toast ${type}">
                <i class="${icon}"></i>
                <div class="content">
                    <div class="title">${title}</div>
                    <span>${text}</span>
                </div>
                <i class="fa-solid fa-xmark" onclick="(this.parentElement).remove()"></i>
            </div>`;
    notifications.appendChild(newToast);
    newToast.timeOut = setTimeout(() => newToast.remove(), 5000);
}
const success = (text) => {
    let type = "success";
    let icon = "fa-solid fa-circle-check";
    let title = "Thành công";
    createToast(type, icon, title, text);
};
const error_nofi = (text) => {
    let type = "error";
    let icon = "fa-solid fa-circle-exclamation";
    let title = "Lỗi";
    createToast(type, icon, title, text);
};
const warning = (text) => {
    let type = "warning";
    let icon = "fa-solid fa-triangle-exclamation";
    let title = "Warning";
    createToast(type, icon, title, text);
};
const info = (text) => {
    let type = "info";
    let icon = "fa-solid fa-circle-info";
    let title = "Info";
    createToast(type, icon, title, text);
};

//----------------------------------------------------------------------------------------------
// Thông báo của nút mở cửa
const showMessageButtons = document.querySelectorAll(".show-message-button");
const modal = document.querySelector(".modal2");
const modalFinger = document.querySelector(".modal2-btn-finger");
const modalPass = document.querySelector(".modal2-btn-pass");
const openNoti = document.getElementById("modal2-confirmationContainer");
const overlay = document.getElementById("overlay");
const closeButton = document.querySelector(".close2");

// Hiện thông báo khi bấm nút
showMessageButtons.forEach((button) => {
    button.addEventListener("click", function () {
        modal.style.display = "flex"; // Hiện modal với display flex để căn giữa
    });
});

const deleteElement = (id) => {
    let container = document.getElementById(id);
    // Kiểm tra nếu container có phần tử con, sau đó xóa phần tử cuối cùng
    if (container.lastElementChild) {
        container.lastElementChild.remove();
    }
};
//hiển thị thông báo vui lòng nhập
modalFinger.addEventListener("click", function () {
    document.querySelector(".modal-content2").style.display = "none"; // Ẩn modal
    document.querySelector(".modal2-confirm-title").innerHTML = "Vui lòng đặt vân tay vào máy quét";
    document.getElementById("modal2-confirmationContainer").insertAdjacentHTML("beforeend", '<i class="bi bi-fingerprint"></i>');
    overlay.style.display = "block";
    openNoti.style.display = "block";

    // Đoạn mã JavaScript dùng fetch để gửi yêu cầu POST
    const apiUrl = "http://localhost:8080/api/unlockByFinger"; // Thay URL này bằng URL của API thực tế
    const fingerprintId = "valid_id"; // ID vân tay cần gửi

    async function unlockDoorByFinger() {
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fingerprintId: fingerprintId }),
            });
            if (response.ok) {
                const data = await response.json();
                document.querySelector(".modal2").style.display = "none"; // Ẩn modal
                document.querySelector(".modal-content2").style.display = "block"; // Ẩn modal
                deleteElement("modal2-confirmationContainer");
                openNoti.style.display = "none";
                overlay.style.display = "none";
                if (data.status == "success") {
                    //Khi mở cửa thành công
                    success("Đã mở cửa");
                } else {
                    error_nofi("Mở cửa thất bại");
                }
            } else {
                console.error("Request failed:", response.status);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    unlockDoorByFinger();
});
modalPass.addEventListener("click", function () {
    document.querySelector(".modal-content2").style.display = "none"; // Ẩn modal
    document.querySelector(".modal2-confirm-title").innerHTML = "Vui lòng nhập mật khẩu vào bàn phím";
    document.getElementById("modal2-confirmationContainer").insertAdjacentHTML("beforeend", '<i class="fa-solid fa-keyboard"></i>');
    overlay.style.display = "block";
    openNoti.style.display = "block";

    // Đoạn mã JavaScript dùng fetch để gửi yêu cầu POST
    const apiUrl = "http://localhost:8080/api/unlockByPassword"; // Thay URL này bằng URL của API thực tế
    const fingerprintId = "valid_id"; // ID vân tay cần gửi
    async function unlockDoorByPass() {
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fingerprintId: fingerprintId }),
            });
            if (response.ok) {
                const data = await response.json();
                //khi request thành công
                document.querySelector(".modal2").style.display = "none"; // Ẩn modal
                document.querySelector(".modal-content2").style.display = "block"; 
                deleteElement("modal2-confirmationContainer");
                openNoti.style.display = "none";
                overlay.style.display = "none";
                if (data.status == "success") {
                    //Khi mở cửa thành công (test)
                    success("Đã mở cửa");
                } else {
                    error_nofi("Mở cửa thất bại");
                }
            } else {
                console.error("Request failed:", response.status);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    unlockDoorByPass();
});

// Đóng thông báo khi bấm nút đóng
closeButton.addEventListener("click", function () {
    modal.style.display = "none"; // Ẩn modal
});

// Đóng thông báo khi bấm ra ngoài modal
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none"; // Ẩn modal nếu click ra ngoài
    }
});

// Thông báo của nút xoá vân tay
const showMessageButtons2 = document.querySelectorAll(".show-message-button2");
const modal2 = document.querySelector(".modal3");
const closeButton2 = document.querySelector(".close3");

function populateTable(data) {
    const tableBody = document.getElementById("fingerprintTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Xóa nội dung cũ (nếu có)

    // Sắp xếp data theo thứ tự tên owner
    data.sort((a, b) => a.owner.localeCompare(b.owner));

    data.forEach((item, index) => {
        const row = document.createElement("tr");

        // Lưu fingerprintID vào thuộc tính của hàng
        row.setAttribute("data-fingerprint-id", item.fingerprintID);

        // Tạo ô cho số thứ tự
        const serialCell = document.createElement("td");
        serialCell.textContent = index + 1; // Số thứ tự bắt đầu từ 1
        row.appendChild(serialCell);

        // Tạo ô cho owner (đặt trước) và finger
        const ownerCell = document.createElement("td");
        ownerCell.textContent = item.owner;
        row.appendChild(ownerCell);

        const fingerCell = document.createElement("td");
        fingerCell.textContent = item.finger;
        row.appendChild(fingerCell);

        tableBody.appendChild(row);
    });
}


// Hiện thông báo khi bấm nút
showMessageButtons2.forEach((button) => {
    button.addEventListener("click", function () {
        // Đoạn mã JavaScript dùng fetch để gửi yêu cầu POST
        const apiUrl = "http://localhost:8080/api/getListFinger"; // Thay URL này bằng URL của API thực tế
        async function getListFinger() {
            try {
                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.status == "success") {
                        //Lấy danh sách về thành công (test)
                        console.log("lấy danh sách vân tay thành công!");
                        // Gọi hàm để hiển thị dữ liệu
                        populateTable(data.data);

                        // Thêm sự kiện click vào từng dòng trong bảng
                        const rows = document.querySelectorAll("#fingerprintTable tbody tr");
                        rows.forEach((row) => {
                            row.addEventListener("click", function () {
                                document.querySelector(".modal-content3").style.display = "none";
                                document.getElementById("confirmationContainer").style.display = "block";
                            });
                        });
                    } else {
                        // Lấy danh sách thát bại (test)
                        console.log("lấy danh sách vân tay thất bại.");
                    }
                } else {
                    console.error("Request failed:", response.status);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
        getListFinger();
        modal2.style.display = "flex"; // Hiện modal với display flex để căn giữa
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
        document.getElementById("confirmationContainer").style.display = "none";
        document.querySelector(".modal-content3").style.display = "block";
    }
});

// Xử lý lọc tìm kiếm
document.getElementById("searchInput").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#fingerprintTable tbody tr");

    rows.forEach((row) => {
        const fingerName = row.cells[1].textContent.toLowerCase();
        const owner = row.cells[2].textContent.toLowerCase();

        if (fingerName.includes(filter) || owner.includes(filter)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});

// Xử lý nút "Quay về"
document.getElementById("backButton").addEventListener("click", function () {
    document.getElementById("confirmationContainer").style.display = "none";
    document.querySelector(".modal-content3").style.display = "block";
});

// Xử lý nút "Xác nhận"
document.getElementById("confirmButton-delete").addEventListener("click", function () {
    document.querySelector(".modal3").style.display = "none";
    document.getElementById("confirmationContainer").style.display = "none";
    document.querySelector(".modal-content3").style.display = "block";
    console.log(document.querySelector(".modal-content3"));
    const successNotification = document.getElementById("successNotification");
    successNotification.textContent = "Xác nhận thành công!";
    successNotification.style.display = "block";

    // Tự động ẩn thông báo thành công sau 3 giây
    setTimeout(() => {
        successNotification.style.display = "none";
    }, 3000);
});

// Thông báo của nút thay đổi mật khẩu
const showMessageButtons3 = document.querySelectorAll(".show-message-button3");
const modal3 = document.querySelector(".modal4");
const closeButton3 = document.querySelector(".close4");

// Hiện thông báo khi bấm nút
showMessageButtons3.forEach((button) => {
    button.addEventListener("click", function () {
        modal3.style.display = "flex"; // Hiện modal với display flex để căn giữa
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
    }
});

//xử lý sự kiện thay đổi mật khẩu
// Xử lý sự kiện khi nhấn nút "Xác nhận"
document.getElementById("confirmButton").addEventListener("click", function () {
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const notification = document.getElementById("passwordNotification");

    if (newPassword === oldPassword) {
        notification.textContent = "Mật khẩu mới không được giống mật khẩu cũ!";
        notification.style.backgroundColor = "#f44336"; // Đỏ cho thông báo lỗi
    } else if (newPassword.length !== 4 || !/^\d{4}$/.test(newPassword)) {
        notification.textContent = "Mật khẩu phải là 4 chữ số!";
        notification.style.backgroundColor = "#f44336"; // Đỏ cho thông báo lỗi
    } else if (newPassword !== confirmPassword) {
        notification.textContent = "Mật khẩu mới không khớp!";
        notification.style.backgroundColor = "#f44336"; // Đỏ cho thông báo lỗi
    } else if (newPassword === confirmPassword && newPassword !== "" && oldPassword !== "") {
        notification.textContent = "Đổi mật khẩu thành công!";
        notification.style.backgroundColor = "#4CAF50"; // Xanh lá cho thông báo thành công
    } else {
        notification.textContent = "Vui lòng nhập đủ thông tin!";
        notification.style.backgroundColor = "#f44336";
    }

    // Hiển thị thông báo và tự động ẩn sau 3 giây
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
});

// Sự kiện của nút thêm vân tay
document.getElementById("buttonB").addEventListener("click", function () {
    document.getElementById("modal").style.display = "block";
});

// Sự kiện đóng thông báo
document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("modal").style.display = "none";
});


const openNoti2 = document.getElementById("modal2-confirmationContainer2");

// Sự kiện xử lý thông tin form
document.getElementById('infoForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn không cho form gửi đi

    // Lấy giá trị của các trường
    const owner = document.getElementById('owner').value;
    const gender = document.getElementById('gender').value;
    const age = document.getElementById('age').value;
    const finger = document.getElementById('finger').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    // Kiểm tra tính hợp lệ của các trường (nếu cần thêm yêu cầu đặc biệt)
    if (!owner || !gender || !age || !finger || !phone || !email) {
        alert('Vui lòng điền đầy đủ thông tin.');
        return;
    }

    //Ẩn form
    document.querySelector(".modal-content").style.display = "none";
    document.querySelector(".modal2-confirm-title2").innerHTML = "Vui lòng đưa vân tay vào máy quét";
    document.getElementById("modal2-confirmationContainer2").insertAdjacentHTML("beforeend", '<i class="bi bi-fingerprint"></i>');
    openNoti2.style.display = "block";
    overlay.style.display = "block";

    // Đoạn mã JavaScript dùng fetch để gửi yêu cầu POST
    const apiUrl = "http://localhost:8080/api/arduino/addNewFinger"; // Thay URL này bằng URL của API thực tế
    async function addNewFinger() {
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.status == "success") {
                    //Thêm vân tay thành công (test)
                    console.log("thêm vân tay vào arduino thành công!");
                    
                    //Lấy id vân tay vừa lưu từ arduino
                    const fingerprintID = data.data[0].fingerprintID
                    // Lưu vào database
                    addNewFingerDB(fingerprintID);
                } else {
                    // Thêm vân tay vào arduino thát bại (test)
                    console.log("thêm vân tay vào arduino thất bại.");
                }
            } else {
                console.error("Request failed:", response.status);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    addNewFinger();

    async function addNewFingerDB(fingerprintID) {
        // Đoạn mã JavaScript dùng fetch để gửi yêu cầu POST
        const apiUrl = "http://localhost:8080/api/addNewFingerDB"; // Thay URL này bằng URL của API thực tế
        const userInfo = {
            owner: owner,
            gender: gender,
            age: age,
            phone: phone,
            email: email,
            finger: finger,
            fingerprintID: fingerprintID
        };
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userInfo: userInfo }),
            });
            if (response.ok) {
                const data = await response.json();
                if (data.status == "success") {
                    //Thêm vân tay vào DB thành công (test)
                    console.log("thêm vân tay vào DB thành công!");
                } else {
                    // thêm vân tay vào DB thát bại (test)
                    console.log("thêm vân tay vào DB thất bại.");
                }
            } else {
                console.error("Request failed:", response.status);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Reset form để xóa các giá trị hiện tại
    document.getElementById('infoForm').reset();
});


// Đóng thông báo khi bấm ra ngoài
const check = document.querySelector(".modal");
check.addEventListener("click", function (event) {
    if (event.target === check) {
        check.style.display = "none"; // Ẩn modal nếu click ra ngoài
    }
});

// document.querySelector(".modal-btn").addEventListener("click", function () {
//     console.log("check");
//     document.getElementById("modal").style.display = "none";
//     document.querySelector(".modal2-confirm-title").innerHTML = "Vui lòng đưa vân tay vào máy quét";
//     document.getElementById("modal2-confirmationContainer").insertAdjacentHTML("beforeend", '<i class="bi bi-fingerprint"></i>');
//     overlay.style.display = "block";
//     openNoti.style.display = "block";
// });