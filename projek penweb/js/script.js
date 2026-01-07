/* =========================================
   1. SETUP GLOBAL & INISIALISASI
   ========================================= */
// Ambil data keranjang dari penyimpanan lokal (Local Storage)
let keranjang = JSON.parse(localStorage.getItem('keranjangBelanja')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // Fungsi yang wajib jalan di semua halaman
    initNavbar();
    initDarkMode();
    updateCartBadge();

    // Fungsi khusus per halaman (Cek apakah elemen ada di halaman tsb)
    if (document.querySelector('.home-slider')) initSlider();
    if (document.getElementById('detail-title')) initDetailPage();
    if (document.getElementById('cart-items')) tampilkanKeranjang();
    if (document.getElementById('chatBox')) initChatPage();
});

// Helper: Format Rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

// Helper: Bersihkan string harga (misal: "Rp 3.200.000" jadi 3200000)
const cleanPrice = (str) => {
    return parseInt(String(str).replace(/[^0-9]/g, '')) || 0;
};

/* =========================================
   2. NAVBAR & DARK MODE
   ========================================= */
function initNavbar() {
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            navbar.classList.toggle('active');
            menuIcon.classList.toggle('bx-x'); // Ubah ikon burger jadi X
        });

        // Tutup menu saat scroll
        window.onscroll = () => {
            navbar.classList.remove('active');
            menuIcon.classList.remove('bx-x');
        };
    }
}

function initDarkMode() {
    const icon = document.getElementById('theme-icon');
    if (!icon) return;

    // Cek penyimpanan tema sebelumnya
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        icon.classList.replace('bx-moon', 'bx-sun');
    }

    icon.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            icon.classList.replace('bx-moon', 'bx-sun');
        } else {
            localStorage.setItem('theme', 'light');
            icon.classList.replace('bx-sun', 'bx-moon');
        }
    });
}

function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = keranjang.length > 0 ? keranjang.length : '';
        badge.style.display = keranjang.length > 0 ? 'block' : 'none';
    }
}

/* =========================================
   3. SLIDER HOME (SWIPER JS)
   ========================================= */
function initSlider() {
    new Swiper(".home-slider", {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}

/* =========================================
   4. LOGIKA PRODUK & DETAIL
   ========================================= */
// Fungsi dipanggil saat tombol "Beli" diklik di Home/Products
function bukaDetail(nama, harga, gambar, deskripsi) {
    // Kirim data lewat URL Parameter
    const url = `detail-produk.html?nama=${encodeURIComponent(nama)}&harga=${encodeURIComponent(harga)}&gambar=${encodeURIComponent(gambar)}&deskripsi=${encodeURIComponent(deskripsi)}`;
    window.location.href = url;
}

// Variabel sementara untuk halaman detail
let currentProduct = {};

function initDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const nama = params.get('nama');
    
    if (nama) {
        currentProduct = {
            nama: nama,
            harga: params.get('harga'),
            gambar: params.get('gambar'),
            deskripsi: params.get('deskripsi')
        };

        // Isi elemen HTML dengan data
        document.getElementById('detail-title').textContent = currentProduct.nama;
        document.getElementById('detail-price').textContent = currentProduct.harga;
        document.getElementById('detail-img').src = currentProduct.gambar;
        document.getElementById('detail-desc').textContent = currentProduct.deskripsi;
    } else {
        // Jika dibuka tanpa klik produk
        document.getElementById('detail-title').textContent = "Produk Tidak Ditemukan";
        document.querySelector('.product-info').innerHTML = "<p class='text-danger'>Silakan pilih produk dari halaman Home atau Products.</p><a href='index.html' class='btn btn-primary'>Ke Halaman Utama</a>";
    }
}

// Dipanggil tombol "Keranjang" di detail produk
function tambahKeranjang() {
    if (!currentProduct.nama) return;

    keranjang.push(currentProduct);
    localStorage.setItem('keranjangBelanja', JSON.stringify(keranjang)); // Simpan ke memori
    
    updateCartBadge();
    
    // Notifikasi Sukses
    Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Produk telah ditambahkan ke keranjang.',
        showConfirmButton: false,
        timer: 1500
    });
}

// Dipanggil tombol "Beli Sekarang"
function beliSekarang() {
    if (!currentProduct.nama) return;
    
    tambahKeranjang(); // Tambah dulu
    setTimeout(() => {
        window.location.href = "keranjang.html"; // Redirect ke keranjang
    }, 1000);
}

/* =========================================
   5. LOGIKA HALAMAN KERANJANG
   ========================================= */
