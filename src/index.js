require('dotenv').config();
const App = require('./classes/App');

(async function () {
    const client = new App({
        domain: process.env.DOMAIN,
        session_secret: process.env.SESSION_SECRET,
    });
    await client.registerRoutes();
    await client.registerEvents();
    client.listen(4200, (port) => {
        client.logger.info(`Web App running on PORT ${port}`);
    })
})();