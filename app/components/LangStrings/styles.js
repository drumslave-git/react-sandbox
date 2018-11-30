export default {
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
    legend: {
        padding: '1% 3%',
        display: 'flex',
        flexDirection: 'row',
        boxShadow: '0 0 5px',
    },
    legendItem: {
        padding: '1%',
        display: 'block',
    },
    legendItemActive: {},
    legendItemNotActive: {
        opacity: '0.5',
    },
    notRelevant: {
        color: 'red',
    },
    mentionedMissingRelevant: {
        color: 'orange',
    },
    newMissingRelevant: {
        color: 'blue',
    },
    addedRelevant: {
        color: 'green',
    },
    notAdded: {
        color: 'grey',
    },
    input: {
        verticalAlign: 'middle',
    },
    fab: {
        position: 'fixed',
        right: '2%',
        bottom: '2%',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100vh',
        overflow: 'auto',
        width: '50%',
        padding: '3%',
        boxSizing: 'border-box',
    },
    mainTable: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
};
