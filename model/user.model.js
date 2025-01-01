import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const User = sequelize.define('user', {
    iduser: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    nama: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    profesi: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(256),
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    created: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    updated: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    avatar_link: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    timestamps: false, tableName: 'pengguna'
});

export default User;