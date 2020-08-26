const { Sequelize, DataTypes } = require('sequelize');

const db = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: './database/db.sqlite',
    transactionType: 'IMMEDIATE',
    retry: {
        max: 10,
    }
});

const User = db.define('user', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
    },
    permission: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    accessToken: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
    },
    discriminator: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
    },
    avatarURL: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
    },
    guilds: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
    }
}, {
    timestamps: false,
});

const AuthToken = db.define('tokens', {
    username: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
    },
}, {
    timestamps: false,
});

if (process.argv.includes('--dbInit')) {
    db.sync({ force: true }).then(() => {
        console.log('Database dropped!');
    }).catch((e) => {
        console.log(e);
    }).finally(() => {
        process.exit(0);
    });
} else {
    db.authenticate().catch(console.error);
}

class LocalDB {
    /**
     * 
     * @param {import('../classes/App')} app 
     */
    constructor(app) {
        this.app = app;
        this.User = User;
        this.AuthToken = AuthToken;
        this.db = db;
    }
}

module.exports = LocalDB;