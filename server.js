const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const dataFile = path.resolve(__dirname, 'data_peminjaman.txt');

// --- FUNGSI PENYELARAS KOLOM (Agar Lurus Sempurna) ---
const pad = (str, len) => {
    let s = (str || "").toString().toUpperCase();
    if (s.length > len) return s.substring(0, len);
    return s + " ".repeat(len - s.length);
};

const inisialisasiData = () => {
    if (!fs.existsSync(dataFile) || fs.readFileSync(dataFile, 'utf8').trim() === "") {
        const h = pad("PEMINJAM", 15) + " | " + pad("JUDUL BUKU", 20) + " | " + pad("NO. BUKU", 12) + " | " + pad("ID BUKU", 8) + " | " + pad("PENERBIT", 12) + " | " + pad("TAHUN", 10) + " | " + "KURIKULUM\n";
        const l = "-".repeat(110) + "\n";
        fs.writeFileSync(dataFile, h + l, 'utf8');
    }
};

// --- TEMPLATE UI (Sesuai Gambar 1 & Gambar 2) ---
const templateHasil = (judul, data) => `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                background: #1a1a2f; 
                color: white; 
                font-family: sans-serif; 
                display: flex; 
                flex-direction: column;
                align-items: center;
                padding: 0; 
                margin: 0; 
            }
            /* Header Biru Sesuai Gambar */
            .header-blue {
                width: 100%;
                background: #16162a;
                padding: 18px 0;
                text-align: center;
                border-bottom: 2px solid #00d4ff;
                margin-bottom: 25px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.4);
            }
            .header-blue h2 {
                color: #00d4ff;
                margin: 0;
                font-size: 16px;
                text-transform: uppercase;
                letter-spacing: 2px;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
            }
            /* Kontainer Box Hitam */
            .scroll-box { 
                width: 95%;
                max-width: 1100px;
                background: #000; 
                padding: 15px; 
                border-radius: 10px; 
                border: 1px solid #333; 
                overflow-x: auto; /* Agar bisa di-scroll ke samping */
                text-align: left; 
                box-sizing: border-box;
            }
            /* Teks Hijau Monospace */
            pre { 
                color: #00ff00; 
                font-family: 'Courier New', monospace; 
                font-size: 11px; 
                margin: 0; 
                white-space: pre; 
                line-height: 1.6;
                display: inline-block;
                min-width: 980px; /* Paksa lebar agar semua kolom muncul di HP */
            }
            /* Tombol Kembali di Tengah Bawah */
            .btn-container {
                margin: 30px 0;
            }
            .btn-back { 
                color: #ffffff; 
                text-decoration: none; 
                font-size: 12px; 
                font-weight: bold;
                text-transform: uppercase;
                opacity: 0.7;
                transition: 0.3s;
            }
            .btn-back:hover { opacity: 1; color: #00d4ff; }
        </style>
    </head>
    <body>
        <div class="header-blue">
            <h2>🔍 ${judul}</h2>
        </div>
        
        <div class="scroll-box">
            <pre>${data}</pre>
        </div>

        <div class="btn-container">
            <a href="/" class="btn-back">← KEMBALI</a>
        </div>
    </body>
    </html>
`;

// --- ROUTES ---

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/halaman-cari', (req, res) => res.sendFile(path.join(__dirname, 'cari.html')));

// Tampilan LIHAT DATA (Gambar 1)
app.get('/cek-data', (req, res) => {
    inisialisasiData();
    const content = fs.readFileSync(dataFile, 'utf8');
    res.send(templateHasil("DATABASE PEMINJAMAN", content));
});

// Preview data mentah untuk halaman utama
app.get('/data-raw', (req, res) => {
    inisialisasiData();
    res.setHeader('Content-Type', 'text/plain');
    res.send(fs.readFileSync(dataFile, 'utf8'));
});

// Simpan Data
app.post('/pinjam', (req, res) => {
    inisialisasiData();
    const d = req.body;
    const baris = pad(d.nama, 15) + " | " + pad(d.buku, 20) + " | " + pad(d.no_buku, 12) + " | " + pad(d.id_buku, 8) + " | " + pad(d.penerbit, 12) + " | " + pad(d.tahun, 10) + " | " + (d.kurikulum || "").toUpperCase() + "\n";
    fs.appendFileSync(dataFile, baris);
    res.redirect('/');
});

// Tampilan HASIL PENCARIAN (Gambar 2)
app.get('/cari', (req, res) => {
    const q = (req.query.q || '').toUpperCase();
    inisialisasiData();
    const lines = fs.readFileSync(dataFile, 'utf8').split('\n');
    const header = lines.slice(0, 2).join('\n');
    const results = lines.filter(l => l.includes('|') && l.toUpperCase().includes(q) && !l.includes('PEMINJAM'));
    
    const hasilFinal = results.length > 0 ? header + "\n" + results.join('\n') : "DATA TIDAK DITEMUKAN.";
    res.send(templateHasil("HASIL PENCARIAN", hasilFinal));
});

app.listen(port, "0.0.0.0", () => console.log("Server Aktif..."));
