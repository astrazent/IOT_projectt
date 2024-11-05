// Thông báo của nút mở cửa
const showMessageButtons = document.querySelectorAll('.show-message-button');
const modal = document.querySelector('.modal2');
const closeButton = document.querySelector('.close2');

// Hiện thông báo khi bấm nút
showMessageButtons.forEach(button => {
    button.addEventListener('click', function() {
        modal.style.display = 'flex'; // Hiện modal với display flex để căn giữa
    });
});

// Đóng thông báo khi bấm nút đóng
closeButton.addEventListener('click', function() {
    modal.style.display = 'none'; // Ẩn modal
});

// Đóng thông báo khi bấm ra ngoài modal
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none'; // Ẩn modal nếu click ra ngoài
    }
});

// Thông báo của nút xoá vân tay
const showMessageButtons2 = document.querySelectorAll('.show-message-button2');
const modal2 = document.querySelector('.modal3');
const closeButton2 = document.querySelector('.close3');

// Hiện thông báo khi bấm nút
showMessageButtons2.forEach(button => {
    button.addEventListener('click', function() {
        modal2.style.display = 'flex'; // Hiện modal với display flex để căn giữa
    });
});

// Đóng thông báo khi bấm nút đóng
closeButton2.addEventListener('click', function() {
    modal2.style.display = 'none'; // Ẩn modal
});

// Đóng thông báo khi bấm ra ngoài modal
window.addEventListener('click', function(event) {
    if (event.target === modal2) {
        modal2.style.display = 'none'; // Ẩn modal nếu click ra ngoài
    }
});

// Thông báo của nút thay đổi mật khẩu
const showMessageButtons3 = document.querySelectorAll('.show-message-button3');
const modal3 = document.querySelector('.modal4');
const closeButton3 = document.querySelector('.close4');

// Hiện thông báo khi bấm nút
showMessageButtons3.forEach(button => {
    button.addEventListener('click', function() {
        modal3.style.display = 'flex'; // Hiện modal với display flex để căn giữa
    });
});

// Đóng thông báo khi bấm nút đóng
closeButton3.addEventListener('click', function() {
    modal3.style.display = 'none'; // Ẩn modal
});

// Đóng thông báo khi bấm ra ngoài modal
window.addEventListener('click', function(event) {
    if (event.target === modal3) {
        modal3.style.display = 'none'; // Ẩn modal nếu click ra ngoài
    }
});



// Sự kiện của nút thêm vân tay
document.getElementById('buttonB').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'block';
});

// Sự kiện đóng thông báo
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
});

// Sự kiện xử lý thông tin form
document.getElementById('infoForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn không cho form gửi
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const password = document.getElementById('password').value;
    console.log(`Họ: ${firstName}, Tên: ${lastName}, Mật khẩu: ${password}`);
    alert('Thông tin đã được gửi');
    document.getElementById('modal').style.display = 'none'; // Đóng modal
});

// Đóng thông báo khi bấm ra ngoài
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
