/* eslint-disable no-cycle */
import storage from '../storage';
import apiRedmine from '../api/apiRedmine';
import event from '../event';

class User {
    firstname = '';

    lastname = '';

    username = '';

    password = '';

    id = '';

    constructor() {
        const auth = storage.get('auth') || {};
        this.login(auth.username, auth.password);
    }

    login(username, password) {
        this.username = username;
        this.password = password;
        if (this.username && this.password) {
            apiRedmine.getRedmineUser().then((data) => {
                this.firstname = data.user.firstname;
                this.lastname = data.user.lastname;
                this.id = data.user.id;
                event.emit('loggedIn');
            });
        }
    }

    getAuth() {
        return {
            username: this.username,
            password: this.password,
        };
    }
}

const user = new User();
export default user;
