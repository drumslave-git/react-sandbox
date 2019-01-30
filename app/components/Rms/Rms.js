import React from 'react';
// import uuid from 'uuid';
import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { getTreeFromFlatData, map as mapTree, toggleExpandedForAll } from 'react-sortable-tree';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import EventEmitter from 'eventemitter3';
import Folders from './Folders';
import Catalog from './Catalog';
import ComponentEdit from './ComponentEdit';
import AuthDialog from './AuthDialog';
import Toolbar from './Toolbar';
import Header from './Header';
import TreeHelper from './treeHelper';

const EE = new EventEmitter();

const FirebaseConfig = {
    apiKey: 'AIzaSyCCQ-L-ytJY9s6AZXUuEwBAURlbg2ryt0g',
    authDomain: 'ginstr-rms.firebaseapp.com',
    databaseURL: 'https://ginstr-rms.firebaseio.com',
    projectId: 'ginstr-rms',
    storageBucket: 'ginstr-rms.appspot.com',
    messagingSenderId: '499751327280',
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: '100vh',
        padding: '0.67em',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
    },
    gridMain: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
    },
});

class Rms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            relations: null,
            catalog: null,
            editingComponent: null,
            parentId: null,
            needAuth: false,
            searches: {
                relations: {
                    searchQuery: null,
                    searchFocusIndex: null,
                    searchFoundCount: null,
                },
                catalog: {
                    searchQuery: null,
                    searchFocusIndex: null,
                    searchFoundCount: null,
                },
            },
        };
        this.db = null;
    }

    // eslint-disable-next-line react/sort-comp
    initFirbaseDB = (callback = () => {
    }) => {
        firebase.initializeApp(FirebaseConfig);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // eslint-disable-next-line react/destructuring-assignment
                if (this.state.needAuth) {
                    this.setState({ needAuth: false });
                }
                // console.log(user);
                // const userId = firebase.auth().currentUser.uid;
                this.db = firebase.firestore();
                this.db.settings({
                    timestampsInSnapshots: true,
                });
                callback();
            } else {
                this.setState({ needAuth: true });
                // firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
                //     // Handle Errors here.
                //     // eslint-disable-next-line no-console
                //     console.log(error);
                //     // ...
                // });
            }
        });
    };

    componentDidMount() {
        this.initFirbaseDB(this.getFiles);
    }

    getData = () => {
        EE.emit('beforeRequest');
        axios.get('/rms/api/components').then(({ data: { rows = [] }, status }) => {
            EE.emit('afterRequest');
            if (status === 200) {
                this.setState({ data: rows });
            }
        }).catch((error) => {
            EE.emit('afterRequest');
            // eslint-disable-next-line no-console
            console.log(error);
        });
    };

    getStructure = (collection) => {
        if (collection === 'catalog') {
            axios.get('/rms/api/tree').then(({ data, status }) => {
                console.log(status, data);
                if (status === 200) {
                    this.setState({
                        [collection]: data,
                    });
                }
            }).catch((error) => {
                EE.emit('afterRequest');
                // eslint-disable-next-line no-console
                console.log(error);
            });
        } else {
            this.db.collection(collection).get().then((querySnapshot) => {
                const res = [];
                querySnapshot.forEach((doc) => {
                    const { id } = doc;
                    const {
                        componentId,
                        parentId,
                        expanded = false,
                        order = 0,
                    } = doc.data();
                    res.push({
                        rid: id,
                        parentId,
                        componentId,
                        expanded,
                        order,
                    });
                });
                res.sort((a, b) => a.order - b.order);
                this.setState({
                    [collection]: getTreeFromFlatData({
                        flatData: res,
                        getKey: node => node.rid,
                        rootKey: '',
                    }),
                });
            });
        }
    };

    getRelations = () => {
        this.getStructure('relations');
    };

    getCatalog() {
        this.getStructure('catalog');
    }

    getFiles = () => {
        this.getData();
        this.getRelations();
        this.getCatalog();
    };

    handleComponentSave = (component, id = null) => {
        const {
            data,
            catalog,
            parentId,
        } = this.state;
        const updatedData = [...data];
        const updatedCatalog = [...catalog];
        if (id !== null) {
            const idx = data.findIndex(comp => comp.id === id);
            updatedData[idx] = {
                ...component,
                id,
            };
            this.updateComponents(updatedData, true);
            EE.emit('beforeRequest');
            axios.put(`/rms/api/components/${id}`, component).then(() => {
                EE.emit('afterRequest');
            });
        } else {
            EE.emit('beforeRequest');
            axios.post('/rms/api/components', component).then(({ data: { rows = [] }, status }) => {
                EE.emit('afterRequest');
                if (status === 200 && rows[0]) {
                    const ref = rows[0];
                    updatedData.push(ref);
                    this.updateComponents(updatedData, true);
                    if (parentId !== null) {
                        EE.emit('beforeRequest');
                        const node = TreeHelper.searchTree({
                            componentId: 'root',
                            children: updatedCatalog,
                        }, parentId);
                        this.db.collection('catalog').add({
                            componentId: ref.id,
                            parentId,
                        }).then(() => {
                            EE.emit('afterRequest');
                        });
                        node.children.push({
                            componentId: ref.id,
                        });
                        this.updateCatalog(updatedCatalog, true);
                    }
                }
            }).catch((error) => {
                EE.emit('afterRequest');
                // eslint-disable-next-line no-console
                console.log(error);
            });
            // EE.emit('beforeRequest');
            // this.db.collection('components').add({
            //     ...component,
            // }).then((ref) => {
            //     EE.emit('afterRequest');
            //     updatedData.push({
            //         ...component,
            //         id: ref.id,
            //     });
            //     this.updateComponents(updatedData, true);
            // });
        }
    };

    removeComponent = (id) => {
        const { data } = this.state;
        const updatedData = [...data];
        const idx = data.findIndex(comp => comp.id === id);
        if (idx !== -1) {
            updatedData.splice(idx, 1);
            this.updateComponents(updatedData, true);
            EE.emit('beforeRequest');
            axios.delete(`/rms/api/components/${id}`).then(() => {
                EE.emit('afterRequest');
            });
        }
    };

    updateComponents = (
        data,
    ) => {
        this.setState({
            editingComponent: null,
            parentId: null,
            data,
        });
    };

    updateStructure = (collection, draftData, dirty = false) => {
        if (collection === 'catalog') {
            const data = mapTree({
                treeData: draftData,
                getNodeKey: node => node.rid,
                callback: (info) => {
                    return {
                        id: info.node.id,
                        parentid: info.node.parentid,
                        expanded: info.node.expanded,
                        componentid: info.node.componentid,
                        children: info.node.children,
                    };
                },
            });
            axios.post('/rms/api/tree', data)
                .then(() => {
                    this.setState({
                        [collection]: draftData,
                    });
                })
                .catch((error) => {
                    EE.emit('afterRequest');
                    // eslint-disable-next-line no-console
                    console.log(error);
                });
        } else {
            const { [collection]: oldDraftCollection } = this.state;
            const data = draftData.filter(i => i.componentId !== 'backlog');
            const oldCollection = oldDraftCollection.filter(i => i.componentId !== 'backlog');
            this.setState({
                [collection]: draftData,
            });
            if (!dirty) {
                EE.emit('beforeRequest');
            }
            if (!dirty) {
                const flatData = TreeHelper.treeToFlat(data);
                const oldFlatData = TreeHelper.treeToFlat(oldCollection);
                const batch = this.db.batch();
                oldFlatData.forEach((oldItem) => {
                    const item = flatData.find(i => i.rid === oldItem.rid);
                    if (oldItem.rid === undefined) {
                        // data is not yet saved, but... it's ok
                        return;
                    }
                    const ref = this.db.collection(collection).doc(oldItem.rid);
                    if (item === undefined) {
                        batch.delete(ref);
                    } else {
                        batch.set(ref, {
                            parentId: item.parentId,
                            componentId: item.componentId,
                            expanded: item.expanded,
                            order: item.order,
                        });
                    }
                });
                batch.commit().then(() => {
                    EE.emit('afterRequest');

                    if (flatData.length > oldFlatData.length) {
                        flatData.forEach((item) => {
                            const oldItem = oldFlatData.find(i => i.rid === item.rid);
                            if (oldItem === undefined) {
                                EE.emit('beforeRequest');
                                this.db.collection(collection).add({
                                    parentId: item.parentId,
                                    componentId: item.componentId,
                                    expanded: item.expanded,
                                    order: item.order,
                                }).then((ref) => {
                                    const nextState = {
                                        [collection]: mapTree({
                                            treeData: draftData,
                                            getNodeKey: node => node.rid,
                                            callback: (info) => {
                                                if (
                                                    info.node.rid === undefined
                                                    && info.node.componentId !== 'backlog'
                                                    && (!info.parentNode || info.parentNode.componentId !== 'backlog')
                                                ) {
                                                    return {
                                                        ...info.node,
                                                        rid: ref.id,
                                                    };
                                                }
                                                return info.node;
                                            },
                                        }),
                                    };
                                    EE.emit('afterRequest');
                                    this.setState(nextState);
                                    // Did i ever tell you the definition of "Insanity"??
                                    // this.getStructure(collection);
                                });
                            }
                        });
                    }
                });
            }
        }
    };

    updateRelations = (relations, dirty = false) => {
        this.updateStructure('relations', relations, dirty);
    };

    updateCatalog = (catalog, dirty = false) => {
        this.updateStructure('catalog', catalog, dirty);
    };

    showEditor = (component = {}, parentId = null) => {
        this.setState({
            editingComponent: component,
            parentId,
        });
    };

    hideEditor = () => {
        this.setState({
            editingComponent: null,
        });
    };

    handleToggleExpandedForAll = (collection, expanded = true) => {
        const { [collection]: data } = this.state;
        this.updateStructure(collection, toggleExpandedForAll({ treeData: data, expanded }));
    };

    handleLogin = (email, password) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                // this.setState({ needAuth: true });
            })
            .catch((error) => {
                // Handle Errors here.
                // eslint-disable-next-line no-console
                console.log(error);
                // ...
            });
    };

    selectPrevMatch = (collection) => {
        const {
            searches: {
                [collection]: {
                    searchFocusIndex,
                    searchFoundCount,
                },
            },
            searches,
            searches: {
                [collection]: searchData,
            },
        } = this.state;
        const newSearchFocusIndex = searchFocusIndex !== null
            ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
            : searchFoundCount - 1;
        this.setState({
            searches: {
                ...searches,
                [collection]: {
                    ...searchData,
                    searchFocusIndex: newSearchFocusIndex,
                },
            },
        });
    };

    selectNextMatch = (collection) => {
        const {
            searches: {
                [collection]: {
                    searchFocusIndex,
                    searchFoundCount,
                },
            },
            searches,
            searches: {
                [collection]: searchData,
            },
        } = this.state;
        const newSearchFocusIndex = searchFocusIndex !== null
            ? (searchFocusIndex + 1) % searchFoundCount
            : 0;
        this.setState({
            searches: {
                ...searches,
                [collection]: {
                    ...searchData,
                    searchFocusIndex: newSearchFocusIndex,
                },
            },
        });
    };

    searchFinishCallback = (collection, matches) => {
        const {
            searches: {
                [collection]: {
                    searchFocusIndex,
                },
            },
            searches,
            searches: {
                [collection]: searchData,
            },
        } = this.state;
        const searchFoundCount = matches.length;
        this.setState({
            searches: {
                ...searches,
                [collection]: {
                    ...searchData,
                    searchFocusIndex: matches.length > 0 ? searchFocusIndex % matches.length : 0,
                    searchFoundCount,
                },
            },
        });
    };

    updateSearchQuery = (collection, q) => {
        const {
            searches,
            searches: {
                [collection]: searchData,
            },
        } = this.state;
        this.setState({
            searches: {
                ...searches,
                [collection]: {
                    ...searchData,
                    searchQuery: q,
                },
            },
        });
    };

    customSearchMethod = ({ node, searchQuery }) => {
        return searchQuery
            && node.name.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
    };

    render() {
        // eslint-disable-next-line react/prop-types
        const { classes } = this.props;
        const {
            needAuth,
            data,
            relations,
            catalog,
            editingComponent,
            searches: {
                relations: relationsSearch,
                catalog: catalogSearch,
            },
        } = this.state;
        return (
            <div className={classes.root}>
                <Header EE={EE} />
                {data !== null && (
                    <Grid
                        container
                        alignItems="stretch"
                        className={classes.gridMain}
                        spacing={16}
                    >
                        <Grid item xs={6}>
                            <Paper className={classes.paper}>
                                {relations !== null && (
                                    <React.Fragment>
                                        <Toolbar
                                            type="relations"
                                            expandToggle={this.handleToggleExpandedForAll}
                                            updateSearchQuery={this.updateSearchQuery}
                                            selectNextMatch={this.selectNextMatch}
                                            selectPrevMatch={this.selectPrevMatch}
                                            searchFocusIndex={relationsSearch.searchFocusIndex}
                                            searchFoundCount={relationsSearch.searchFoundCount}
                                        />
                                        <Folders
                                            data={data}
                                            relations={relations}
                                            searchFocusIndex={relationsSearch.searchFocusIndex}
                                            searchQuery={relationsSearch.searchQuery}
                                            searchMethod={this.customSearchMethod}
                                            updateRelations={this.updateRelations}
                                            searchFinishCallback={this.searchFinishCallback}
                                        />
                                    </React.Fragment>
                                )}
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper className={classes.paper}>
                                {catalog !== null && (
                                    <React.Fragment>
                                        <Toolbar
                                            type="catalog"
                                            expandToggle={this.handleToggleExpandedForAll}
                                            updateSearchQuery={this.updateSearchQuery}
                                            selectNextMatch={this.selectNextMatch}
                                            selectPrevMatch={this.selectPrevMatch}
                                            searchFocusIndex={catalogSearch.searchFocusIndex}
                                            searchFoundCount={catalogSearch.searchFoundCount}
                                        />
                                        {catalog.length !== 0 && (
                                            <Catalog
                                                catalog={catalog}
                                                searchFocusIndex={catalogSearch.searchFocusIndex}
                                                searchQuery={catalogSearch.searchQuery}
                                                searchMethod={this.customSearchMethod}
                                                updateCatalog={this.updateCatalog}
                                                showEditor={this.showEditor}
                                                removeComponent={this.removeComponent}
                                                searchFinishCallback={this.searchFinishCallback}
                                            />
                                        )}
                                    </React.Fragment>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                )}
                <AuthDialog
                    handleLogin={this.handleLogin}
                    show={needAuth}
                />
                <ComponentEdit
                    handleComponentSave={this.handleComponentSave}
                    hideEditor={this.hideEditor}
                    component={editingComponent}
                    show={editingComponent !== null}
                    components={data || []}
                />
            </div>
        );
    }
}

export default withStyles(styles)(Rms);
