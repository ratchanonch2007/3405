// ข้อมูลสินค้าตัวอย่าง
const products = [
    {
        id: 1,
        name: "เสื้อยืด Cyberpunk",
        price: 590,
        image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjJkMjY0ZjJiZjQ4NzFiYjY0ZjJiZjQ4NzFiYjY0ZjJiZjQ4NzFiYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPeQ5HJVgysxZew/giphy.gif",
        description: "เสื้อยืดสไตล์ไซเบอร์พังค์ ผลิตจากผ้าคุณภาพดี"
    },
    {
        id: 2,
        name: "กระเป๋าเป้ Neon",
        price: 1290,
        image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjJkMjY0ZjJiZjQ4NzFiYjY0ZjJiZjQ4NzFiYjY0ZjJiZjQ4NzFiYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPeQ5HJVgysxZew/giphy.gif",
        description: "กระเป๋าเป้มีไฟ LED สไตล์ไซเบอร์พังค์"
    },
    {
        id: 3,
        name: "แว่นตา LED",
        price: 890,
        image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjJkMjY0ZjJiZjQ4NzFiYjY0ZjJiZjQ4NzFiYjY0ZjJiZjQ4NzFiYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPeQ5HJVgysxZew/giphy.gif",
        description: "แว่นตามีไฟ LED เรืองแสง สไตล์อนาคต"
    },
    {
        id: 4,
        name: "รองเท้า Cyber",
        price: 2590,
        image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjJkMjY0ZjJiZjQ4NzFiYjY0ZjJiZjQ4NzFiYjY0ZjJiZjQ4NzFiYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPeQ5HJVgysxZew/giphy.gif",
        description: "รองเท้าสไตล์ไซเบอร์พังค์ มีไฟ LED"
    },
    {
        id: 5,
        name: "หมวก Hologram",
        price: 790,
        image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjJkMjY0ZjJiZjQ4NzFiYjY0ZjJiZjQ4NzFiYjY0ZjJiZjQ4NzFiYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPeQ5HJVgysxZew/giphy.gif",
        description: "หมวกแก๊ปลายโฮโลแกรม สะท้อนแสง"
    },
    {
        id: 6,
        name: "เสื้อแจ็คเก็ต LED",
        price: 3590,
        image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjJkMjY0ZjJiZjQ4NzFiYjY0ZjJiZjQ4NzFiYjY0ZjJiZjQ4NzFiYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPeQ5HJVgysxZew/giphy.gif",
        description: "เสื้อแจ็คเก็ตมีไฟ LED ปรับสีได้"
    }
];

// ตัวแปรสำหรับเก็บข้อมูลตะกร้าสินค้า
let cart = [];
let cartTotal = 0;

// เพิ่ม URL ของ Google Apps Script ที่ได้จากการ Deploy
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzDnRwCPi4zz9O_b0qHIY8tLEU3ogL_MyZ-P7qRJ2d4etwG5t5Uhr2GpafhoischkbC/exec';

// แสดงสินค้าในหน้าเว็บ
function displayProducts() {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">฿${product.price.toLocaleString()}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                เพิ่มลงตะกร้า
            </button>
        </div>
    `).join('');
}

// เพิ่มสินค้าลงตะกร้า
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    showAddToCartAnimation();
}

// อัพเดทการแสดงผลตะกร้าสินค้า
function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    
    // อัพเดทจำนวนสินค้าในไอคอนตะกร้า
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // อัพเดทรายการสินค้าในตะกร้า
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>จำนวน: ${item.quantity}</p>
                <p class="cart-item-price">฿${(item.price * item.quantity).toLocaleString()}</p>
            </div>
            <div class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </div>
        </div>
    `).join('');

    // อัพเดทยอดรวม
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    document.querySelector('.total-amount').textContent = `฿${cartTotal.toLocaleString()}`;
}

// ลบสินค้าออกจากตะกร้า
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// แสดงและซ่อนตะกร้าสินค้า
function toggleCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    cartSidebar.classList.toggle('active');
}

