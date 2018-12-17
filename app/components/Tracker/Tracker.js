import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import EventEmitter from 'eventemitter3';

import { withStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';

// import img from '../assets/images/react_logo_512x512.png';

// import apiRedmine from '../../controllers/api/apiRedmine';
import Header from '../common/Header';
import Filter from './parts/Filter';
import Report from './parts/Report';
import {
    formatDT,
    convertTime,
    getConfig,
    saveConfig,
} from './helper';
import { materialStyles, LIMITS } from './consts';
import Actions from './parts/Actions/Actions';
import Notify from './parts/Notify';

const EE = new EventEmitter();

// const apiURL = (process.env.NODE_ENV === 'production') ? 'https://redmine.enaikoon.de' : '/api';
const apiURL = '/api';

const clearState = {
    auth: {
        username: null,
        password: null,
    },
    time_entries: [],
    user: null,
    dateFrom: formatDT(new Date()),
    dateTo: formatDT(new Date()),
    period: 'today',
    issuesGrouping: [],
    snack: {
        show: false,
        text: '',
        variant: 'info',
    },
    reports: null,
    forRedmine: false,
    loading: false,
};

class Tracker extends React.Component {
    constructor(props) {
        super(props);
        const config = getConfig();
        this.state = {
            ...clearState,
            ...config,
        };

        EE.on('beforeRequest', this.beforeRequest);
        EE.on('afterRequest', this.afterRequest);
    }

    componentDidMount() {
        this.getData('users/current', 'user');
        // apiRedmine.getRequest('test')
        //     .catch(error => alert(error));
    }

    componentWillUnmount() {
        EE.removeListener('beforeRequest', this.beforeRequest);
        EE.removeListener('afterRequest', this.afterRequest);
    }

    beforeRequest = () => {
        this.setState({ loading: true });
    };

    afterRequest = () => {
        this.setState({ loading: false });
    };

    doLogin = (auth) => {
        this.setState({ auth }, () => {
            saveConfig({ auth });
            this.getData('users/current', 'user');
        });
    };

    doLogout = () => {
        this.setState({ ...clearState }, () => saveConfig({
            auth: {
                username: null,
                password: null,
            },
        }));
    };

    autoComplete = (id, date, q) => {
        const { auth } = this.state;
        this.updateReportGroup(id, date, q);
        if (q.length < 2) {
            return;
        }
        if (!auth.username || !auth.password) {
            this.setState({
                snack: {
                    show: true,
                    text: 'Not authorized',
                    variant: 'error',
                },
            });
            return;
        }
        EE.emit('beforeRequest');
        axios.get(`${apiURL}/search.json?q=${q}&issues=1&limit=10`, {
            auth,
        }).then(({ data: { results }, status }) => {
        // axios.get(`/api/issues/auto_complete?term=${q}`).then(({ data, status }) => {
            EE.emit('afterRequest');
            if (status === 200) {
                this.updateReportGroup(id, date, undefined, results);
            }
        }).catch((error) => {
            EE.emit('afterRequest');
            if (error.response !== undefined) {
                this.setState({
                    snack: {
                        show: true,
                        text: error.message,
                        variant: 'error',
                    },
                });
            } else {
                this.getIssueByID(q, ({ data, status }) => {
                    if (status === 200) {
                        this.updateReportGroup(id, date, data.issue.id, [], data.issue.subject);
                    }
                });
            }
        });
    };

    getData = (url, part, add = '') => {
        const { auth } = this.state;
        if (!auth.username || !auth.password) {
            this.setState({
                snack: {
                    show: true,
                    text: 'Not authorized',
                    variant: 'error',
                },
            });
            return;
        }
        EE.emit('beforeRequest');
        axios.get(`${apiURL}/${url}.json?limit=${LIMITS[part]}${add}`, {
            auth,
        }).then(({ data, status }) => {
            EE.emit('afterRequest');
            if (status === 200 && data && data[part]) {
                this.setState({ [part]: data[part] });
            }
        }).catch((error) => {
            EE.emit('afterRequest');
            this.setState({
                snack: {
                    show: true,
                    text: error.message,
                    variant: 'error',
                },
            });
        });
    };

    getTime = () => {
        const {
            auth,
            user,
            dateFrom,
            dateTo,
            period,
        } = this.state;
        if (!auth.username || !auth.password) {
            this.setState({
                snack: {
                    show: true,
                    text: 'Not authorized',
                    variant: 'error',
                },
            });
            return;
        }
        let url = `/api/time_entries.json?user_id=${user.id}`;
        if (period === 'range') {
            url += `&spent_on=><${dateFrom}|${dateTo}`;
        } else {
            let date = null;
            if (period === 'today') {
                date = formatDT(new Date());
            }
            if (period === 'yesterday') {
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                date = formatDT(yesterday);
            }

            if (date) url += `&spent_on=><${date}|${date}`;
        }
        url += `&limit=${LIMITS.time_entries}`;
        EE.emit('beforeRequest');
        axios
            .get(url, {
                auth,
            })
            .then(({ data: dataTE, status: statusTE }) => {
                EE.emit('afterRequest');
                if (
                    statusTE === 200
                    && dataTE
                    && dataTE.time_entries
                    && dataTE.time_entries.length
                ) {
                    const issuesIds = dataTE.time_entries.map(entry => entry.issue.id);
                    EE.emit('beforeRequest');
                    axios
                        .get(`/api/issues.json?limit=${issuesIds.length}&issue_id=${issuesIds.join(',')}`, {
                            auth,
                        })
                        .then(({ data: dataI, status: statusI }) => {
                            EE.emit('afterRequest');
                            if (statusI === 200 && dataI && dataI.issues) {
                                const issuesMap = {};
                                dataI.issues.forEach((issue) => {
                                    issuesMap[issue.id] = issue;
                                });
                                this.setState({
                                    time_entries: dataTE.time_entries.map((entry) => {
                                        return {
                                            ...entry,
                                            issue: {
                                                ...issuesMap[entry.issue.id],
                                            },
                                        };
                                    }),
                                });
                            }
                        })
                        .catch((error) => {
                            EE.emit('afterRequest');
                            this.setState({
                                snack: {
                                    show: true,
                                    text: error.message,
                                    variant: 'error',
                                },
                            });
                        });
                } else {
                    this.setState({
                        snack: {
                            show: true,
                            text: 'No tracking info for selected time period',
                            variant: 'warning',
                        },
                        time_entries: [],
                    });
                }
            })
            .catch((error) => {
                EE.emit('afterRequest');
                this.setState({
                    snack: {
                        show: true,
                        text: error.message,
                        variant: 'error',
                    },
                });
            });
    };

    addNote = (issueId, note) => {
        const { auth } = this.state;
        if (!auth.username || !auth.password) {
            this.setState({
                snack: {
                    show: true,
                    text: 'Not authorized',
                    variant: 'error',
                },
            });
            return;
        }
        EE.emit('beforeRequest');
        axios.put(
            `${apiURL}/issues/${issueId}.json`,
            {
                issue: {
                    notes: note,
                },
            },
            {
                auth,
            },
        ).then(({ status }) => {
            EE.emit('afterRequest');
            if (status === 200) {
                this.setState({
                    snack: {
                        show: true,
                        text: 'Note Added',
                        variant: 'success',
                    },
                });
            }
        }).catch((error) => {
            EE.emit('afterRequest');
            this.setState({
                snack: {
                    show: true,
                    text: error.message,
                    variant: 'error',
                },
            });
        });
    };

    changeDate = (dir, value) => {
        const state = { [dir]: value };
        if (dir !== 'period') {
            state.period = 'range';
        }
        this.setState(state);
    };

    handleCloseSnack = () => {
        const { snack } = this.state;
        this.setState({
            snack: {
                ...snack,
                show: false,
            },
        });
    };

    toggleForRedmine = (forRedmine) => {
        this.setState({ forRedmine }, () => saveConfig({ forRedmine }));
    };

    toggleIssueID = (id) => {
        const { issuesGrouping = [] } = this.state;
        const updatedIssuesGrouping = [...issuesGrouping];
        const { isIt, indexOfId } = this.isIdInGrouping(id);
        if (isIt) {
            updatedIssuesGrouping.splice(indexOfId, 1);
        } else {
            updatedIssuesGrouping.push(id);
        }

        this.setState({ issuesGrouping: updatedIssuesGrouping });
    };

    isIdInGrouping = (id) => {
        const { issuesGrouping = [] } = this.state;
        const indexOfId = issuesGrouping.indexOf(id);

        return { isIt: indexOfId > -1, indexOfId };
    };

    getIssueByID = (id, t, c) => {
        const { auth } = this.state;
        EE.emit('beforeRequest');
        axios.get(
            `${apiURL}/issues/${id}.json`,
            {
                auth,
            },
        ).then((resp) => {
            EE.emit('afterRequest');
            t(resp);
        }).catch((error) => {
            EE.emit('afterRequest');
            this.setState({
                snack: {
                    show: true,
                    text: error.message,
                    variant: 'error',
                },
            });
            if (typeof c === 'function') c(error);
        });
    };

    getReports = () => {
        const { issuesGrouping, time_entries: timeEntries } = this.state;
        const reportsMap = {};
        const totals = { sum: 0, humanTime: '' };
        timeEntries.forEach((te) => {
            const { issue, spent_on: spentOn } = te;
            const date = formatDT(new Date(spentOn), ['day', 'month', 'year']);
            let groupName;
            let groupId;
            let targetIssueId;
            if (issuesGrouping.includes(issue.id)) {
                groupId = issue.id;
                targetIssueId = issue.id;
                groupName = issue.subject;
            } else {
                groupId = 'others';
                targetIssueId = '';
                groupName = 'Others';
            }
            reportsMap[groupId] = reportsMap[groupId] || {
                byDates: {},
                name: groupName,
                sum: 0,
                humanTime: '',
            };
            reportsMap[groupId].byDates[date] = reportsMap[groupId].byDates[date] || {
                entries: [],
                targetIssueId,
                issueIdIsTrue: false,
                autoCompleteResults: [],
                sum: 0,
                humanTime: '',
            };

            reportsMap[groupId].byDates[date].entries.push({
                ...te, humanTime: convertTime(te.hours),
            });
            reportsMap[groupId].byDates[date].sum += Number(te.hours);
            reportsMap[groupId]
                .byDates[date]
                .humanTime = convertTime(reportsMap[groupId].byDates[date].sum);
            reportsMap[groupId].sum += Number(te.hours);
            reportsMap[groupId].humanTime = convertTime(reportsMap[groupId].sum);
            totals.sum += Number(te.hours);
            totals.humanTime = convertTime(totals.sum);
            const byDate = reportsMap[groupId].byDates[date];
            byDate.text = `${date} ${byDate.humanTime}\n\n`;
            byDate.text += byDate.entries.reduce((acc, entry) => {
                let line = '';
                line += `| ${entry.humanTime} | `;
                if (!issuesGrouping.includes(issue.id)) {
                    line += `#${entry.issue.id} | `;
                }
                line += `${entry.comments} |\n`;
                return acc + line;
            }, '');
        });
        this.setState({ reports: { groups: reportsMap, totals } });
    };

    updateReportGroup = (id, date, q, results = [], issueIdIsTrue = false) => {
        const { reports } = this.state;
        const updatedReports = {
            ...reports,
            groups: {
                ...reports.groups,
                [id]: {
                    ...reports.groups[id],
                    byDates: {
                        ...reports.groups[id].byDates,
                        [date]: {
                            ...reports.groups[id].byDates[date],
                            autoCompleteResults: results,
                            issueIdIsTrue,
                            targetIssueId:
                                q === undefined
                                    ? reports.groups[id].byDates[date].targetIssueId
                                    : q,
                        },
                    },
                },
            },
        };
        this.setState({
            reports: updatedReports,
        });
    }

    render() {
        const {
            user,
            dateFrom,
            dateTo,
            period,
            issuesGrouping,
            snack,
            reports,
            forRedmine,
            loading,
            time_entries: TimeEntries,
        } = this.state;
        const { classes } = this.props;
        return (
            <div>
                <Header
                    user={user}
                    classes={classes}
                    loading={loading}
                    doLogin={this.doLogin}
                    doLogout={this.doLogout}
                />
                <Filter
                    classes={classes}
                    period={period}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    changeDate={this.changeDate}
                />
                <Report
                    classes={classes}
                    issuesGrouping={issuesGrouping}
                    reports={reports}
                    TimeEntries={TimeEntries}
                    forRedmine={forRedmine}
                    toggleForRedmine={this.toggleForRedmine}
                    toggleIssueID={this.toggleIssueID}
                    isIdInGrouping={this.isIdInGrouping}
                    addNote={this.addNote}
                    autoComplete={this.autoComplete}
                    updateReportGroup={this.updateReportGroup}
                />
                <Notify
                    classes={classes}
                    snack={snack}
                    handleCloseSnack={this.handleCloseSnack}
                />
                <Actions
                    classes={classes}
                    loading={loading}
                    user={user}
                    TimeEntries={TimeEntries}
                    getTime={this.getTime}
                    getReports={this.getReports}
                />
                {loading && (
                    <CircularProgress className={classes.progress} />
                )}
            </div>
        );
    }
}

Tracker.propTypes = {
// eslint-disable-next-line react/forbid-prop-types
    classes: PropTypes.object.isRequired,
};

export default withStyles(materialStyles)(Tracker);
