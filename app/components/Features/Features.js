import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import EventEmitter from 'eventemitter3';
import qs from 'querystring';

import { withStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';

import Header from '../common/Header';
import Filter from './parts/Filter';
import {ParentData} from './parts/ParentData';
import {ExtraFieldData} from './parts/ExtraFieldData';
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
const apiURL = '/testapi';

const clearState = {
    auth: {
        username: null,
        password: null,
    },
    time_entries: [],
    user: null,
    parentId: '',
    extraFieldId: '',
    parentInfo: {},
    extraFieldInfo: {},
    period: 'today',
    issuesGrouping: [],
    snack: {
        show: false,
        text: '',
        variant: 'info',
    },
    reports: null,
    loading: false,
};

class Features extends React.Component {
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

    getIssueByIDPromise = (issue) => {
        return new Promise(resolve => {
            this.getIssueByID(issue.id, (resp) => {
                resolve(resp.data.issue);
            })
        })
    };

    getParentWithChildren = async (parentIssue) => {
        if(parentIssue.children && parentIssue.children.length) {
            parentIssue.children = await Promise.all(parentIssue.children.map(child => {
                const childData = this.getIssueByIDPromise(child);
                return this.getParentWithChildren(childData);
            }))
        }

        return parentIssue;
    };

    changeParentId = async (parentId) => {
        this.setState({ parentId });
        if(parentId !== this.state.parentId){
            if(parentId) {
                await this.getIssueByID(parentId, async(resp) => {
                    const parentIssue = {...resp.data.issue};
                    const parentData = await this.getParentWithChildren(parentIssue);
                    this.setState({ parentInfo: parentData })
                });
            }else{
                this.setState({ parentInfo: {} })
            }
        }
    };

    changeExtraFieldId = (extraFieldId) => {
        if(extraFieldId !== this.state.extraFieldId){
            if(extraFieldId) {
                this.getExtraFieldValuesPageByID(extraFieldId, (resp) => {
                    this.setState({ extraFieldInfo: resp })
                })
            }else{
                this.setState({ extraFieldInfo: {} })
            }
        }
        this.setState({ extraFieldId });
    };

    saveExtraFieldValues = (data) => {
        if(this.state.extraFieldId) {
            const { extraFieldId, auth } = this.state;
            const bodyFormData = new FormData();
            Object.keys(data).forEach(k => {
                bodyFormData.set(k, data[k]);
            });
            // const options = {
            //     method: 'POST',
            //     headers: { 'content-type': 'application/x-www-form-urlencoded' },
            //     config: { headers: {'Content-Type': 'application/x-www-form-urlencoded' }},
            //     data: bodyFormData,
            //     url: `${apiURL}/custom_fields/${extraFieldId}/enumerations`,
            // };
            // axios(options)
            axios.post(`redmine/custom_fields/${extraFieldId}/enumerations`,
                // qs.stringify({
                //     utf8: '✓',
                //     _method: 'put',
                //     authenticity_token: "g/s41v0WuA/9juUmblWdD6engneVyxIj4ZKkTvwhR8EfKd7TUja+EqG5kPyU4ax0qbBsT0J4cC65r8pBh9cJSQ==",
                //     ...data,
                //     commit: 'Save'
                // }),
                "utf8=%E2%9C%93&_method=put&authenticity_token=g%2Fs41v0WuA%2F9juUmblWdD6engneVyxIj4ZKkTvwhR8EfKd7TUja%2BEqG5kPyU4ax0qbBsT0J4cC65r8pBh9cJSQ%3D%3D&custom_field_enumerations%5B1%5D%5Bposition%5D=0&custom_field_enumerations%5B1%5D%5Bname%5D=value1&custom_field_enumerations%5B1%5D%5Bactive%5D=0&custom_field_enumerations%5B1%5D%5Bactive%5D=1&custom_field_enumerations%5B2%5D%5Bposition%5D=1&custom_field_enumerations%5B2%5D%5Bname%5D=value2&custom_field_enumerations%5B2%5D%5Bactive%5D=0&custom_field_enumerations%5B2%5D%5Bactive%5D=1&custom_field_enumerations%5B3%5D%5Bposition%5D=2&custom_field_enumerations%5B3%5D%5Bname%5D=value3&custom_field_enumerations%5B3%5D%5Bactive%5D=0&custom_field_enumerations%5B3%5D%5Bactive%5D=1&custom_field_enumerations%5B4%5D%5Bposition%5D=3&custom_field_enumerations%5B4%5D%5Bname%5D=4%23%23feature+3&custom_field_enumerations%5B4%5D%5Bactive%5D=0&custom_field_enumerations%5B4%5D%5Bactive%5D=1&custom_field_enumerations%5B6%5D%5Bposition%5D=4&custom_field_enumerations%5B6%5D%5Bname%5D=5%23%23feature+xyz&custom_field_enumerations%5B6%5D%5Bactive%5D=0&custom_field_enumerations%5B6%5D%5Bactive%5D=1&custom_field_enumerations%5B7%5D%5Bposition%5D=5&custom_field_enumerations%5B7%5D%5Bname%5D=6%24main&custom_field_enumerations%5B7%5D%5Bactive%5D=0&custom_field_enumerations%5B7%5D%5Bactive%5D=1&commit=Save",
                {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }, auth
            })
            // fetch("https://test-redmine.enaikoon.de/custom_fields/6/enumerations", {"credentials":"include","headers":{"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3","accept-language":"ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,uk;q=0.6","authorization":"Basic Z3Rpc2xlbmtvOjkzNzk5OTJnb2dh","cache-control":"max-age=0","content-type":"application/x-www-form-urlencoded","sec-fetch-mode":"navigate","sec-fetch-site":"same-origin","sec-fetch-user":"?1","upgrade-insecure-requests":"1"},"referrer":"https://test-redmine.enaikoon.de/custom_fields/6/enumerations","referrerPolicy":"strict-origin-when-cross-origin","body":"utf8=%E2%9C%93&_method=put&authenticity_token=g%2Fs41v0WuA%2F9juUmblWdD6engneVyxIj4ZKkTvwhR8EfKd7TUja%2BEqG5kPyU4ax0qbBsT0J4cC65r8pBh9cJSQ%3D%3D&custom_field_enumerations%5B1%5D%5Bposition%5D=0&custom_field_enumerations%5B1%5D%5Bname%5D=value1&custom_field_enumerations%5B1%5D%5Bactive%5D=0&custom_field_enumerations%5B1%5D%5Bactive%5D=1&custom_field_enumerations%5B2%5D%5Bposition%5D=1&custom_field_enumerations%5B2%5D%5Bname%5D=value2&custom_field_enumerations%5B2%5D%5Bactive%5D=0&custom_field_enumerations%5B2%5D%5Bactive%5D=1&custom_field_enumerations%5B3%5D%5Bposition%5D=2&custom_field_enumerations%5B3%5D%5Bname%5D=value3&custom_field_enumerations%5B3%5D%5Bactive%5D=0&custom_field_enumerations%5B3%5D%5Bactive%5D=1&custom_field_enumerations%5B4%5D%5Bposition%5D=3&custom_field_enumerations%5B4%5D%5Bname%5D=4%23%23feature+3&custom_field_enumerations%5B4%5D%5Bactive%5D=0&custom_field_enumerations%5B4%5D%5Bactive%5D=1&custom_field_enumerations%5B6%5D%5Bposition%5D=4&custom_field_enumerations%5B6%5D%5Bname%5D=5%23%23feature+xyz&custom_field_enumerations%5B6%5D%5Bactive%5D=0&custom_field_enumerations%5B6%5D%5Bactive%5D=1&custom_field_enumerations%5B7%5D%5Bposition%5D=5&custom_field_enumerations%5B7%5D%5Bname%5D=6%24main&custom_field_enumerations%5B7%5D%5Bactive%5D=0&custom_field_enumerations%5B7%5D%5Bactive%5D=1&commit=Save","method":"POST","mode":"cors"});
        }
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

    getIssueByID = (id, t, c) => {
        const { auth } = this.state;
        EE.emit('beforeRequest');
        axios.get(
            `${apiURL}/issues/${id}.json?include=children`,
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

    getExtraFieldValuesPageByID = (id, t, c) => {
        const { auth } = this.state;
        EE.emit('beforeRequest');
        // axios.get(
        //     `https://test-redmine.enaikoon.de/custom_fields/${id}/enumerations`,
        //     // {
        //     //     auth,
        //     //     headers: {
        //     //         'Sec-Fetch-Mode': 'navigate',
        //     //         'Sec-Fetch-Site': 'same-origin'
        //     //     }
        //     // },
        // );
        axios.get(
            `${apiURL}/custom_fields.json`,
            {
                auth,
            },
        ).then((resp) => {
            EE.emit('afterRequest');
            t(resp.data.custom_fields.find(cf => cf.id === Number(id)));
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

    render() {
        const {
            user,
            parentId,
            extraFieldId,
            snack,
            parentInfo,
            extraFieldInfo,
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
                    title="Features"
                />
                <Filter
                    classes={classes}
                    parentId={parentId}
                    extraFieldId={extraFieldId}
                    changeParentId={this.changeParentId}
                    changeExtraFieldId={this.changeExtraFieldId}
                />
                <div style={{
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                    <ParentData parentInfo={parentInfo} />
                    <ExtraFieldData extraFieldInfo={extraFieldInfo} saveExtraFieldValues={this.saveExtraFieldValues}/>
                </div>
                <Notify
                    classes={classes}
                    snack={snack}
                    handleCloseSnack={this.handleCloseSnack}
                />
                {/*<Actions*/}
                {/*    classes={classes}*/}
                {/*    loading={loading}*/}
                {/*    user={user}*/}
                {/*    TimeEntries={TimeEntries}*/}
                {/*    getTime={this.getTime}*/}
                {/*    getReports={this.getReports}*/}
                {/*/>*/}
                {loading && (
                    <CircularProgress className={classes.progress} />
                )}
            </div>
        );
    }
}

Features.propTypes = {
// eslint-disable-next-line react/forbid-prop-types
    classes: PropTypes.object.isRequired,
};

export default withStyles(materialStyles)(Features);
