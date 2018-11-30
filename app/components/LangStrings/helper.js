/* eslint-disable no-plusplus */
import sectionsEn from './data/sectionsEn';
import sectionsDe from './data/sectionsDe';
import en from './data/en';
import de from './data/de';
import usedStrings from './data/usedStrings';
import missingStrings from './data/missingStrings';

export const getTempStrings = (line) => {
    let tempStrings = localStorage.getItem('tempStrings');
    if (tempStrings === undefined) {
        tempStrings = {};
    } else {
        tempStrings = JSON.parse(tempStrings);
    }
    if (line === undefined) {
        return tempStrings;
    }
    return tempStrings[line];
};

export const saveTempStrings = (line, eng) => {
    const tempStrings = getTempStrings();
    tempStrings[line] = eng;
    localStorage.setItem('tempStrings', JSON.stringify(tempStrings));
};

export const copyToClipboard = (str) => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected = document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
    }
};

export function arrayUnique(array) {
    const a = array.concat();
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) a.splice(j--, 1);
        }
    }

    return a;
}

export const formatLinesFromTicket = () => {
    const result = [];
    const existingEnKeys = Object.keys(en);
    const existingDeKeys = Object.keys(de);
    const flattenEnStrings = Object.keys(sectionsEn);
    const flattenDeStrings = Object.keys(sectionsDe);
    const flattenStrings = arrayUnique([...flattenEnStrings, ...flattenDeStrings]);
    const tempStrings = getTempStrings();
    const foundMissingLines = [];
    // flattenEnStrings.sort();
    for (let i = 0; i < flattenStrings.length; i += 1) {
        const line = flattenStrings[i];
        let className = '';
        if (missingStrings.includes(line)) {
            foundMissingLines.push(line);
            className = 'mentionedMissingRelevant';
        } else if (existingEnKeys.includes(line) || existingDeKeys.includes(line)) {
            if (usedStrings.includes(line)) {
                className = 'addedRelevant';
            } else {
                className = 'notRelevant';
            }
        } else {
            className = 'notAdded';
        }

        result.push({
            text: line,
            originEn: en[line] || sectionsEn[line] || '',
            en: en[line] || sectionsEn[line] || '',
            de: de[line] || sectionsDe[line] || '',
            className,
        });
    }

    // missingStrings.sort();
    for (let i = 0; i < missingStrings.length; i += 1) {
        const line = missingStrings[i];
        if (!foundMissingLines.includes(line)) {
            result.push({
                text: line,
                originEn: '',
                en: tempStrings[line] || '',
                de: '',
                className: 'newMissingRelevant',
            });
        }
    }
    return result;
};
