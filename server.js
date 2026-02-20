const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

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
        h2 { text-align: center; background: linear-gradient(to right, #00c6ff, #0072ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        label { font-size: 12px; color: #aaa; display: block; margin-top: 10px; }
        input { width: 100%; padding: 12px; margin: 5px 0; border-radius: 10px; border: none; background: rgba(255,255,255,0.05); color: white; box-sizing: border-box; outline: none; }
        button { width: 100%; padding: 15px; border-radius: 10px; border: none; background: linear-gradient(to right, #2ecc71, #27ae60); color: white; font-weight: bold; cursor: pointer; margin-top: 25px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>📚 INPUT DATA PEMINJAMAN</h2>
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
    </div>
</body>
</html>
    `);
});

app.post('/tambah', (req, res) => {
    const d = req.body;
    // BAGIAN INI SUDAH DIPERBAIKI PAKAI BACKTICK AGAR TIDAK CRASH
    const baris = `${(d.namaPeminjam || '').padEnd(14)} | ${(d.judulBuku || '').padEnd(20)} | ${(d.nomorBuku || '').padEnd(8)} | ${(d.idBuku || '').padEnd(7)} | ${d.penerbit || ''}\n`;
    
    fs.appendFileSync('data_peminjaman.txt', baris);
    res.redirect('/');
});

app.listen(port, "0.0.0.0", () => {
    console.log("Server Running on Port: " + port);
});
