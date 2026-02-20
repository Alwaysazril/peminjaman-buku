const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const dataFile = path.resolve(__dirname, 'data_peminjaman.txt');

const inisialisasiData = () => {
    if (!fs.existsSync(dataFile)) {
        const header = "PEMINJAM       | JUDUL BUKU           | NO. BUKU   | ID BUKU | PENERBIT   | TAHUN     | KURIKULUM\n" +
                       "----------------------------------------------------------------------------------------------------\n";
        fs.writeFileSync(dataFile, header, 'utf8');
    }
};

// HALAMAN UTAMA
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// FITUR AMBIL DATA (Untuk tabel di index.html)
app.get('/data', (req, res) => {
    inisialisasiData();
    const content = fs.readFileSync(dataFile, 'utf8');
    res.send(content);
});

// FITUR SIMPAN (Sudah disesuaikan dengan index.html Anda)
app.post('/pinjam', (req, res) => {
    inisialisasiData();
    const d = req.body;
    
    // Mengambil data sesuai atribut 'name' di index.html
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

// FITUR CARI (Mempertahankan fitur lama Anda)
app.get('/cari', (req, res) => {
    const query = (req.query.q || '').toUpperCase();
    inisialisasiData();
    const content = fs.readFileSync(dataFile, 'utf8');
    const lines = content.split('\n');
    const header = lines.slice(0, 2).join('\n');
    const results = lines.slice(2).filter(l => l.includes(query) && l.trim() !== "");
    const hasil = results.length > 0 ? header + "\n" + results.join('\n') : "Data tidak ditemukan.";
    
    res.send(`<body style="background:#1a1a2f; color:#00ff00; padding:20px; font-family:monospace;">
        <h3>Hasil Pencarian: "${query}"</h3>
        <pre>${hasil}</pre>
        <hr><a href="/" style="color:white;">Kembali</a>
    </body>`);
});

// FITUR CEK DATA FULL
app.get('/cek-data', (req, res) => {
    inisialisasiData();
    const log = fs.readFileSync(dataFile, 'utf8');
    res.send(`<body style="background:#1a1a2f; color:#00ff00; padding:15px; font-family:monospace;"><pre>${log}</pre><hr><a href="/" style="color:white;">Kembali</a></body>`);
});

app.listen(port, "0.0.0.0", () => console.log("Server Aktif!"));
