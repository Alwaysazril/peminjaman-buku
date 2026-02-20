const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const dataFile = path.resolve(__dirname, 'data_peminjaman.txt');

// Inisialisasi Header agar lurus dengan data
const inisialisasiData = () => {
    if (!fs.existsSync(dataFile)) {
        const header = "PEMINJAM       | JUDUL BUKU           | NO. BUKU   | ID BUKU | PENERBIT   | TAHUN     | KURIKULUM\n" +
                       "----------------------------------------------------------------------------------------------------\n";
        fs.writeFileSync(dataFile, header, 'utf8');
    }
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Menambahkan rute /data yang diminta oleh fetch di index.html
app.get('/data', (req, res) => {
    inisialisasiData();
    const content = fs.readFileSync(dataFile, 'utf8');
    res.send(content);
});

// Rute /pinjam disesuaikan dengan form action di index.html
app.post('/pinjam', (req, res) => {
    inisialisasiData();
    const d = req.body;

    // Nama variabel (d.nama, d.buku, dll) disesuaikan dengan atribut 'name' di index.html
    const nama      = (d.nama || '').toUpperCase().substring(0, 14).padEnd(14);
    const judul     = (d.buku || '').toUpperCase().substring(0, 20).padEnd(20);
    const noBuku    = (d.no_buku || '').substring(0, 10).padEnd(10);
    const idBuku    = (d.id_buku || '').substring(0, 7).padEnd(7);
    const penerbit  = (d.penerbit || '').toUpperCase().substring(0, 10).padEnd(10);
    const tahun     = (d.tahun || '').substring(0, 9).padEnd(9);
    const kurikulum = (d.kurikulum || '').toUpperCase();

    const baris = `${nama} | ${judul} | ${noBuku} | ${idBuku} | ${penerbit} | ${tahun} | ${kurikulum}\n`;

    fs.appendFileSync(dataFile, baris);
    res.redirect('/'); 
});

app.listen(port, "0.0.0.0", () => {
    console.log("Server Aktif di Port: " + port);
});
