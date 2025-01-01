import express from "express";
import dotenv from 'dotenv';
import user_route from './routes/user.route.js';
import motivasi_route from './routes/motivasi.route.js';
import motivasi_komentar_route from './routes/motivasi.komentar.route.js';
import sequelize from "./db.js";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase/config.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

export const firebaseApp = initializeApp(firebaseConfig);

// Fungsi untuk mencoba koneksi ke database dengan retry
const connectToDatabase = async (maxRetries = 5, retryInterval = 5000) => {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      await sequelize.authenticate();
      console.log('Database connected successfully');
      return;
    } catch (error) {
      attempts += 1;
      console.error(`Unable to connect to the database. Attempt ${attempts}/${maxRetries}:`, error.message);
      if (attempts < maxRetries) {
        console.log(`Retrying in ${retryInterval / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, retryInterval)); // Tunggu sebelum mencoba lagi
      } else {
        console.error('Max retries reached. Exiting...');
        process.exit(1); // Keluar jika sudah mencapai batas percobaan
      }
    }
  }
};

const startServer = async () => {
  // Menunggu koneksi ke database berhasil
  await connectToDatabase();

  const paksa = false;
  console.log('Database synchronized');
  await sequelize.sync({ force: paksa });

  app.use('/api/user', user_route);
  app.use('/api/motivasi', motivasi_route);
  app.use('/api/motivasi/komentar', motivasi_komentar_route);
    
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
};

startServer();