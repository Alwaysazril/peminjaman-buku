const express = require('express');
const fs = require('fs'); // Perbaikan: tadinya 'fa' sekarang sudah 'fs'
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const dataFile = path.resolve(__dirname, 'data_peminjaman.txt');

// Fungsi inisialisasi agar database punya header yang rapi
const inisialisasiData = () => {
    if (!fs.existsSync(dataFile)) {
        const header = "PEMINJAM       | JUDUL BUKU           | NO. BUKU   | ID BUKU | PENERBIT   | TAHUN     | KURIKULUM\n" +
                       "----------------------------------------------------------------------------------------------------\n";
        fs.writeFileSync(dataFile, header, 'utf8');
    }
};

// --- HALAMAN UTAMA ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- AMBIL DATA (Untuk tabel di bawah form) ---
app.get('/data', (req, res) => {
    inisialisasiData();
    const content = fs.readFileSync(dataFile, 'utf8');
    res.send(content);
});

// --- SIMPAN DATA (Sesuai dengan name="" di index.html) ---
app.post('/pinjam', (req, res) => {
    inisialisasiData();
    const d = req.body;
    
    // Padding agar kolom tetap lurus sejajar
    const nama = (d.nama || '').toUpperCase().substring(0, 14).padEnd(14);
    const buku = (d.buku || '').toUpperCase().substring(0, 20).padEnd(20);
    const no   = (d.no_buku || '').substring(0, 10).padEnd(10);
    const id   = (d.id_buku || '').substring(0, 7).padEnd(7);
    const pen  = (d.penerbit || '').toUpperCase().substring(0, 10).padEnd(10);
    const thn  = (d.tahun || '').substring(0, 9).padEnd(9);
    const kur  = (d.kurikulum || '').toUpperCase();

    const baris = `${nama} | ${buku} | ${no} | ${id} | ${pen} | ${thn} | ${kur}\n`;
    fs.appendFileSync(dataFile, baris);
    res.redirect('/');
});

// --- FITUR CARI ---
app.get('/cari', (req, res) => {
    const query = (req.query.q || '').toUpperCase();
    inisialisasiData();
    const content = fs.readFileSync(dataFile, 'utf8');
    const lines = content.split('\n');
    const header = lines.slice(0, 2).join('\n');
    const filtered = lines.slice(2).filter(l => l.includes(query) && l.trim() !== "");
    const hasil = filtered.length > 0 ? header + "\n" + filtered.join('\n') : "Data tidak ditemukan.";
    
    res.send(`<body style="background:#1a1a2f; color:#00ff00; padding:20px; font-family:monospace;">
        <h2>🔍 Hasil Cari: "${query}"</h2>
        <pre>${hasil}</pre>
        <hr><a href="/" style="color:white; text-decoration:none; background:#444; padding:10px; border-radius:5px;">🔙 KEMBALI</a>
    </body>`);
});

// --- FITUR CEK DATA ---
app.get('/cek-data', (req, res) => {
    inisialisasiData();
    const log = fs.readFileSync(dataFile, 'utf8');
    res.send(`<body style="background:#1a1a2f; color:#00ff00; padding:15px; font-family:monospace;"><pre>${log}</pre><hr><a href="/" style="color:white; text-decoration:none; background:#444; padding:10px; border-radius:5px;">🔙 KEMBALI</a></body>`);
});

app.listen(port, "0.0.0.0", () => {
    console.log("Server Online di Port " + port);
});
