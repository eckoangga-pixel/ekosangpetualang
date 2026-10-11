PETUALANGAN ILMU — proyek game edukasi SD
================================================
Isi:
- index.html : halaman menu dan elemen antarmuka
- style.css  : desain responsif, tema petualangan terinspirasi gambar referensi
- game.js    : logika permainan, dunia 3D Three.js, kontrol, soal, skor, suara narasi
- assets/menu-reference.png : gambar referensi menu yang diberikan

Cara menjalankan:
1. Ekstrak ZIP ke sebuah folder.
2. Buka folder di Visual Studio Code.
3. Disarankan pasang ekstensi "Live Server".
4. Klik kanan index.html > Open with Live Server.
5. Pastikan perangkat terhubung ke internet karena Three.js dan font dimuat dari CDN.
6. Untuk laptop: WASD / tombol panah bergerak, SPACE melompat, E atau ENTER untuk tantangan.
7. Untuk HP/PID: gunakan tombol layar ◀ ▶ ⬆ 🎯.
8. Pilih kelas, mapel, mode, dan kesulitan pada menu awal.

Catatan:
- Browser game menggunakan JavaScript (bukan Java). Java adalah bahasa berbeda dan tidak berjalan langsung di halaman HTML.
- Ini adalah prototipe playable yang dapat dikembangkan. Database soal awal berisi contoh soal untuk 8 mapel dan sistem kelas dipakai untuk mengatur profil; bank soal perlu diperluas/diverifikasi per kelas agar seluruh 10 level benar-benar memiliki soal spesifik kelas 1–6.
- Mode duo/kelompok menyediakan nama dan papan skor dasar; giliran/penilaian kolaboratif dapat diperluas pada pengembangan berikutnya.
- Progres hasil akhir disimpan secara lokal di browser perangkat menggunakan localStorage.
