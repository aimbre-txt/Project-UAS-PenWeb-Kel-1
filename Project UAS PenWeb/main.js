/* ================================
   PROFILE DROPDOWN
================================ */
const profileBtn = document.getElementById("profileBtn");
const profileList = document.getElementById("profileList");

if (profileBtn && profileList) {
  profileBtn.onclick = () => {
    profileList.style.display =
      profileList.style.display === "block" ? "none" : "block";
  };

  document.addEventListener("click", (e) => {
    if (!profileBtn.contains(e.target)) {
      profileList.style.display = "none";
    }
  });
}

/* ================================
   SWIPER
================================ */
if (document.querySelector(".home-slider")) {
  new Swiper(".home-slider", {
    loop: true,
    autoplay: { delay: 2500 },
    pagination: { el: ".swiper-pagination" },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    }
  });
}

/* ================================
   LOGIN
================================ */
function login(event) {
  event.preventDefault();

  const username = document.getElementById("username");
  const password = document.getElementById("password");

  if (!username || !password) return;

  if (username.value === "admin" && password.value === "12345") {
    alert("Login berhasil!");
    window.location.href = "index.html";
  } else {
    alert("Username atau password salah!");
  }
}

/* ================================
   CHAT
================================ */
function kirimPesan() {
  const input = document.getElementById("pesan");
  const chatBody = document.getElementById("chatBody");

  if (!input || !chatBody || input.value.trim() === "") return;

  const pesanUser = document.createElement("div");
  pesanUser.className = "message user";
  pesanUser.innerText = input.value;

  chatBody.appendChild(pesanUser);
  input.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;

  setTimeout(() => {
    const balasan = document.createElement("div");
    balasan.className = "message admin";
    balasan.innerText =
      "Terima kasih, pesan Anda sudah kami terima. Silakan tunggu admin membalas 😊";

    chatBody.appendChild(balasan);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 1000);
}

/* ================================
   BUKA DETAIL PRODUK
================================ */
function bukaDetail(nama, harga, gambar, deskripsi) {
  window.location.href =
    "detail-produk.html" +
    "?nama=" + encodeURIComponent(nama) +
    "&harga=" + encodeURIComponent(harga) +
    "&gambar=" + encodeURIComponent(gambar) +
    "&deskripsi=" + encodeURIComponent(deskripsi);
}

/* ================================
   DETAIL PRODUK (KHUSUS)
================================ */
if (window.location.pathname.includes("detail-produk.html")) {
  const params = new URLSearchParams(window.location.search);

  const nama = params.get("nama");
  const harga = params.get("harga");
  const gambar = params.get("gambar");
  const deskripsi = params.get("deskripsi");

  if (nama && harga && gambar && deskripsi) {
    document.getElementById("nama").textContent = nama;
    document.getElementById("harga").textContent = harga;
    document.getElementById("deskripsi").textContent = deskripsi;

    const img = document.getElementById("gambar");
    img.src = gambar;
    img.alt = nama;
  }
}

/* ================================
   TOMBOL DETAIL
================================ */
function keranjang() {
  // Ambil data produk dari halaman detail
  const produk = {
    nama: document.getElementById("nama").textContent,
    harga: document.getElementById("harga").textContent,
    gambar: document.getElementById("gambar").src,
    deskripsi: document.getElementById("deskripsi").textContent,
    qty: 1
  };

  // Ambil keranjang dari localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Cek apakah produk sudah ada
  const index = cart.findIndex(item => item.nama === produk.nama);

  if (index !== -1) {
    cart[index].qty += 1; // tambah jumlah
  } else {
    cart.push(produk);
  }

  // Simpan kembali ke localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Produk berhasil ditambahkan ke keranjang 🛒");
}

function beli() {
  alert("Menuju pembayaran");
}
function tampilkanKeranjang() {
  const cartList = document.getElementById("cart-list");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartList.innerHTML = "<p>Keranjang kosong</p>";
    return;
  }

  cartList.innerHTML = "";

  cart.forEach((item, index) => {
    cartList.innerHTML += `
      <div class="cart-item">
        <img src="${item.gambar}" width="100">
        <h4>${item.nama}</h4>
        <p>${item.harga}</p>
        <p>Jumlah: ${item.qty}</p>
        <button onclick="hapusItem(${index})">Hapus</button>
        <hr>
      </div>
    `;
  });
}

function hapusItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  tampilkanKeranjang();
}

function kosongkanKeranjang() {
  localStorage.removeItem("cart");
  tampilkanKeranjang();
}

function beli() {
  const params = new URLSearchParams(window.location.search);

  const pesanan = {
    nama: params.get("nama"),
    harga: params.get("harga"),
    gambar: params.get("gambar"),
    tanggal: new Date().toLocaleString()
  };

  let riwayat = JSON.parse(localStorage.getItem("riwayatPesanan")) || [];
  riwayat.push(pesanan);

  localStorage.setItem("riwayatPesanan", JSON.stringify(riwayat));

  alert("Pesanan berhasil dibuat!");
  window.location.href = "riwayat-pesanan.html";
}

const historyList = document.getElementById("historyList");
const kosong = document.getElementById("kosong");

if (historyList) {
  const data = JSON.parse(localStorage.getItem("riwayatPesanan")) || [];

  if (data.length === 0) {
    kosong.style.display = "block";
  } else {
    data.reverse().forEach(item => {
      const card = document.createElement("div");
      card.className = "history-card";

      card.innerHTML = `
        <img src="${item.gambar}">
        <div class="history-info">
          <h4>${item.nama}</h4>
          <p>${item.harga}</p>
          <small>Dipesan: ${item.tanggal}</small>
        </div>
      `;

      historyList.appendChild(card);
    });
  }
}

const riwayatEl = document.getElementById("riwayatList");

if (riwayatEl) {
  let riwayat = JSON.parse(localStorage.getItem("riwayatPesanan")) || [];

  if (riwayat.length === 0) {
    riwayatEl.innerHTML = "<p>Belum ada pesanan.</p>";
  } else {
    riwayatEl.innerHTML = "";

    riwayat.forEach((item, index) => {
      riwayatEl.innerHTML += `
        <div style="border:1px solid #ddd; padding:10px; margin-bottom:10px;">
          <img src="${item.gambar}" width="80"><br>
          <strong>${item.nama}</strong><br>
          <span>${item.harga}</span><br>
          <small>${item.tanggal}</small><br><br>
          <button onclick="hapusPesanan(${index})">Hapus</button>
        </div>
      `;
    });
  }
}
function hapusPesanan(index) {
  let riwayat = JSON.parse(localStorage.getItem("riwayatPesanan")) || [];

  if (confirm("Hapus pesanan ini?")) {
    riwayat.splice(index, 1);
    localStorage.setItem("riwayatPesanan", JSON.stringify(riwayat));
    location.reload();
  }
}

function hapusSemua() {
  if (confirm("Hapus semua riwayat pesanan?")) {
    localStorage.removeItem("riwayatPesanan");
    location.reload();
  }
}
