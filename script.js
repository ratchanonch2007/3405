// Google Apps Script URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyvPOp73R7LmkgXioDxQgqYPjmUMh-KMng3YNF6X9278IGm-07nIov5IuWFEqFCBtHs/exec';

// กำหนดธีม SweetAlert2 แบบ Cyberpunk
const Toast = Swal.mixin({
    background: '#000',
    color: '#0f0',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

// ฟังก์ชันจัดการ floating label
function handleFloatingLabels() {
    const inputs = document.querySelectorAll('.input-group input');
    
    inputs.forEach(input => {
        const label = input.nextElementSibling;
        
        // เช็คค่าเริ่มต้น
        if (input.value.trim() !== '') {
            label.classList.add('float');
        }
        
        // เช็คการเปลี่ยนแปลง
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                label.classList.add('float');
            } else {
                label.classList.remove('float');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', handleFloatingLabels);

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const studentIdInput = document.getElementById('studentId');
    const passwordInput = document.getElementById('password');
    
    let studentId = studentIdInput.value.trim();
    const password = passwordInput.value;

    // ตรวจสอบการล็อกอิน admin
    if (studentId === 'admin' && password === 'admin') {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('studentId', 'admin');
        Swal.fire({
            icon: 'success',
            title: 'เข้าสู่ระบบสำเร็จ!',
            text: 'ยินดีต้อนรับ Admin',
            background: '#000',
            color: '#0f0',
            confirmButtonColor: '#0f0',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            window.location.href = 'shop.html';
        });
        return;
    }

    // ตรวจสอบการกรอกข้อมูล
    if (!studentId || !password) {
        Toast.fire({
            icon: 'warning',
            title: 'กรุณากรอกข้อมูลให้ครบถ้วน'
        });
        return;
    }

    // ตรวจสอบรูปแบบรหัสนักศึกษา (10 หลัก) เฉพาะกรณีไม่ใช่ admin
    if (studentId !== 'admin' && !/^\d{10}$/.test(studentId)) {
        Toast.fire({
            icon: 'error',
            title: 'รหัสนักศึกษาต้องเป็นตัวเลข 10 หลัก'
        });
        return;
    }

    // แสดง loading
    Swal.fire({
        title: 'กำลังเข้าสู่ระบบ...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        background: '#000',
        color: '#0f0',
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        // ใช้ URLSearchParams เพื่อจัดการการเข้ารหัส URL ที่ถูกต้อง
        const params = new URLSearchParams({
            action: 'login',
            studentId: studentId,
            password: password
        });

        const response = await fetch(`${SCRIPT_URL}?${params.toString()}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: data.message,
                background: '#000',
                color: '#0f0',
                confirmButtonColor: '#0f0',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                // บันทึกข้อมูลผู้ใช้ลง localStorage
                localStorage.setItem('studentId', studentId);
                // เปลี่ยนหน้าไปยังหน้าร้านค้า
                window.location.href = 'shop.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'ไม่สำเร็จ!',
                text: data.message,
                background: '#000',
                color: '#0f0',
                confirmButtonColor: '#0f0'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด!',
            text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง',
            background: '#000',
            color: '#0f0',
            confirmButtonColor: '#0f0'
        });
        console.error('Error:', error);
    }
}); 