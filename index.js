import express from "express";
import dotenv from 'dotenv';
import user_route from './routes/user.route.js';
import motivasi_route from './routes/motivasi.route.js';
import motivasi_komentar_route from './routes/motivasi.komentar.route.js';
import sequelize from "./db.js";

import os from 'os'; // Perbaiki impor os di sini

const getLocalIp = () => {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    for (const details of networkInterfaces[interfaceName]) {
      if (details.family === 'IPv4' && !details.internal) {
        console.log(`Local IP: ${details.address}`);
        return details.address;
      }
    }
  }
};

dotenv.config();

const app = express();

app.use(express.json());

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
  await connectToDatabase();

  const paksa = false;
  console.log('Database synchronized');
  await sequelize.sync({ force: paksa });

  app.use('/api/user', user_route);
  app.use('/api/motivasi', motivasi_route);
  app.use('/api/motivasi/komentar', motivasi_komentar_route);
  
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://${getLocalIp()}:${PORT}`);
  });
};

startServer();