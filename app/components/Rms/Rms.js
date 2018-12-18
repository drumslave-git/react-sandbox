import React from 'react';
import uuid from 'uuid';
import firebase from 'firebase';
// import { getTreeFromFlatData } from 'react-sortable-tree';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SaveIcon from '@material-ui/icons/Save';
import Folders from './Folders';
import Components from './Components';
import Catalog from './Catalog';
import ComponentEdit from './ComponentEdit';
import TreeHelper from './treeHelper';

const CLIENT_ID = '499751327280-8lvkiah8do2ocdadqchqdij624j6rdni.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBrVQ1m81Ac_qCC19d5M1OPfZRvU6pJklE';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive';

// eslint-disable-next-line no-undef
const GAPI = gapi;

const FirebaseConfig = {
    apiKey: 'AIzaSyCCQ-L-ytJY9s6AZXUuEwBAURlbg2ryt0g',
    authDomain: 'ginstr-rms.firebaseapp.com',
    databaseURL: 'https://ginstr-rms.firebaseio.com',
    projectId: 'ginstr-rms',
    storageBucket: 'ginstr-rms.appspot.com',
    messagingSenderId: '499751327280',
};

const USE_FB = false;

const componentsFileId = '1M6jD5sz81NU0cpWlZeclLF000x0OAF2V';
const relationsFileId = '1be4l-asOKweBTFoVpSEKlsJt_2mKZY94';
const catalogFileId = '1YjDeHyoKHfR9BRnr0zNu6An8M62SAbcA';

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
        height: '100%',
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
            parentComponent: null,
            draftData: false,
        };
        if (USE_FB) {
            this.db = null;
        }
    }

    // eslint-disable-next-line react/sort-comp
    initFirbaseDB = (collback = () => {}) => {
        const email = 'george.tislenko@gmail.com';
        const password = '9379992goga';
        firebase.initializeApp(FirebaseConfig);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log(user);
                // const userId = firebase.auth().currentUser.uid;
                this.db = firebase.firestore();
                this.db.settings({
                    timestampsInSnapshots: true,
                });
                collback();
            } else {
                firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
                    // Handle Errors here.
                    console.log(error);
                    // ...
                });
            }
        });
    };

    componentDidMount() {
        if (!USE_FB) {
            GAPI.load('client', this.start);
        } else {
            this.initFirbaseDB(this.getFiles);
        }
    }

    getData = () => {
        if (!USE_FB) {
            GAPI.client.drive.files.get({
                fileId: componentsFileId,
                alt: 'media',
            }).then((response) => {
                this.setState({ data: response.result });
            });
        } else {
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
        }
    };

    getRelations = () => {
        if (!USE_FB) {
            GAPI.client.drive.files.get({
                fileId: relationsFileId,
                alt: 'media',
            }).then((response) => {
                this.setState({ relations: response.result });
            });
        } else {
            this.db.collection('relations').get().then((querySnapshot) => {
                const relations = [];
                querySnapshot.forEach((doc) => {
                    // const { id } = doc;
                    const { name, color } = doc.data();
                    relations.push({
                        name,
                        color,
                    });
                });
                this.setState({ relations });
            });
        }
    }

    getCatalog() {
        GAPI.client.drive.files.get({
            fileId: catalogFileId,
            alt: 'media',
        }).then((response) => {
            this.setState({ catalog: response.result });
        });
    }

    getFiles = () => {
        this.getData();
        this.getRelations();
        this.getCatalog();
    };

    start = () => {
        GAPI.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
        }).then(() => {
            GAPI.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
            this.updateSigninStatus(GAPI.auth2.getAuthInstance().isSignedIn.get());
        });
    };

    updateSigninStatus = (isSignedIn) => {
        if (isSignedIn) {
            this.getFiles();
        } else {
            GAPI.auth2.getAuthInstance().signIn();
        }
    };

    handleComponentSave = (component, id = null) => {
        const { data, catalog, parentComponent } = this.state;
        const updatedData = [...data];
        const updatedCatalog = [...catalog];
        let newId = null;
        if (id !== null) {
            const idx = data.findIndex(comp => comp.id === id);
            updatedData[idx] = {
                ...component,
                id,
            };
        } else {
            newId = uuid();
            updatedData.unshift({
                ...component,
                id: newId,
            });
        }
        if (parentComponent !== null && newId !== null) {
            const node = TreeHelper.searchTree({
                componentId: 'root',
                children: updatedCatalog,
            }, parentComponent.id);
            node.children.push({
                componentId: newId,
            });
            this.updateCatalog(updatedCatalog);
        }
        this.updateComponents(updatedData);
    };

    removeComponent = (id) => {
        const { data } = this.state;
        const updatedData = [...data];
        const idx = data.findIndex(comp => comp.id === id);
        if (idx !== -1) {
            updatedData.splice(idx, 1);
            this.updateComponents(updatedData);
        }
    };

    addToRelations = (component) => {
        const { relations } = this.state;
        const updatedRelations = [...relations];

        updatedRelations.unshift({
            componentId: component.id,
            children: [],
        });
        this.updateRelations(updatedRelations);
    };

    updateRelations = (relations) => {
        this.setState({
            relations,
            draftData: true,
        });

        GAPI.client.request({
            path: `/upload/drive/v3/files/${relationsFileId}`,
            method: 'PATCH',
            params: {
                uploadType: 'media',
            },
            body: relations,
        }).then(() => {
            this.setState({
                draftData: false,
            });
        });
    };

    updateCatalog = (catalog) => {
        const filteredCatalog = catalog.filter(i => i.componentId !== 'backlog');
        this.setState({
            catalog,
            draftData: true,
        });

        GAPI.client.request({
            path: `/upload/drive/v3/files/${catalogFileId}`,
            method: 'PATCH',
            params: {
                uploadType: 'media',
            },
            body: filteredCatalog,
        }).then(() => {
            this.setState({
                draftData: false,
            });
        });
    };

    showEditor = (component = {}, parentId = null) => {
        let parentComponent = null;
        if (parentId !== null) {
            const { data } = this.state;
            parentComponent = data.find(comp => comp.id === parentId);
        }
        this.setState({
            editingComponent: component,
            parentComponent: parentComponent || null,
        });
    };

    hideEditor = () => {
        this.setState({
            editingComponent: null,
        });
    };

    updateComponents(components) {
        this.setState({
            data: components,
            editingComponent: null,
            parentComponent: null,
            draftData: true,
        });

        GAPI.client.request({
            path: `/upload/drive/v3/files/${componentsFileId}`,
            method: 'PATCH',
            params: {
                uploadType: 'media',
            },
            body: components,
        }).then(() => {
            this.setState({
                draftData: false,
            });
        });
    }

    render() {
        // eslint-disable-next-line react/prop-types
        const { classes } = this.props;
        const {
            data,
            relations,
            catalog,
            draftData,
            editingComponent,
            parentComponent,
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
                                    <Folders
                                        data={data}
                                        relations={relations}
                                        updateRelations={this.updateRelations}
                                    />
                                )}
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper className={classes.paper}>
                                {catalog === null && (
                                    <Components
                                        components={data}
                                        addToRelations={this.addToRelations}
                                        removeComponent={this.removeComponent}
                                        handleComponentSave={this.handleComponentSave}
                                    />
                                )}
                                {catalog !== null && (
                                    <Catalog
                                        data={data}
                                        catalog={catalog}
                                        updateCatalog={this.updateCatalog}
                                        showEditor={this.showEditor}
                                        removeComponent={this.removeComponent}
                                    />
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                    <ComponentEdit
                        handleComponentSave={this.handleComponentSave}
                        hideEditor={this.hideEditor}
                        component={editingComponent}
                        parentComponent={parentComponent}
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
