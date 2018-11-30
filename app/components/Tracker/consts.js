/* eslint-disable import/prefer-default-export */
export const materialStyles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        padding: theme.spacing.unit * 3,
        boxSizing: 'border-box',
    },
    table: {
        minWidth: 700,
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
    progress: {
        position: 'fixed',
        right: '1%',
        bottom: '1%',
    },
    groupDetails: {
        flexDirection: 'column',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    fab: {
        margin: theme.spacing.unit,
    },
});
export const styles = theme => ({
    fabIcons: {
        position: 'fixed',
        bottom: theme.spacing.unit,
        right: theme.spacing.unit,
        display: 'flex',
        flexDirection: 'column',
    },
});
export const rmURL = 'https://redmine.enaikoon.de';

export const AUTH = {
    username: 'george.tislenko@gmail.com',
    password: '9379992Goga',
};

export const LIMITS = {
    issues: 100,
    projects: 100,
    time_entries: 100,
    user: 100,
};
