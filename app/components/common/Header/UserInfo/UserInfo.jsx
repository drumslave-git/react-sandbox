import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import AppBar from '@material-ui/core/AppBar';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const styles = theme => ({
    userInfo: {
        flexGrow: 1,
    },
    userNameIcon: {
        display: 'inline-block',
        verticalAlign: 'middle',
        marginLeft: theme.spacing.unit,
        color: grey[50],
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
});

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            anchorEl: null,
        };
    }

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleMenu = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    doLogout = () => {
        const { doLogout } = this.props;
        this.handleClose();
        doLogout();
    };

    changeUserInfo(part, data) {
        this.setState({ [part]: data });
    }

    render() {
        const {
            loading,
            user,
            classes,
            doLogin,
            title,
        } = this.props;
        const { username, password, anchorEl } = this.state;
        const open = Boolean(anchorEl);
        return (
            <div className={classes.userInfo}>
                <AppBar
                    position="static"
                    color={(user && user.id ? 'primary' : 'default')}
                >
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            {title || 'Photos'}
                        </Typography>
                        {user && user.id && (
                            <div>
                                <IconButton
                                    aria-owns={open ? 'menu-appbar' : null}
                                    aria-haspopup="true"
                                    onClick={this.handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={open}
                                    onClose={this.handleClose}
                                >
                                    <MenuItem
                                        onClick={this.handleClose}
                                        component="a"
                                        href="https://redmine.enaikoon.de/my/page"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {user.firstname} {user.lastname}
                                    </MenuItem>
                                    <MenuItem onClick={() => this.openConfigs()}>Configs</MenuItem>
                                    <MenuItem onClick={this.doLogout}>Logout</MenuItem>
                                </Menu>
                            </div>
                        )}
                        {!user && loading
                        && (
                            <Typography varinat="h5" component="h3">
                                Loading...
                            </Typography>
                        )}
                        {!user && !loading
                        && (
                            <FormGroup row>
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        type="text"
                                        label="user name"
                                        value={username}
                                        onChange={({ target: { value } }) => this.changeUserInfo('username', value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        type="password"
                                        label="password"
                                        value={password}
                                        onChange={({ target: { value } }) => this.changeUserInfo('password', value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </FormControl>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={() => doLogin({ username, password })}
                                >
                                    Login
                                </Button>
                            </FormGroup>
                        )}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}
UserInfo.defaultProps = {
    user: null,
    title: '',
};
UserInfo.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    doLogin: PropTypes.func.isRequired,
    doLogout: PropTypes.func.isRequired,
    title: PropTypes.string,
    user: PropTypes.shape({
        id: PropTypes.number,
        firstname: PropTypes.string,
        lastname: PropTypes.string,
    }),
};
export default withStyles(styles)(UserInfo);
