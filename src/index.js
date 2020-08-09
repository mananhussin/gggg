require('dotenv').config();
const App = require('./classes/App');

(async function () {
    const client = new App();
    await client.register();
    client.listen(() => {
        client.logger.info(`Web Application now running!`);
    })
})();