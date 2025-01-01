import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Ganti DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
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