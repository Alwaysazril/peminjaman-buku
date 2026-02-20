const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// Nama file diubah sedikit agar sistem membuat database baru yang bersih
const NAMA_FILE = 'database_perpus.txt';

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
        .btn-cek { display: block; text-align: center; margin-top: 20px; color: #aaa; text-decoration: none; font-size: 12px; }
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
        <a href="/cek-data" class="btn-cek">LIHAT DATA</a>
    </div>
</body>
</html>
    `);
});

app.get('/cek-data', (req, res) => {
    let log = "Belum ada data.";
    if (fs.existsSync(NAMA_FILE)) {
        log = fs.readFileSync(NAMA_FILE, 'utf8');
    }
    res.send(`
        <body style="background:#1a1a2f; color:#00ff00; padding:15px; font-family:monospace;">
            <pre style="white-space:pre; font-size:9px; letter-spacing: 1px;">\${log}</pre>
            <hr style="border:0.5px solid #333; margin:20px 0;">
            <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; display:inline-block;">
                <p style="color:white; font-family:sans-serif; font-size:11px; margin:0 0 10px 0;">Hapus No Baris:</p>
                <form action="/hapus-baris" method="POST" style="display:flex; gap:5px;">
                    <input type="number" name="nomorBaris" style="width:50px; padding:5px;" required>
                    <button type="submit" style="background:#e67e22; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">HAPUS</button>
                </form>
            </div>
            <div style="display:flex; gap:10px; margin-top:20px;">
                <a href="/" style="color:white; text-decoration:none; background:#444; padding:10px; border-radius:5px; font-family:sans-serif; font-size:12px;">⬅ KEMBALI</a>
                <form action="/hapus-semua" method="POST"><button type="submit" style="background:#e74c3c; color:white; border:none; padding:10px; border-radius:5px; cursor:pointer; font-size:12px;">🗑️ HAPUS SEMUA</button></form>
            </div>
        </body>
    `);
});

app.post('/tambah', (req, res) => {
    const d = req.body;
    if (!fs.existsSync(NAMA_FILE)) {
        const h = "ID | PEMINJAM       | JUDUL BUKU           | NO. BUKU   | ID BUKU | PENERBIT   | TAHUN     | KURIKULUM\\n" +
                  "----------------------------------------------------------------------------------------------------";
        fs.writeFileSync(NAMA_FILE, h);
    }
    
    const content = fs.readFileSync(NAMA_FILE, 'utf8').trim();
    const lines = content.split('\\n');
    const currentId = lines.length - 1; 

    const baris = "\\n" + 
                  currentId.toString().padEnd(2) + " | " + 
                  (d.namaPeminjam || '').toUpperCase().padEnd(14) + " | " + 
                  (d.judulBuku || '').toUpperCase().padEnd(20) + " | " + 
                  (d.nomorBuku || '').padEnd(10) + " | " + 
                  (d.idBuku || '').padEnd(7) + " | " + 
                  (d.penerbit || '').toUpperCase().padEnd(10) + " | " + 
                  (d.tahunTerbit || '').padEnd(9) + " | " + 
                  (d.kurikulum || '').toUpperCase();
    
    fs.appendFileSync(NAMA_FILE, baris);
    res.redirect('/cek-data');
});

app.post('/hapus-baris', (req, res) => {
    const no = parseInt(req.body.nomorBaris);
    if (fs.existsSync(NAMA_FILE)) {
        let lines = fs.readFileSync(NAMA_FILE, 'utf8').split('\\n');
        if (no > 0 && lines[no + 1]) {
            lines.splice(no + 1, 1);
            fs.writeFileSync(NAMA_FILE, lines.join('\\n'));
        }
    }
    res.redirect('/cek-data');
});

app.post('/hapus-semua', (req, res) => {
    if (fs.existsSync(NAMA_FILE)) fs.unlinkSync(NAMA_FILE);
    res.redirect('/cek-data');
});

app.listen(port, "0.0.0.0", () => { console.log("ON"); });
