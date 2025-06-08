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

// ฟังก์ชันสำหรับตรวจสอบข้อมูลซ้ำ
async function checkDuplicate(field, value) {
    try {
        // ใช้ URLSearchParams เพื่อจัดการการเข้ารหัส URL ที่ถูกต้อง
        const params = new URLSearchParams({
            action: 'checkDuplicate',
            [field]: value,
            field: field
        });
        const response = await fetch(`${SCRIPT_URL}?${params.toString()}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking duplicate:', error);
        return { status: 'error', message: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล' };
    }
}

// เพิ่มการตรวจสอบรหัสนักศึกษาแบบ Real-time
document.getElementById('studentId').addEventListener('blur', async function() {
    const studentId = this.value.trim();
    if (studentId && /^\d{10}$/.test(studentId)) {
        const result = await checkDuplicate('studentId', studentId);
        if (result.status === 'error') {
            Toast.fire({
                icon: 'error',
                title: result.message
            });
            this.value = '';
            this.focus();
        }
    }
});

// เพิ่มการตรวจสอบเบอร์โทรศัพท์แบบ Real-time
document.getElementById('phone').addEventListener('blur', async function() {
    const phone = this.value.trim();
    if (phone && /^\d{10}$/.test(phone)) {
        const result = await checkDuplicate('phone', phone);
        if (result.status === 'error') {
            Toast.fire({
                icon: 'error',
                title: result.message
            });
            this.value = '';
            this.focus();
        }
    }
});

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const studentIdInput = document.getElementById('studentId');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    let studentId = studentIdInput.value.trim();
    let phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // ตรวจสอบการกรอกข้อมูล
    if (!studentId || !phone || !password || !confirmPassword) {
        Toast.fire({
            icon: 'warning',
            title: 'กรุณากรอกข้อมูลให้ครบถ้วน'
        });
        return;
    }

    // ตรวจสอบรูปแบบรหัสนักศึกษา (10 หลัก)
    if (!/^\d{10}$/.test(studentId)) {
        Toast.fire({
            icon: 'error',
            title: 'รหัสนักศึกษาต้องเป็นตัวเลข 10 หลัก'
        });
        return;
    }

    // ตรวจสอบรูปแบบเบอร์โทรศัพท์ (10 หลัก)
    if (!/^\d{10}$/.test(phone)) {
        Toast.fire({
            icon: 'error',
            title: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก'
        });
        return;
    }

    // ตรวจสอบรหัสผ่านตรงกัน
    if (password !== confirmPassword) {
        Toast.fire({
            icon: 'error',
            title: 'รหัสผ่านไม่ตรงกัน'
        });
        return;
    }

    // ตรวจสอบข้อมูลซ้ำอีกครั้งก่อนบันทึก
    const studentIdCheck = await checkDuplicate('studentId', studentId);
    if (studentIdCheck.status === 'error') {
        Toast.fire({
            icon: 'error',
            title: studentIdCheck.message
        });
        return;
    }

    const phoneCheck = await checkDuplicate('phone', phone);
    if (phoneCheck.status === 'error') {
        Toast.fire({
            icon: 'error',
            title: phoneCheck.message
        });
        return;
    }

    // แสดง loading
    Swal.fire({
        title: 'กำลังสมัครสมาชิก...',
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
            action: 'register',
            studentId: studentId,
            password: password,
            phone: phone
        });

        const response = await fetch(`${SCRIPT_URL}?${params.toString()}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'สมัครสมาชิกสำเร็จ!',
                text: data.message,
                background: '#000',
                color: '#0f0',
                confirmButtonColor: '#0f0',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = 'index.html';
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