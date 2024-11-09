// Smooth Scroll
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Fade-in on scroll
const fadeElements = document.querySelectorAll('.fade-in');

const fadeInOnScroll = () => {
    fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight) {
            el.style.opacity = 1;
            el.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', fadeInOnScroll);

// Inisialisasi opacity dan translate awal untuk animasi fade-in
fadeElements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const header = document.querySelector('header');
const footer = document.querySelector('footer');
const navLinks = document.querySelectorAll('nav a');

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    header.classList.toggle('dark-mode');
    footer.classList.toggle('dark-mode');
    navLinks.forEach(link => link.classList.toggle('dark-mode'));
});

const modelSelect = document.getElementById('model');
const quantityInput = document.getElementById('quantity');
const totalPriceText = document.getElementById('totalPrice');
const colorSection = document.getElementById('colorSection');
const zipperColors = document.getElementById('zipperColors');
const setelanColors = document.getElementById('setelanColors');
const colorZipper = document.getElementById('colorZipper');
const colorSetelan = document.getElementById('colorSetelan');
const paymentMethodCOD = document.getElementById('cod');
const paymentMethodTransfer = document.getElementById('transfer');
const accountNumberSection = document.getElementById('accountNumberSection');
const accountNumberInput = document.getElementById('accountNumber');

const prices = {
    zipper: 150000,
    "non-zipper": 140000,
    setelan: 180000
};

// Fungsi untuk menghitung total harga
function calculateTotalPrice() {
    const selectedModel = modelSelect.value;
    const quantity = parseInt(quantityInput.value) || 0;
    const price = prices[selectedModel] || 0;
    const totalPrice = price * quantity;

    totalPriceText.textContent = `Rp${totalPrice.toLocaleString('id-ID')}`;
}

// Menampilkan pilihan warna berdasarkan model dan menghitung harga
modelSelect.addEventListener('change', function() {
    const selectedModel = this.value;

    // Menampilkan atau menyembunyikan opsi warna berdasarkan model
    if (selectedModel === 'zipper' || selectedModel === 'non-zipper') {
        colorSection.style.display = 'block';
        zipperColors.style.display = 'block';
        setelanColors.style.display = 'none';
        colorSetelan.value = ''; // Reset pilihan warna setelan
    } else if (selectedModel === 'setelan') {
        colorSection.style.display = 'block';
        zipperColors.style.display = 'none';
        setelanColors.style.display = 'block';
        colorZipper.value = ''; // Reset pilihan warna zipper
    } else {
        colorSection.style.display = 'none'; // Sembunyikan semua jika model tidak dipilih
        zipperColors.style.display = 'none';
        setelanColors.style.display = 'none';
        colorZipper.value = '';
        colorSetelan.value = '';
    }

    // Hitung total harga
    calculateTotalPrice();
});

// Menghitung total harga ketika jumlah produk berubah
quantityInput.addEventListener('input', calculateTotalPrice);

// Fungsi untuk menampilkan atau menyembunyikan nomor rekening
function toggleAccountNumber() {
    if (paymentMethodTransfer.checked) {
        accountNumberSection.style.display = 'block';
    } else {
        accountNumberSection.style.display = 'none';
    }
}

// Event listener untuk pilihan metode pembayaran
paymentMethodCOD.addEventListener('change', toggleAccountNumber);
paymentMethodTransfer.addEventListener('change', toggleAccountNumber);

// Memanggil fungsi saat halaman dimuat untuk set default
toggleAccountNumber();

// Kirim data ke WhatsApp saat form di-submit
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah refresh halaman

    // Ambil data dari form
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const quantity = document.getElementById('quantity').value;
    const model = document.getElementById('model').value;
    const colorZipper = document.getElementById('colorZipper').value;
    const colorSetelan = document.getElementById('colorSetelan').value;

    // Pilih warna yang digunakan berdasarkan model
    let color = '';
    if (model === 'zipper' || model === 'non-zipper') {
        color = colorZipper;
    } else if (model === 'setelan') {
        color = colorSetelan;
    }

    // Total harga
    const totalPrice = prices[model] * quantity;

    // Ambil metode pembayaran dan nomor rekening jika transfer
    const paymentMethod = paymentMethodCOD.checked ? 'COD' : 'Transfer Bank';
    const accountNumber = paymentMethodTransfer.checked ? accountNumberInput.value : '';

    // Format pesan WhatsApp
    const message = `Pesanan Jas Hujan dari Item Hub:%0A` +
                    `Nama: ${name}%0A` +
                    `Nomor Telepon: ${phone}%0A` +
                    `Alamat: ${address}%0A` +
                    `Model: ${model}%0A` +
                    `Warna: ${color}%0A` +
                    `Jumlah: ${quantity}%0A` +
                    `Metode Pembayaran: ${paymentMethod}%0A` +
                    (paymentMethod === 'Transfer Bank' ? `Nomor Rekening: ${accountNumber}%0A` : '') +
                    `Total yang harus dibayar: Rp${totalPrice.toLocaleString('id-ID')}`;

    // Nomor WhatsApp tujuan (ganti dengan nomor Anda)
    const phoneNumber = '62895378233337'; // Ganti dengan nomor WhatsApp tujuan, gunakan kode negara tanpa tanda "+"
    
    // Buat URL WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Redirect pengguna ke WhatsApp
    window.open(whatsappUrl, '_blank');
});
