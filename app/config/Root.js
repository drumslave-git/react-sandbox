import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Tracker from '../components/Tracker';
import LangStrings from '../components/LangStrings';
import Charts from '../components/Charts';
import Rms from '../components/Rms';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
});

const Root = () => {
    return (
        <MuiThemeProvider theme={theme}>
            <Router>
                <Switch>
                    <Route path="/" component={Tracker} exact />
                    <Route path="/lang" component={LangStrings} exact />
                    <Route path="/charts" component={Charts} exact />
                    <Route path="/rms" component={Rms} exact />
                </Switch>
            </Router>
        </MuiThemeProvider>
    );
};

export default Root;

