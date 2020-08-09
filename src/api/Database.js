const { EventEmitter } = require('events');
const fetch = require('node-fetch');
const io = require('socket.io-client');

class API extends EventEmitter {
    constructor() {
        super();
        this.uri = process.env.DATABASE_URI;
    }
    connect() {
        this.ws = io(this.uri);
        this.ws.on('raw', (event, payload) => {
            this.emit('raw', event, payload);
        });
        this.ws.on('disconnect', () => {
            this.emit('disconnect');
        });
        this.ws.on('error', (err) => {
            this.emit('error', err);
        })
        this.ws.on('connect_error', (err) => {
            this.emit('connect_error', err);
        });
        this.ws.on('reconnecting', (n) => {
            this.emit('reconnecting', n);
        });
        this.ws.on('reconnect_error', (err) => {
            this.emit('reconnect_error', (err));
        });
        this.ws.on('reconnect_failed', () => {
            this.emit('reconnect_failed');
        });
    }
    /**
     * 
     * @returns {Promise<{any}>}
     * @param {string} path 
     */
    get(path) {
        return new Promise(async (resolve, reject) => {
            const response = await fetch.default(`${this.uri}${path}`).catch(reject);
            if (response.status !== 200) return reject(response);
            const body = await response.json().catch(reject);
            resolve(body);
        });
    }
    /**
     * 
     * @returns {Promise<{any}>}
     * @param {string} path
     * @param {{any}} partial 
     */
    post(path, partial) {
        return new Promise(async (resolve, reject) => {
            const response = await fetch.default(`${this.uri}${path}`, {
                method: 'post',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(partial),
            }).catch(reject);
            if (response.status !== 200) return reject(response);
            const body = await response.json().catch(reject);
            resolve(body);
        });
    }
    /**
     * 
     * @returns {Promise<{any}>}
     * @param {string} path
     */
    delete(path) {
        return new Promise(async (resolve, reject) => {
            const response = await fetch.default(`${this.uri}${path}`, {
                method: 'delete',
            }).catch(reject);
            if (response.status !== 200) return reject(response);
            const body = await response.json().catch(reject);
            resolve(body);
        });
    }
}

module.exports = API;