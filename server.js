const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const dataFile = path.resolve(__dirname, 'data_peminjaman.txt');

// FUNGSI KUNCI: Membuat lebar kolom tetap agar lurus sejajar (Monospace)
const pad = (str, len) => {
    let s = (str || "").toString().toUpperCase();
    if (s.length > len) return s.substring(0, len);
    return s + " ".repeat(len - s.length);
};

const inisialisasiData = () => {
    if (!fs.existsSync(dataFile) || fs.readFileSync(dataFile, 'utf8').trim() === "") {
        const h = pad("PEMINJAM", 15) + " | " + pad("JUDUL BUKU", 20) + " | " + pad("NO. BUKU", 12) + " | " + pad("ID BUKU", 8) + " | " + pad("PENERBIT", 12) + " | " + pad("TAHUN", 10) + " | " + "KURIKULUM\n";
        const l = "-".repeat(105) + "\n";
        fs.writeFileSync(dataFile, h + l, 'utf8');
    }
};

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/halaman-cari', (req, res) => res.sendFile(path.join(__dirname, 'cari.html')));

app.get('/data', (req, res) => {
    inisialisasiData();
    res.setHeader('Content-Type', 'text/plain');
    res.send(fs.readFileSync(dataFile, 'utf8'));
});

app.post('/pinjam', (req, res) => {
    inisialisasiData();
    const d = req.body;
    const baris = pad(d.nama, 15) + " | " + pad(d.buku, 20) + " | " + pad(d.no_buku, 12) + " | " + pad(d.id_buku, 8) + " | " + pad(d.penerbit, 12) + " | " + pad(d.tahun, 10) + " | " + (d.kurikulum || "").toUpperCase() + "\n";
    fs.appendFileSync(dataFile, baris);
    res.redirect('/');
});

app.get('/cari', (req, res) => {
    const q = (req.query.q || '').toUpperCase();
    inisialisasiData();
    const content = fs.readFileSync(dataFile, 'utf8');
    const lines = content.split('\n');
    const header = lines.slice(0, 2).join('\n');
    
    const results = lines.filter(l => l.includes('|') && l.toUpperCase().includes(q) && !l.includes('PEMINJAM'));
    const hasil = results.length > 0 ? header + "\n" + results.join('\n') : "DATA TIDAK DITEMUKAN.";

    res.send(`
        <body style="background:#1a1a2f; color:white; font-family:sans-serif; display:flex; justify-content:center; padding:20px;">
            <div style="width:100%; max-width:950px; text-align:center;">
                <h2 style="color:#00d4ff;">🔍 HASIL PENCARIAN</h2>
                <div style="background:#000; padding:15px; border-radius:10px; border:1px solid #333; overflow-x:auto; text-align:left;">
                    <pre style="color:#00ff00; font-family:'Courier New', monospace; font-size:12px; margin:0; white-space:pre;">${hasil}</pre>
                </div>
                <br>
                <a href="/" style="color:#00d4ff; text-decoration:none; font-weight:bold;">← KEMBALI KE BERANDA</a>
            </div>
        </body>
    `);
});

app.listen(port, "0.0.0.0", () => console.log("Server Aktif!"));