function tampilkanKeranjang() {
    const tbody = document.getElementById('cart-items');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const totalItems = document.getElementById('total-items');
    const totalPrice = document.getElementById('total-price');

    // Ambil data terbaru
    keranjang = JSON.parse(localStorage.getItem('keranjangBelanja')) || [];
    tbody.innerHTML = '';

    if (keranjang.length === 0) {
        emptyMsg.classList.remove('d-none');
        totalItems.textContent = "0 Item";
        totalPrice.textContent = "Rp 0";
    } else {
        emptyMsg.classList.add('d-none');
        let total = 0;

        keranjang.forEach((item, index) => {
            let hargaAngka = cleanPrice(item.harga);
            total += hargaAngka;

            let row = `
                <tr>
                    <td class="bg-transparent text-secondary">
                        <div class="d-flex align-items-center gap-3">
                            <img src="${item.gambar}" style="width: 60px; height: 60px; object-fit: contain; border-radius: 5px; background: #fff; padding: 2px; border: 1px solid #ddd;">
                            <span class="fw-bold">${item.nama}</span>
                        </div>
                    </td>
                    <td class="bg-transparent text-danger fw-bold align-middle">${item.harga}</td>
                    <td class="bg-transparent text-center align-middle">
                        <button onclick="hapusItem(${index})" class="btn btn-sm btn-outline-danger rounded-circle" style="width: 35px; height: 35px;">
                            <i class='bx bx-trash'></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

        totalItems.textContent = keranjang.length + " Item";
        totalPrice.textContent = formatRupiah(total);
    }
    updateCartBadge();
}

function hapusItem(index) {
    keranjang.splice(index, 1); // Hapus 1 item di index tsb
    localStorage.setItem('keranjangBelanja', JSON.stringify(keranjang));
    tampilkanKeranjang(); // Render ulang
}

function hapusSemuaKeranjang() {
    if (keranjang.length === 0) return;

    Swal.fire({
        title: 'Kosongkan Keranjang?',
        text: "Semua barang akan dihapus!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('keranjangBelanja');
            tampilkanKeranjang();
            Swal.fire('Terhapus!', 'Keranjang Anda sudah kosong.', 'success');
        }
    });
}

function checkout() {
    if (keranjang.length === 0) {
        return Swal.fire('Oops...', 'Keranjang belanja Anda masih kosong!', 'error');
    }

    // Simulasi Loading Checkout
    Swal.fire({
        title: 'Memproses Pesanan...',
        html: 'Mohon tunggu sebentar',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        }
    }).then(() => {
        // Simulasi Sukses
        Swal.fire({
            icon: 'success',
            title: 'Pesanan Berhasil!',
            text: 'Terima kasih telah berbelanja di HomeElectro.',
            confirmButtonText: 'Kembali ke Home'
        }).then(() => {
            localStorage.removeItem('keranjangBelanja'); // Bersihkan keranjang
            window.location.href = 'index.html';
        });
    });
}

/* =========================================
   6. LOGIKA HALAMAN CHAT
   ========================================= */
function initChatPage() {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatBox = document.getElementById('chatBox');

    // Auto scroll ke bawah saat load
    chatBox.scrollTop = chatBox.scrollHeight;

    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const text = chatInput.value;
        if (text.trim() === '') return;

        // 1. Pesan User
        addMessage(text, 'user');
        chatInput.value = '';

        // 2. Balasan Admin (Delay)
        setTimeout(() => {
            autoReply(text);
        }, 1200);
    });

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('message', sender);
        div.innerHTML = text;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll
    }

    function autoReply(userText) {
        let reply = "Terima kasih, admin kami sedang sibuk. Mohon tinggalkan nomor WA Anda.";
        let text = userText.toLowerCase();

        if (text.includes('halo') || text.includes('hai') || text.includes('pagi') || text.includes('siang')) {
            reply = "Halo kak! Selamat datang di HomeElectro. Ada yang bisa dibantu?";
        } else if (text.includes('harga') || text.includes('mahal') || text.includes('biaya')) {
            reply = "Harga yang tertera sudah harga pas kak, kualitas dijamin original garansi resmi!";
        } else if (text.includes('garansi') || text.includes('rusak')) {
            reply = "Untuk klaim garansi, kakak bisa lampirkan foto struk dan kirimkan unitnya ke toko kami ya.";
        } else if (text.includes('stok') || text.includes('ready')) {
            reply = "Stok produk kami saat ini masih aman kak, silakan langsung diorder sebelum kehabisan.";
        } else if (text.includes('terima kasih') || text.includes('makasih')) {
            reply = "Sama-sama kak! Happy Shopping! 😊";
        }

        addMessage(reply, 'admin');
    }
}

/* =========================================
   7. LOGIKA HALAMAN LOGIN
   ========================================= */
function handleLogin(event) {
    event.preventDefault(); // Cegah reload form

    const email = document.getElementById('email').value;
    const btn = document.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    // Ubah tombol jadi loading
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading...';
    btn.disabled = true;

    setTimeout(() => {
        // Tampilkan Sukses
        Swal.fire({
            title: 'Login Berhasil!',
            text: `Selamat datang kembali, ${email}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "index.html";
        });
    }, 1500);
}