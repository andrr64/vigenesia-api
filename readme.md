<!-- ABOUT THE PROJECT -->

## Tentang Proyek

Kode server-side yang dirancang untuk mendukung aplikasi Vigenesia+. Proyek ini menggunakan teknologi modern seperti Express.js untuk membangun API yang andal dan efisien, Sequelize sebagai ORM untuk pengelolaan database, dan Firebase untuk penyimpanan avatar pengguna.

### Teknologi yang digunakan

- nodeJS
- expressJS
- Firebase Storage
- sequalize (ORM)

### Fitur
- Memposting motivasi dengan gambar
- Membuat komentar pada sebuah postingan
- Melihat profile pengguna lain
- Mengubah data dan foto profile akun sendiri

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Mari kita Mulai

### Prasyarat

Sebelum menjalankan kode pastikan bahwa aplikasi yang diperlukan sudah **terinstall**. Berikut daftar aplikasi yang diperlukan:

- **node.JS**: versi 22 keatas [klik disini](https://nodejs.org/en)
- **postgreSQL**: versi 16 keatas [klik disini](https://www.postgresql.org/download)
- **npm**: node package manager versi terbaru
- **Proyek Firebase**: Untuk membuatnya silahkan [klik disini](https://console.firebase.google.com/)



### Instalasi

_Dibawah ini merupakan instruksi persiapan hingga aplikasi siap digunakan. Ikuti instruksi dibawah ini dengan tepat dan cermat_

1. *Clone* repositori
   ```sh
   git clone https://github.com/andrr64/vigenesia-server.git
   ```
2. Masuk kedalam folder proyek lalu install *package* yang diperlukan menggunakan perintah
   ```sh
   npm install
   ```
3. Set API Firebase di file **./firebase/config.js**
   ```js
   const firebaseConfig = {
     apiKey: process.env.FIREBASE_API_KEY_WEB(jika menggunakan env) atau ketik langsung disini, contoh: edja8877dsansajdas714h1280ads,
     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
     projectId: process.env.FIREBASE_PROJECT_ID,
     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.FIREBASE_APP_ID_WEB,
     measurementId: process.env.FIREBASE_MEASUREMENT_ID_WEB,
   };
   export default firebaseConfig;
   ```
   Anda bisa membuat file **.env** maupun langsung menulis API di **config.js**. Saran saya tulis API di **.env** karena lebih aman. Jika tidak mengerti tahap ini silahkan tanya ke ahli, teman anda atau menonton video YouTube.
  
4. Ubah konfigurasi URL database pada file **db.js**. Anda bisa menulis URL database di **.env** maupun langsung di **db.js**
   ```js
    import { Sequelize } from 'sequelize';
    import dotenv from 'dotenv';

    dotenv.config();

    // Ganti DATABASE_URL
    const databaseurl = process.env.DATABASE_URL atau bisa di isi langsung dengan alamat database (lihat dibawah)
    // Ganti menjadi misal
    // template --> postgresql://nama_akun:password_akun@localhost:5432/nama_database
    // contoh   --> postgresql://postgres:root@localhost:5432/vigenesia
    // pastikan sudah membuat database 'vigenesia'. Bingung? lihat panduan online tentang cara membuat database di postgresql
   
    const sequelize = new Sequelize(databaseurl, {
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 10, // maksimum koneksi di pool
        min: 0, // minimum koneksi di pool
        acquire: 30000, // waktu maksimal dalam ms untuk mendapatkan koneksi
        idle: 10000 // waktu maksimal dalam ms untuk koneksi tidak digunakan
      }
    });

    export default sequelize;
   ```

5. Silahkan konfigurasi **PORT** pada file **./index.js**
    ```js
    const startServer = async () => {
      // Menunggu koneksi ke database berhasil
      await connectToDatabase();

      // paksa=true -> menghapus semua data dan inisialisasi tabel ulang

      const paksa = false;
      console.log('Database synchronized');
      await sequelize.sync({ force: paksa });

      app.use('/api/user', user_route);
      app.use('/api/motivasi', motivasi_route);
      app.use('/api/motivasi/komentar', motivasi_komentar_route);
      
      // EDIT PORT DISINI
      const PORT = process.env.PORT;
      app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
      });
    };
    ```


6. Pastikan tidak ada masalah pada tahap 1 hingga 5. Jika semua sudah dilakukan, selanjutnya jalankan server dengan menggunakan perintah
   ```pwsh
   npm run start
   ```


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Penggunaan

Kode server ini **HANYA BISA DIGUNAKAN** di aplikasi ViGeNesia+ kelompok kami buat ([disini](https://github.com/andrr64/vigenesia-ubsi)). Jika anda masih menggunakan kode versi lama flutter ViGeNesia dari UBSI maka **AKAN TERJADI KESALAHAN**. Silahkan buka link app ViGeNesi+ yang kami sudah buat, gratis.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ## Kontributor
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Top contributors:

<a href="https://github.com/othneildrew/Best-README-Template/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=othneildrew/Best-README-Template" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

LICENSE -->
## License

Didistribusikan dibawah lisensi Apache 2.0. Lihat `LICENSE` untuk informasi lebih lanjut;.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Kontak

Derza Andreas - [LinkedIn](https://www.linkedin.com/in/derza-andreas-940376216/) - andrrbussines15@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>
