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

db.authenticate().catch(console.error);

const args = process.argv;
args.shift();
args.shift();

const message = args.join(' ');
console.log('> ' + message);

const command = args.shift();

(async function () {
    switch (command) {
        case 'auth': {
            const [action, username, password] = args;
            try {
                switch (action) {
                    case 'list': {
                        const all = await AuthToken.findAll();
                        console.log(all.map((m) => m.toJSON()));
                        break;
                    }
                    case 'create': {
                        if (!username || !password) return console.log('missing parameters <Username> or <Password>');
                        const cur = await AuthToken.findOne({ where: { username } });
                        if (cur) return console.log('user already exist');
                        await AuthToken.create({ username, password });
                        console.log('User created');
                        break;
                    }
                    case 'edit': {
                        if (!username || !password) return console.log('missing parameters <Username> or <Password>');
                        await AuthToken.update({ password }, { where: { username } });
                        console.log('user edited');
                        break;
                    }
                    case 'delete': {
                        if (!username) return console.log('missing parameter <Username>');
                        await AuthToken.destroy({ where: { username } });
                        console.log('User deleted');
                        break;
                    }
                    default: {
                        console.log('invalid arguments');
                    }
                }
            } catch (e) {
                console.log(e);
            }
            break;
        }
        default: {
            console.log('invalid command');
        }
    }
}());