import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './user.model.js';

const Motivasi = sequelize.define('Motivasi', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    iduser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'iduser'
      }
    },
    link_gambar: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    isi_motivasi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tanggal_input: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tanggal_update: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    timestamps: false,
    tableName: 'motivasi'
  });

export default Motivasi;