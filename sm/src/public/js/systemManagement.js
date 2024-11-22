const selectButton = document.querySelector('.select-btn');
let activeSelectButton = true;
const updateIP = async (ip) => {
    const apiUrl = "http://localhost:8080/api/updateIP"; // Thay URL này bằng URL của API thực tế
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ip: ip })
        });
        if (response.ok) {
            const data = await response.json();
            if (data.status == "success") {
                console.log(data.message);

                //Gửi tín hiệu heartbeat
                if(activeSelectButton){
                    setInterval(() => {
                        sendHearbeat();
                    }, 5000);
                }
            } else {
                // Lấy danh sách thát bại (test)
                console.log("cập nhật IP thất bại.");
            }
        } else {
            console.error("Request failed:", response.status);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Lấy danh sách hệ thống
function populateSystems(data) {
    const dropdown = document.querySelector('.select-dropdown');
    dropdown.innerHTML = ''; // Xóa nội dung cũ (nếu có)

    // Lấy lựa chọn từ cookie (nếu có)
    const savedSystem = getCookie("selectedSystem");
    if (savedSystem) {
        selectButton.textContent = `${savedSystem}`;
    }

    if (data && data.status === "success" && Array.isArray(data.data)) {
        data.data.forEach(system => {
            const selectItem = document.createElement('div');
            selectItem.classList.add('select-item');
            selectItem.setAttribute('ten-cua', system.tenHeThong); // Giá trị 'active' là ví dụ

            const systemName = document.createElement('span');
            systemName.classList.add('system-name');
            systemName.textContent = system.tenHeThong;

            const ipAddress = document.createElement('span');
            ipAddress.classList.add('ip-address');
            ipAddress.textContent = system.diaChiIP;

            selectItem.appendChild(systemName);
            selectItem.appendChild(ipAddress);

            // Thêm sự kiện click vào mỗi hàng
            selectItem.addEventListener('click', () => {
                // Lưu lựa chọn vào cookie
                setCookie("selectedSystem", system.tenHeThong);

                // Hiển thị tên hệ thống đã chọn
                selectButton.textContent = `${system.tenHeThong}`;

                //Gửi dữ liệu lên cho BE
                updateIP(system.diaChiIP);

                // Ẩn dropdown sau khi chọn
                dropdown.classList.remove('open');
            });

            dropdown.appendChild(selectItem);
        });

        // Thêm sự kiện click cho nút chọn hệ thống
        selectButton.addEventListener('click', (event) => {
            dropdown.classList.toggle('open');
            event.stopPropagation();
        });

        // Đóng menu khi click ra ngoài
        document.addEventListener('click', (event) => {
            if (!dropdown.contains(event.target) && !selectButton.contains(event.target)) {
                dropdown.classList.remove('open');
            }
        });
    } else {
        console.error("Dữ liệu không hợp lệ hoặc bị thiếu!");
    }
}

const sendHearbeat = async () => {
    const apiUrl = "http://localhost:8080/api/arduino/heartbeat"; // Thay URL này bằng URL của API thực tế
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
                console.log(data.message);
            } else {
                // Lấy danh sách thát bại (test)
                console.log("Device offline: ", data.timestamp);
            }
        } else {
            console.error("Request failed: ", response.status);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Hàm lưu cookie (session cookie)
function setCookie(name, value) {
    document.cookie = `${name}=${value}; path=/`; // Không đặt thời gian hết hạn -> tự động hết khi đóng trình duyệt
}

// Hàm lấy giá trị cookie
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, val] = cookie.split('=');
        if (key === name) return val;
    }
    return null;
}
const getListSystem = async () => {
    const apiUrl = "http://localhost:8080/api/getListSystem"; // Thay URL này bằng URL của API thực tế
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
                if(selectButton.textContent == "Chọn hệ thống"){
                    statusSelectButton = false;
                }
                //Lấy danh sách về thành công (test)
                populateSystems(data);
            } else {
                // Lấy danh sách thát bại (test)
                console.log("Lấy ds hệ thống thất bại.");
            }
        } else {
            console.error("Request failed:", response.status);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
getListSystem();
