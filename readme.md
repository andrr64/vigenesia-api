<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!-- [![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Unlicense License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url] -->

<!-- TABLE OF CONTENTS -->
<!-- <details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>
 -->

<!-- ABOUT THE PROJECT -->

## Tentang Proyek

**vigenesia-api** adalah kode server-side yang dirancang untuk mendukung aplikasi Vigenesia App. Proyek ini menggunakan teknologi modern seperti Express.js untuk membangun API yang andal dan efisien, Sequelize sebagai ORM untuk pengelolaan database, dan Firebase untuk penyimpanan avatar pengguna.

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
   git clone https://github.com/andrr64/vigenesia_expressjs.git
   ```
2. Masuk kedalam folder proyek lalau install *package* NPM yang diperlukan menggunakan perintah
   ```sh
   npm install
   ```
3. Set API Firebase di file **./firebase/config.js**
   ```js
   const firebaseConfig = {
     apiKey: process.env.FIREBASE_API_KEY_WEB,
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
    const databaseurl = process.env.DATABASE_URL
    // Ganti menjadi misal
    // const databaseurl = "postgresql://myuser:mypassword@localhost:5432/mydatabase"

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

Kode backend **HANYA BISA DIGUNAKAN** di aplikasi ViGeNesia kelompok kami buat ([disini](https://github.com/andrr64/vigenesia_app)). Jika anda masih menggunakan kode versi lama flutter ViGeNesia dari UBSI maka **ITU TIDAK AKAN COCOK** dengan backend ini. Silahkan buka link app ViGeNesia yang kami sudah buat, gratis.

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
