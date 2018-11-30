export const defaultVisibleStatuses = [
    'notRelevant',
    'mentionedMissingRelevant',
    'newMissingRelevant',
    'addedRelevant',
    'notAdded',
];

export const legendText = {
    notRelevant: 'exist in ticket, added in liferay, not used - got to be removed from liferay and then from ticket',
    mentionedMissingRelevant: 'exist in ticket, missing from liferay, used - got to be added in liferay',
    newMissingRelevant: 'added to ticket, missing from liferay, used - got to be added in liferay',
    addedRelevant: 'exist in ticket, added in liferay, used - nothing to do',
    notAdded: 'exist in ticket, missing from liferay, not used - can be removed from ticket',
};