// แสดงแอนิเมชันเมื่อเพิ่มสินค้าลงตะกร้า
function showAddToCartAnimation() {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        background: '#000',
        color: '#0f0',
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    Toast.fire({
        icon: 'success',
        title: 'เพิ่มสินค้าลงตะกร้าแล้ว'
    });
}

// ฟังก์ชันสำหรับบันทึกประวัติการสั่งซื้อ
function saveOrderHistory(orderData) {
    // ดึงประวัติการสั่งซื้อของผู้ใช้คนนี้
    const studentId = localStorage.getItem('studentId');
    let userOrders = JSON.parse(localStorage.getItem(`orderHistory_${studentId}`)) || [];
    
    // เพิ่มคำสั่งซื้อใหม่
    userOrders.push(orderData);
    
    // บันทึกกลับลง localStorage
    localStorage.setItem(`orderHistory_${studentId}`, JSON.stringify(userOrders));
}

// ฟังก์ชันสำหรับแสดงประวัติการสั่งซื้อ
function displayOrderHistory() {
    const studentId = localStorage.getItem('studentId');
    const orderHistory = JSON.parse(localStorage.getItem(`orderHistory_${studentId}`)) || [];
    
    if (orderHistory.length === 0) {
        return `
            <div style="text-align: left; color: #0f0;">
                <p>ยังไม่มีประวัติการสั่งซื้อ</p>
                <small>* ประวัติการสั่งซื้อจะแสดงเฉพาะรายการที่ชำระเงินแล้วเท่านั้น</small>
            </div>
        `;
    }

    return `
        <div style="text-align: left; color: #0f0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h4 style="margin: 0;">ประวัติทั้งหมด ${orderHistory.length} รายการ</h4>
                <button onclick="clearOrderHistory()" style="
                    background: none;
                    border: 1px solid #f00;
                    color: #f00;
                    padding: 5px 15px;
                    cursor: pointer;
                    border-radius: 5px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                ">
                    <i class="fas fa-trash"></i> CLEAR
                </button>
            </div>
            <div style="max-height: 400px; overflow-y: auto;">
                ${orderHistory.map((order, index) => `
                    <div style="border: 1px solid #0f0; margin: 10px 0; padding: 10px; border-radius: 5px;">
                        <h4 style="margin: 0 0 10px 0;">คำสั่งซื้อที่ ${index + 1}</h4>
                        <p style="margin: 5px 0;">วันที่: ${new Date(order.date).toLocaleString('th-TH')}</p>
                        <p style="margin: 5px 0;">ห้อง: ${order.room}</p>
                        <p style="margin: 5px 0;">เบอร์โทร: ${order.phone || 'รอการอัพเดต'}</p>
                        <p style="margin: 5px 0;">ยอดรวม: ฿${Number(order.total).toLocaleString()}</p>
                        <div style="margin-top: 10px;">
                            <h5 style="margin: 5px 0;">รายการสินค้า:</h5>
                            <div style="margin: 5px 0 5px 10px;">
                                ${order.items}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ฟังก์ชันสำหรับเคลียร์ประวัติการสั่งซื้อ
function clearOrderHistory() {
    const studentId = localStorage.getItem('studentId');
    
    Swal.fire({
        title: 'ยืนยันการลบประวัติ',
        text: 'คุณต้องการลบประวัติการสั่งซื้อทั้งหมดใช่หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f00',
        cancelButtonColor: '#0f0',
        confirmButtonText: 'ใช่, ลบทั้งหมด',
        cancelButtonText: 'ยกเลิก',
        background: '#000',
        color: '#0f0'
    }).then((result) => {
        if (result.isConfirmed) {
            // ลบประวัติการสั่งซื้อของผู้ใช้คนนี้
            localStorage.removeItem(`orderHistory_${studentId}`);
            
            Swal.fire({
                title: 'ลบประวัติสำเร็จ',
                text: 'ประวัติการสั่งซื้อทั้งหมดถูกลบแล้ว',
                icon: 'success',
                background: '#000',
                color: '#0f0',
                confirmButtonColor: '#0f0'
            }).then(() => {
                // แสดงประวัติการสั่งซื้อใหม่ (จะเป็นหน้าว่าง)
                document.querySelector('#orderHistoryBtn').click();
            });
        }
    });
}

// ฟังก์ชันสำหรับดึงข้อมูลเบอร์โทร
async function getPhoneNumber(studentId) {
    try {
        // สร้าง FormData สำหรับส่งข้อมูล
        const formData = new FormData();
        formData.append('action', 'getPhone');
        formData.append('studentId', studentId);

        // ส่งคำขอแบบ POST และใช้ no-cors mode
        await fetch(SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });

        // เนื่องจากใช้ no-cors เราจะไม่สามารถอ่านค่า response ได้
        // ส่งคืน true เพื่อแสดงว่าการส่งข้อมูลสำเร็จ
        return true;
    } catch (error) {
        console.error('Error fetching phone number:', error);
        throw new Error('ไม่สามารถดึงข้อมูลเบอร์โทรได้');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // ตรวจสอบสถานะ admin อย่างเข้มงวด
    const isAdmin = localStorage.getItem('isAdmin') === 'true' && localStorage.getItem('studentId') === 'admin';
    const adminBtn = document.querySelector('#adminDashboardBtn');
    
    if (isAdmin) {
        adminBtn.style.display = 'block';
    } else {
        adminBtn.style.display = 'none';
    }

    displayProducts();
    
    // เปิด/ปิดตะกร้าสินค้า
    document.querySelector('#cartBtn').addEventListener('click', toggleCart);
    document.querySelector('.close-cart').addEventListener('click', toggleCart);
    
    // ปุ่ม Logout
    document.querySelector('#logoutBtn').addEventListener('click', () => {
        Swal.fire({
            title: 'ยืนยันการออกจากระบบ',
            text: 'คุณต้องการออกจากระบบใช่หรือไม่?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0f0',
            cancelButtonColor: '#f00',
            confirmButtonText: 'ใช่, ออกจากระบบ',
            cancelButtonText: 'ยกเลิก',
            background: '#000',
            color: '#0f0'
        }).then((result) => {
            if (result.isConfirmed) {
                // ลบข้อมูลผู้ใช้จาก localStorage
                localStorage.removeItem('studentId');
                // กลับไปหน้า login
                window.location.href = 'index.html';
            }
        });
    });

    // ปุ่มประวัติการสั่งซื้อ
    document.querySelector('#orderHistoryBtn').addEventListener('click', () => {
        Swal.fire({
            title: 'ประวัติการสั่งซื้อ',
            html: displayOrderHistory(),
            background: '#000',
            color: '#0f0',
            confirmButtonColor: '#0f0',
            width: '800px'
        });
    });

    // ปุ่มชำระเงิน
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            Swal.fire({
                title: 'ตะกร้าว่างเปล่า',
                text: 'กรุณาเลือกสินค้าก่อนชำระเงิน',
                icon: 'warning',
                background: '#000',
                color: '#0f0',
                confirmButtonColor: '#0f0'
            });
            return;
        }

        Swal.fire({
            title: 'กรอกข้อมูลการจัดส่ง',
            html: `
                <div class="input-group" style="margin-bottom: 1rem;">
                    <input type="text" id="roomNumber" class="swal2-input" style="
                        width: 100%;
                        max-width: 300px;
                        margin: 1em auto;
                        border: 1px solid #0f0;
                        background: rgba(0, 255, 0, 0.1);
                        color: #0f0;
                        padding: 12px;
                        border-radius: 5px;
                        font-size: 16px;
                        outline: none;
                    " placeholder="เลขห้อง (เช่น A101)" required>
                </div>
            `,
            background: '#000',
            color: '#0f0',
            confirmButtonColor: '#0f0',
            showCancelButton: true,
            cancelButtonColor: '#f00',
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ยืนยัน',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: true,
            stopKeydownPropagation: true,
            position: 'center',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                confirmButton: 'swal-custom-confirm',
                cancelButton: 'swal-custom-cancel'
            },
            showClass: {
                popup: 'animate__animated animate__fadeIn'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOut'
            },
            didOpen: () => {
                document.body.style.overflow = 'hidden';
                document.getElementById('roomNumber').focus();
            },
            willClose: () => {
                document.body.style.overflow = 'auto';
            },
            preConfirm: async () => {
                const room = document.getElementById('roomNumber').value;
                const studentId = localStorage.getItem('studentId');
                
                if (!room) {
                    Swal.showValidationMessage('กรุณากรอกเลขห้อง');
                    return false;
                }

                if (!studentId) {
                    Swal.showValidationMessage('กรุณาล็อกอินก่อนสั่งซื้อ');
                    return false;
                }

                try {
                    await getPhoneNumber(studentId);
                    return { room, studentId };
                } catch (error) {
                    console.error('Error in preConfirm:', error);
                    Swal.showValidationMessage('ไม่สามารถดึงข้อมูลเบอร์โทรได้ กรุณาลองใหม่อีกครั้ง');
                    return false;
                }
            }
        }).then((formResult) => {
            if (formResult.isConfirmed) {
                const { room, studentId } = formResult.value;

                // สร้าง FormData สำหรับดึงเบอร์โทร
                const phoneFormData = new FormData();
                phoneFormData.append('action', 'getPhone');
                phoneFormData.append('studentId', studentId);

                // ดึงเบอร์โทรก่อนบันทึกข้อมูล
                fetch(SHEETS_URL, {
                    method: 'POST',
                    body: phoneFormData
                })
                .then(response => response.json())
                .then(data => {
                    const phone = data.phone || 'ไม่พบเบอร์โทร';

                    // เตรียมข้อมูลสำหรับบันทึก
                    const orderData = {
                        date: new Date().toISOString(),
                        room: room,
                        total: cartTotal,
                        studentId: studentId,
                        phone: phone,
                        items: cart.map(item => `${item.name} (${item.quantity} ชิ้น) - ฿${(item.price * item.quantity).toLocaleString()}`).join(', ')
                    };

                    // บันทึกลง localStorage สำหรับประวัติการสั่งซื้อ
                    saveOrderHistory(orderData);

                    // ส่งข้อมูลไปยัง Google Sheets
                    const orderFormData = new FormData();
                    orderFormData.append('action', 'saveOrder');
                    orderFormData.append('date', orderData.date);
                    orderFormData.append('room', orderData.room);
                    orderFormData.append('total', orderData.total);
                    orderFormData.append('studentId', orderData.studentId);
                    orderFormData.append('phone', orderData.phone);
                    orderFormData.append('items', orderData.items);

                    return fetch(SHEETS_URL, {
                        method: 'POST',
                        body: orderFormData
                    });
                })
                .then(() => {
                    Swal.fire({
                        title: 'สั่งซื้อสำเร็จ!',
                        text: `เราจะจัดส่งสินค้าไปที่ห้อง ${room} โปรดรอสักครู่`,
                        icon: 'success',
                        background: '#000',
                        color: '#0f0',
                        confirmButtonColor: '#0f0',
                        timer: 3000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    });
                    
                    // เคลียร์ตะกร้า
                    cart = [];
                    updateCart();
                    toggleCart();
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด!',
                        text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
                        background: '#000',
                        color: '#0f0',
                        confirmButtonColor: '#0f0'
                    });
                });
            }
        });
    });

    // Admin Dashboard
    document.querySelector('#adminDashboardBtn').addEventListener('click', () => {
        Swal.fire({
            title: 'ADMIN Dashboard',
            html: `
                <div style="text-align: left; color: #0f0;">
                    <div style="margin-bottom: 20px;">
                        <h4 style="margin: 0 0 10px 0;">สถิติการขาย</h4>
                        <p>- จำนวนคำสั่งซื้อทั้งหมด: ${(JSON.parse(localStorage.getItem('orderHistory')) || []).length} รายการ</p>
                        <p>- ยอดขายรวม: ฿${calculateTotalSales().toLocaleString()}</p>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <h4 style="margin: 0 0 10px 0;">การจัดการสินค้า</h4>
                        <button onclick="manageProducts()" style="
                            background: none;
                            border: 1px solid #0f0;
                            color: #0f0;
                            padding: 8px 15px;
                            margin: 5px;
                            cursor: pointer;
                            border-radius: 5px;
                        ">
                            <i class="fas fa-box"></i> จัดการสินค้า
                        </button>
                    </div>
                    <div>
                        <h4 style="margin: 0 0 10px 0;">การจัดการคำสั่งซื้อ</h4>
                        <button onclick="viewAllOrders()" style="
                            background: none;
                            border: 1px solid #0f0;
                            color: #0f0;
                            padding: 8px 15px;
                            margin: 5px;
                            cursor: pointer;
                            border-radius: 5px;
                        ">
                            <i class="fas fa-list"></i> ดูคำสั่งซื้อทั้งหมด
                        </button>
                    </div>
                </div>
            `,
            background: '#000',
            color: '#0f0',
            confirmButtonColor: '#0f0',
            width: '600px'
        });
    });
});

