import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import Motivasi from "./motivasi.model.js";
import User from "./user.model.js";

const KomentarMotivasi = sequelize.define('motivasi.komentar', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idmotivasi: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Motivasi,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    iduser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'iduser'
        },
        onDelete: 'CASCADE'
    },
    komentar: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {timestamps: true, tableName: "motivasi.komentar"});

KomentarMotivasi.belongsTo(User, {
    foreignKey: 'iduser',
    as: 'user'
});

export default KomentarMotivasi;