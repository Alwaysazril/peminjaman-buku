const express = require('express');
const fs = require('fs');
const path = require('path'); // Tambahan modul path agar tidak error di website
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// Menentukan lokasi file agar sinkron antara Termux dan Railway
const filePath = path.join(__dirname, 'data_peminjaman.txt');

// --- HALAMAN UTAMA ---
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Azril Perpus</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: sans-serif; background: #1a1a2f; color: white; padding: 20px; margin: 0; }
        .container { max-width: 400px; margin: auto; background: rgba(255,255,255,0.1); padding: 25px; border-radius: 20px; }
        h2 { text-align: center; color: #00c6ff; }
        input { width: 100%; padding: 12px; margin: 6px 0; border-radius: 8px; border: none; box-sizing: border-box; }
        button { width: 100%; padding: 15px; background: #2ecc71; color: white; border: none; border-radius: 10px; font-weight: bold; margin-top: 15px; cursor: pointer; }
        .menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; }
        .btn-nav { text-align: center; color: #fff; text-decoration: none; font-size: 12px; background: #444; padding: 10px; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>📚 INPUT DATA</h2>
        <form action="/tambah" method="POST">
            <input type="text" name="namaPeminjam" placeholder="Nama Peminjam" required>
            <input type="text" name="judulBuku" placeholder="Judul Buku" required>
            <input type="text" name="nomorBuku" placeholder="Nomor Buku">
            <input type="text" name="idBuku" placeholder="ID Buku">
            <input type="text" name="penerbit" placeholder="Penerbit">
            <input type="text" name="tahunTerbit" placeholder="Tahun Terbit">
            <input type="text" name="kurikulum" placeholder="Kurikulum">
            <button type="submit">SIMPAN DATA</button>
        </form>
        <div class="menu-grid">
            <a href="/cek-data" class="btn-nav">📋 LIHAT DATA</a>
            <a href="/cari" class="btn-nav">🔍 CARI DATA</a>
        </div>
    </div>
</body>
</html>
    `);
});

// --- FITUR PENCARIAN ---
app.get('/cari', (req, res) => {
    const query = (req.query.q || '').toUpperCase();
    let hasil = "Data tidak ditemukan.";
    
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        const header = lines.slice(0, 2).join('\n'); 
        const matches = lines.slice(2).filter(line => line.includes(query) && line.trim() !== "");
        if (matches.length > 0) hasil = header + "\n" + matches.join('\n');
    }

    res.send(`
        <body style="background:#1a1a2f; color:white; padding:20px; font-family:sans-serif;">
            <div style="max-width:400px; margin:auto;">
                <h2 style="color:#00c6ff; text-align:center;">🔍 HASIL CARI</h2>
                <form action="/cari" method="GET">
                    <input type="text" name="q" placeholder="Cari Nama/Judul..." style="width:100%; padding:10px; margin-bottom:10px;">
                    <button style="width:100%; padding:10px; background:#00c6ff; border:none; color:white;">CARI LAGI</button>
                </form>
                <pre style="background:#000; color:#00ff00; padding:10px; font-size:10px; overflow:auto;">${hasil}</pre>
                <a href="/" style="display:block; text-align:center; margin-top:20px; color:#aaa; text-decoration:none;">⬅ KEMBALI</a>
            </div>
        </body>
    `);
});

// --- LIHAT DATA ---
app.get('/cek-data', (req, res) => {
    let log = "Belum ada data.";
    if (fs.existsSync(filePath)) log = fs.readFileSync(filePath, 'utf8');
    res.send(`<body style="background:#1a1a2f; color:#00ff00; padding:15px; font-family:monospace;"><pre style="font-size:9px;">${log}</pre><hr><a href="/" style="color:white; text-decoration:none; background:#444; padding:10px; border-radius:5px;">⬅ KEMBALI</a></body>`);
});

// --- TAMBAH DATA ---
app.post('/tambah', (req, res) => {
    const d = req.body;
    if (!fs.existsSync(filePath)) {
        const h = "PEMINJAM       | JUDUL BUKU           | NO. BUKU   | ID BUKU | PENERBIT   | TAHUN     | KURIKULUM\n----------------------------------------------------------------------------------------------------\n";
        fs.writeFileSync(filePath, h);
    }
    const baris = (d.namaPeminjam || '').toUpperCase().padEnd(14) + " | " + (d.judulBuku || '').toUpperCase().padEnd(20) + " | " + (d.nomorBuku || '').padEnd(10) + " | " + (d.idBuku || '').padEnd(7) + " | " + (d.penerbit || '').toUpperCase().padEnd(10) + " | " + (d.tahunTerbit || '').padEnd(9) + " | " + (d.kurikulum || '').toUpperCase() + "\n";
    fs.appendFileSync(filePath, baris);
    res.redirect('/cek-data');
});

// --- TAMPILAN TERMINAL (TETAP SAMA SEPERTI GAMBAR) ---
const rainbow = ["\x1b[38;2;255;0;0m", "\x1b[38;2;255;165;0m", "\x1b[38;2;255;255;0m", "\x1b[38;2;0;255;0m", "\x1b[38;2;0;255;255m", "\x1b[38;2;0;191;255m", "\x1b[38;2;255;0;255m"];
let idx = 0;

function runTerminal() {
    if (process.env.RAILWAY_STATIC_URL) return; // Supaya tidak error di Railway
    const cyan = "\x1b[38;2;0;255;255m", reset = "\x1b[0m", glow = rainbow[idx];
    process.stdout.write('\x1Bc');
    console.log(`${cyan}┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${reset}`);
    console.log(`${cyan}┃${reset}  ${glow}✨ SERVER IS RUNNING ALWAYS AZRIL ✨${reset}               ${cyan}┃${reset}`);
    console.log(`${cyan}┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫${reset}`);
    console.log(`${cyan}┃${reset}  🚀 Status  : ${glow}Online & Active${reset}                   ${cyan}┃${reset}`);
    console.log(`${cyan}┃${reset}  🌍 Link    : ${cyan}http://localhost:${port}${reset}          ${cyan}┃${reset}`);
    console.log(`${cyan}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${reset}`);
    idx = (idx + 1) % rainbow.length;
}

app.listen(port, "0.0.0.0", () => {
    if (!process.env.RAILWAY_STATIC_URL) setInterval(runTerminal, 500);
    else console.log("Server Aktif di Railway!"); // Log sederhana untuk Railway
});