// ฟังก์ชันคำนวณยอดขายรวม
function calculateTotalSales() {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    return orderHistory.reduce((total, order) => total + order.total, 0);
}

// ฟังก์ชันจัดการสินค้า
function manageProducts() {
    Swal.fire({
        title: 'จัดการสินค้า',
        html: `
            <div style="text-align: left; color: #0f0;">
                <p>จำนวนสินค้าทั้งหมด: ${products.length} รายการ</p>
                <div style="margin-top: 15px;">
                    <button onclick="addNewProduct()" style="
                        background: none;
                        border: 1px solid #0f0;
                        color: #0f0;
                        padding: 8px 15px;
                        margin: 5px;
                        cursor: pointer;
                        border-radius: 5px;
                    ">
                        <i class="fas fa-plus"></i> เพิ่มสินค้าใหม่
                    </button>
                </div>
                <div style="margin-top: 15px; max-height: 300px; overflow-y: auto;">
                    ${products.map((product, index) => `
                        <div style="border: 1px solid #0f0; margin: 10px 0; padding: 10px; border-radius: 5px;">
                            <p style="margin: 5px 0;">${product.name} - ฿${product.price.toLocaleString()}</p>
                            <button onclick="editProduct(${index})" style="
                                background: none;
                                border: 1px solid #0f0;
                                color: #0f0;
                                padding: 5px 10px;
                                margin: 5px;
                                cursor: pointer;
                                border-radius: 5px;
                                font-size: 12px;
                            ">
                                <i class="fas fa-edit"></i> แก้ไข
                            </button>
                            <button onclick="deleteProduct(${index})" style="
                                background: none;
                                border: 1px solid #f00;
                                color: #f00;
                                padding: 5px 10px;
                                margin: 5px;
                                cursor: pointer;
                                border-radius: 5px;
                                font-size: 12px;
                            ">
                                <i class="fas fa-trash"></i> ลบ
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `,
        background: '#000',
        color: '#0f0',
        confirmButtonColor: '#0f0',
        width: '600px'
    });
}

// ฟังก์ชันดูคำสั่งซื้อทั้งหมด
function viewAllOrders() {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    Swal.fire({
        title: 'คำสั่งซื้อทั้งหมด',
        html: `
            <div style="text-align: left; color: #0f0;">
                <p>จำนวนคำสั่งซื้อทั้งหมด: ${orderHistory.length} รายการ</p>
                <div style="margin-top: 15px; max-height: 400px; overflow-y: auto;">
                    ${orderHistory.map((order, index) => `
                        <div style="border: 1px solid #0f0; margin: 10px 0; padding: 10px; border-radius: 5px;">
                            <h4 style="margin: 0 0 10px 0;">คำสั่งซื้อที่ ${index + 1}</h4>
                            <p style="margin: 5px 0;">วันที่: ${new Date(order.date).toLocaleString('th-TH')}</p>
                            <p style="margin: 5px 0;">ห้อง: ${order.roomNumber}</p>
                            <p style="margin: 5px 0;">ยอดรวม: ฿${order.total.toLocaleString()}</p>
                            <div style="margin-top: 10px;">
                                <h5 style="margin: 5px 0;">รายการสินค้า:</h5>
                                ${order.items.map(item => `
                                    <div style="margin: 5px 0 5px 10px;">
                                        - ${item.name} (${item.quantity} ชิ้น) - ฿${(item.price * item.quantity).toLocaleString()}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `,
        background: '#000',
        color: '#0f0',
        confirmButtonColor: '#0f0',
        width: '800px'
    });
} 