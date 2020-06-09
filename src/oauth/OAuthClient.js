import request from "superagent";

export default class OAuthClient {
    listeners = {};
    authenticated = false;

    constructor(options) {
        [
            'clientId',
            'clientSecret',
            'baseUrl',
        ].forEach(k => {
            if (!options[k]) {
                throw new Error(`Missing mandatory options key "${k}"`);
            }
        });

        this.options = options;

        if (!this.options.storage) {
            this.options.storage = sessionStorage;
        }
    }

    hasAccessToken() {
        return null !== this.getAccessToken();
    }

    getAccessToken() {
        return this.options.storage.getItem('ACCESS_TOKEN') || null;
    }

    setAccessToken(accessToken) {
        return this.options.storage.setItem('ACCESS_TOKEN', accessToken);
    }

    setUsername(username) {
        return this.options.storage.setItem('USERNAME', username);
    }

    getUsername() {
        return this.options.storage.getItem('USERNAME') || null;
    }

    isAuthenticated() {
        return this.authenticated;
    }

    logout() {
        this.authenticated = false;
        this.setAccessToken('');
        this.setUsername('');
        this.triggerEvent('logout');
    }

    registerListener(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    async triggerEvent(type, event = {}) {
        event.type = type;

        return Promise.all(this.listeners[type].map(func => func(event)).filter(f => !!f));
    }

    async authenticate(uri) {
        if (!this.hasAccessToken()) {
            return;
        }

        return new Promise((resolve, reject) => {
            request
                .get(uri)
                .accept('json')
                .set('Authorization', 'Bearer ' + this.getAccessToken())
                .end((err, res) => {
                    if (!this.isResponseValid(err, res)) {
                        reject(err, res);
                        return;
                    }

                    this.authenticated = true;
                    this.setUsername(res.body.username);
                    this.triggerEvent('authentication', {user: res.body});
                    resolve(res.body);
                });
        });
    }

    getAccessTokenFromAuthCode(code, redirectUri) {
        const {clientId, clientSecret, baseUrl} = this.options;

        return new Promise((resolve, reject) => {
            request
                .post(`${baseUrl}/oauth/v2/token`)
                .accept('json')
                .send({
                    code,
                    grant_type: 'authorization_code',
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectUri,
                })
                .end((err, res) => {
                    if (err) {
                        reject(err, res);
                        return;
                    }

                    this.setAccessToken(res.body.access_token);
                    this.triggerEvent('login');

                    resolve(res);
                });
        });
    }

    async login(username, password) {
        const res = await this.doLogin(username, password);
        await this.triggerEvent('login');

        return res;
    }

    doLogin(username, password) {
        const {clientId, clientSecret, baseUrl} = this.options;

        return new Promise((resolve, reject) => {
            request
                .post(`${baseUrl}/oauth/v2/token`)
                .accept('json')
                .send({
                    username,
                    password,
                    grant_type: 'password',
                    client_id: clientId,
                    client_secret: clientSecret,
                })
                .end((err, res) => {
                    if (err) {
                        reject({err, res});
                        return;
                    }

                    this.setAccessToken(res.body.access_token);

                    resolve(res);
                });
        });
    }

    isResponseValid(err, res) {
        if (err) {
            console.debug(err);
            console.debug(res);
            if (res.statusCode === 401) {
                this.logout();
            }
            return false;
        }

        return true;
    }
}
