const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// Halaman Utama (Tampilan Persis Fotomu)
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Azril Perpus Panel</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #1a1a2f, #2d1d44); color: white; padding: 20px; margin: 0; }
        .container { max-width: 500px; margin: auto; background: rgba(255,255,255,0.1); backdrop-filter: blur(15px); padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); }
        h2 { text-align: center; color: #00c6ff; display: flex; align-items: center; justify-content: center; gap: 10px; text-transform: uppercase; letter-spacing: 1px; }
        label { font-size: 12px; color: #aaa; display: block; margin-top: 10px; margin-left: 5px; }
        input { width: 100%; padding: 12px; margin: 5px 0; border-radius: 10px; border: none; background: rgba(255,255,255,0.05); color: white; box-sizing: border-box; outline: none; }
        button { width: 100%; padding: 15px; border-radius: 10px; border: none; background: #2ecc71; color: white; font-weight: bold; cursor: pointer; margin-top: 25px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-cek { background: rgba(255,255,255,0.1); margin-top: 10px; text-decoration: none; color: #aaa; font-size: 12px; display: block; text-align: center; padding: 10px; border-radius: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h2><svg width="24" height="24" viewBox="0 0 24 24" fill="#00c6ff"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg> INPUT DATA PEMINJAMAN</h2>
        <form action="/tambah" method="POST">
            <label>Nama Peminjam</label><input type="text" name="namaPeminjam" required>
            <label>Judul Buku</label><input type="text" name="judulBuku" required>
            <label>Nomor Buku</label><input type="text" name="nomorBuku">
            <label>ID Buku</label><input type="text" name="idBuku">
            <label>Penerbit</label><input type="text" name="penerbit">
            <label>Tahun Terbit</label><input type="text" name="tahunTerbit">
            <label>Kurikulum</label><input type="text" name="kurikulum">
            <button type="submit">💾 SIMPAN DATA</button>
        </form>
        <a href="/cek-data" class="btn-cek">🔍 Klik di sini untuk lihat data yang sudah masuk</a>
    </div>
</body>
</html>
    `);
});

// Halaman Rahasia untuk melihat isi file .txt
app.get('/cek-data', (req, res) => {
    if (fs.existsSync('data_peminjaman.txt')) {
        const data = fs.readFileSync('data_peminjaman.txt', 'utf8');
        res.send(`<body style="background:#1a1a2f;color:#00ff00;padding:20px;"><pre style="font-family:monospace;">${data}</pre><br><a href="/" style="color:white;">KEMBALI</a></body>`);
    } else {
        res.send("<body style='background:#1a1a2f;color:white;padding:20px;'>Belum ada data. <a href='/'>Kembali</a></body>");
    }
});

app.post('/tambah', (req, res) => {
    const d = req.body;
    // Format tetap rapi dan lurus untuk GitHub
    const baris = `${(d.namaPeminjam || '').padEnd(14)} | ${(d.judulBuku || '').padEnd(20)} | ${(d.nomorBuku || '').padEnd(8)} | ${(d.idBuku || '').padEnd(7)} | ${d.penerbit || ''}\n`;
    fs.appendFileSync('data_peminjaman.txt', baris);
    res.redirect('/cek-data'); // Langsung tunjukkan data setelah simpan
});

app.listen(port, "0.0.0.0", () => {
    console.log("Server aktif di port " + port);
});
