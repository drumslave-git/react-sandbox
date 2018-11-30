class Storage {
    store = {};

    constructor() {
        this.store = localStorage.getItem('store');
        if (this.store !== null) {
            this.store = JSON.parse(this.store);
        } else {
            this.store = {};
        }
    }

    get(key) {
        if (key) {
            return this.store[key];
        }
        return this.store;
    }

    set(key, value) {
        this.store[key] = value;

        localStorage.setItem('store', JSON.stringify(this.store));
    }
}

const storage = new Storage();

export default storage;
