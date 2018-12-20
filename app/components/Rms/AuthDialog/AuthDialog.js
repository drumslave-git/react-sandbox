import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
    editor: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-${50}%, -${50}%)`,
        padding: theme.spacing.unit * 2,
        // width: 400,
        // height: 300,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});

class AuthDialog extends React.PureComponent {
    constructor() {
        super();
        this.emailInput = React.createRef();
        this.passwordInput = React.createRef();
    }

    handleLogin = () => {
        const { handleLogin } = this.props;

        handleLogin(this.emailInput.current.value, this.passwordInput.current.value);
    };

    render() {
        // eslint-disable-next-line react/prop-types
        const { classes } = this.props;
        const { show } = this.props;
        return (
            <Dialog
                aria-labelledby="form-dialog-title"
                open={show}
                onClose={() => {}}
            >
                <DialogTitle id="form-dialog-title">
                    Component
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Email"
                        className={classes.textField}
                        inputRef={this.emailInput}
                        InputLabelProps={{ shrink: true }}
                        type="email"
                        id="email"
                        defaultValue=""
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        className={classes.textField}
                        inputRef={this.passwordInput}
                        InputLabelProps={{ shrink: true }}
                        type="password"
                        id="password"
                        defaultValue=""
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleLogin} color="primary">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

AuthDialog.propTypes = {
    show: PropTypes.bool.isRequired,
    handleLogin: PropTypes.func.isRequired,
};

export default withStyles(styles)(AuthDialog);
