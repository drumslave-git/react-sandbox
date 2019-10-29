import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
// import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const styles = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

function Notify(props) {
    const {
        classes,
        snack,
        handleCloseSnack,
    } = props;

    const Icon = variantIcon[snack.variant];

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={snack.show}
            autoHideDuration={6000}
            onClose={handleCloseSnack}
        >
            <SnackbarContent
                className={classNames(classes[snack.variant], classes.margin)}
                aria-describedby="client-snackbar"
                message={(
                    <span id="client-snackbar" className={classes.message}>
                        <Icon className={classNames(classes.icon, classes.iconVariant)} />
                        { snack.text }
                    </span>
                )}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        className={classes.close}
                        onClick={handleCloseSnack}
                    >
                        <CloseIcon className={classes.icon} />
                    </IconButton>,
                ]}
            />
        </Snackbar>
    );
}

Notify.propTypes = {
// eslint-disable-next-line react/forbid-prop-types
    classes: PropTypes.object.isRequired,
    snack: PropTypes.shape({
        show: PropTypes.bool,
        text: PropTypes.string,
        variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
    }).isRequired,
    handleCloseSnack: PropTypes.func.isRequired,
};

export default withStyles(styles)(Notify);
