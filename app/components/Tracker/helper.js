/* eslint-disable import/prefer-default-export */
const intl = new Intl.DateTimeFormat();
export function getConfig(key = null) {
    let config = localStorage.getItem('config');
    if (config) {
        config = JSON.parse(config);
    } else {
        return {};
    }
    if (key !== null) {
        return config[key];
    // eslint-disable-next-line no-else-return
    } else {
        return config;
    }
}
export function saveConfig(config) {
    const prevConfig = getConfig();
    localStorage.setItem('config', JSON.stringify({ ...prevConfig, ...config }));
}

export function formatDT(date, requiredParts = ['year', 'month', 'day']) {
    const parts = intl.formatToParts(date);
    const result = [];
    for (let i = 0; i < requiredParts.length; i += 1) {
        const rp = requiredParts[i];
        for (let j = 0; j < parts.length; j += 1) {
            const p = parts[j];
            if (p.type === rp) {
                result.push(p.value);
                break;
            }
        }
    }
    return result.join('-');
}

export function convertTime(decimalTimeString, string = true) {
    const decimalTime = Number(decimalTimeString);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(decimalTime)) {
        return decimalTimeString;
    }
    // eslint-disable-next-line radix
    const hrs = parseInt(decimalTime);
    let min = Math.round((decimalTime - hrs) * 60);
    if (string) {
        if (min.toString().length === 1) {
            min = `0${min}`;
        }
        return `${hrs}h${min}min`;
    }
    return {
        hours: hrs,
        min,
    };
}

export function convertTimeInverse(str) {
    let h = str.match(/^\d+$/g);
    if (h === null) {
        h = str.match(/^\d+h/g);
    }

    if (h !== null) {
    // eslint-disable-next-line radix
        h = parseInt(h[0]);
    }

    let m = str.match(/\d+$/g);
    if (m === null) {
        m = str.match(/\d+min/g);
    } else if (h !== null) {
        m = 0;
    }

    if (h === null) {
        h = 0;
    }

    if (m !== null && m !== 0) {
        // eslint-disable-next-line radix
        m = parseInt(m[0]);
    } else {
        m = 0;
    }

    return (h + (m / 60)).toFixed(2);
}
