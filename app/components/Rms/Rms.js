import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { getTreeFromFlatData, map as mapTree, toggleExpandedForAll } from 'react-sortable-tree';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SaveIcon from '@material-ui/icons/Save';
import Folders from './Folders';
import Catalog from './Catalog';
import ComponentEdit from './ComponentEdit';
import Toolbar from './Toolbar';
import TreeHelper from './treeHelper';

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
        height: '100%',
    },
    gridMain: {
        margin: theme.spacing.unit * 2 * -1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        // height: '100%',
        // color: theme.palette.text.secondary,
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
            draftData: false,
        };
        this.db = null;
    }

    // eslint-disable-next-line react/sort-comp
    initFirbaseDB = (callback = () => {}) => {
        const email = '';
        const password = '';
        firebase.initializeApp(FirebaseConfig);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // console.log(user);
                // const userId = firebase.auth().currentUser.uid;
                this.db = firebase.firestore();
                this.db.settings({
                    timestampsInSnapshots: true,
                });
                callback();
            } else {
                firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
                    // Handle Errors here.
                    // eslint-disable-next-line no-console
                    console.log(error);
                    // ...
                });
            }
        });
    };

    componentDidMount() {
        this.initFirbaseDB(this.getFiles);
    }

    getData = () => {
        this.db.collection('components').get().then((querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                const { id } = doc;
                const { name, color } = doc.data();
                data.push({
                    id,
                    name,
                    color,
                });
            });
            this.setState({ data });
        });
    };

    getStructure = (collection) => {
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
        const { data, catalog, parentId } = this.state;
        const updatedData = [...data];
        const updatedCatalog = [...catalog];
        if (id !== null) {
            const idx = data.findIndex(comp => comp.id === id);
            updatedData[idx] = {
                ...component,
                id,
            };
            this.updateComponents(updatedData, true);
            this.setState({
                draftData: true,
            });
            this.db.collection('components').doc(id).set({
                ...component,
            }).then(() => {
                this.setState({
                    draftData: false,
                });
            });
        } else {
            this.setState({
                draftData: true,
            });
            this.db.collection('components').add({
                ...component,
            }).then((ref) => {
                this.setState({
                    draftData: false,
                });
                updatedData.push({
                    ...component,
                    id: ref.id,
                });
                this.updateComponents(updatedData, true);
                if (parentId !== null) {
                    this.setState({
                        draftData: true,
                    });
                    const node = TreeHelper.searchTree({
                        componentId: 'root',
                        children: updatedCatalog,
                    }, parentId);
                    this.db.collection('catalog').add({
                        componentId: ref.id,
                        parentId,
                    }).then(() => {
                        this.setState({
                            draftData: false,
                        });
                    });
                    node.children.push({
                        componentId: ref.id,
                    });
                    this.updateCatalog(updatedCatalog, true);
                }
            });
        }
    };

    removeComponent = (id) => {
        const { data } = this.state;
        const updatedData = [...data];
        const idx = data.findIndex(comp => comp.id === id);
        if (idx !== -1) {
            updatedData.splice(idx, 1);
            this.updateComponents(updatedData, true);
            this.setState({ draftData: true });
            this.db.collection('components').doc(id).delete().then(() => {
                this.setState({ draftData: false });
            });
        }
    };

    // addToRelations = (component) => {
    //     const { relations } = this.state;
    //     const updatedRelations = [...relations];
    //
    //     updatedRelations.unshift({
    //         componentId: component.id,
    //         children: [],
    //     });
    //     this.updateRelations(updatedRelations);
    // };

    updateComponents = (
        data,
        dirty = false,
    ) => {
        this.setState({
            editingComponent: null,
            parentId: null,
            data,
            draftData: !dirty,
        });
    };

    updateStructure = (collection, draftData, dirty = false) => {
        const { [collection]: oldDraftCollection } = this.state;
        const data = draftData.filter(i => i.componentId !== 'backlog');
        const oldCollection = oldDraftCollection.filter(i => i.componentId !== 'backlog');
        this.setState({
            [collection]: draftData,
            draftData: !dirty,
        });
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
                this.setState({ draftData: false });

                if (flatData.length > oldFlatData.length) {
                    flatData.forEach((item) => {
                        const oldItem = oldFlatData.find(i => i.rid === item.rid);
                        if (oldItem === undefined) {
                            this.setState({ draftData: true });
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
                                            if (info.node.rid === undefined && info.node.componentId !== 'backlog') {
                                                return {
                                                    ...info.node,
                                                    rid: ref.id,
                                                };
                                            }
                                            return info.node;
                                        },
                                    }),
                                    draftData: false,
                                };
                                this.setState(nextState);
                                // Did i ever tell you the definition of "Insanity"??
                                // this.getStructure(collection);
                            });
                        }
                    });
                }
            });
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

    render() {
        // eslint-disable-next-line react/prop-types
        const { classes } = this.props;
        const {
            data,
            relations,
            catalog,
            draftData,
            editingComponent,
        } = this.state;
        if (data !== null) {
            return (
                <div className={classes.root}>
                    <h1>
                        RMS
                        {draftData && <SaveIcon style={{ color: 'red' }} />}
                    </h1>
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
                                            expandAll={() => this.handleToggleExpandedForAll('relations', true)}
                                            expandNone={() => this.handleToggleExpandedForAll('relations', false)}
                                        />
                                        <Folders
                                            data={data}
                                            relations={relations}
                                            updateRelations={this.updateRelations}
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
                                            expandAll={() => this.handleToggleExpandedForAll('catalog', true)}
                                            expandNone={() => this.handleToggleExpandedForAll('catalog', false)}
                                        />
                                        <Catalog
                                            data={data}
                                            catalog={catalog}
                                            updateCatalog={this.updateCatalog}
                                            showEditor={this.showEditor}
                                            removeComponent={this.removeComponent}
                                        />
                                    </React.Fragment>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                    <ComponentEdit
                        handleComponentSave={this.handleComponentSave}
                        hideEditor={this.hideEditor}
                        component={editingComponent}
                        show={editingComponent !== null}
                        components={data}
                    />
                </div>
            );
        }
        return null;
    }
}

export default withStyles(styles)(Rms);
