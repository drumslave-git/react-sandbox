/* eslint-disable consistent-return */
import axios from 'axios';
import user from '../user';
import notify from '../notify';
import event from '../event';

class ApiRedmine {
    static isLoggedIn() {
        const auth = user.getAuth();
        if (!auth.username || !auth.username) {
            // notify.error('not authorized');
            return null;
        }
        return auth;
    }

    static get(url, params = null) {
        return new Promise((resolve, reject) => {
            event.emit('beforeRequest');
            const auth = ApiRedmine.isLoggedIn();
            if (auth === null) {
                event.emit('afterRequest');
                const error = new Error('not authorized');
                return reject(error);
            }
            let param = '';
            if (params !== null) {
                param = [];
                Object.keys(params).forEach((key) => {
                    param.push(`${key}=${params[key]}`);
                });
                param = `?${param.join('&')}`;
            }
            axios.get(`/api/${url}.json${param}`, {
                auth,
            }).then(({ data, status }) => {
                // notify.success(resp.status);
                event.emit('afterRequest');
                if (status === 200) {
                    return resolve(data);
                }
                notify.error(status);
                return reject(new Error(status));
            }).catch((error) => {
                event.emit('afterRequest');
                notify.error(error.message);
                return reject(error);
            });
        });
    }

    static getRedmineUser() {
        return ApiRedmine.get('users/current');
    }
}

export default ApiRedmine;
