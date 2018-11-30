import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';

import { styles } from '../../consts';

function Actions(props) {
    const {
        classes,
        loading,
        TimeEntries,
        getTime,
        getReports,
        user,
    } = props;
    const actionsAvailable = !loading && user && user.id;
    if (actionsAvailable) {
        return (
            <div className={classes.fabIcons}>
                <Tooltip title="Get Time" placement="left">
                    <div>
                        <Button
                            onClick={() => getTime()}
                            variant="fab"
                            color="primary"
                            aria-label="Get Time"
                            className={classes.fab}
                        >
                            <Icon>av_timer</Icon>
                        </Button>
                    </div>
                </Tooltip>
                <Tooltip title="Get Report" placement="left">
                    <div>
                        <Button
                            onClick={() => getReports()}
                            variant="fab"
                            color="primary"
                            aria-label="Get Time"
                            disabled={TimeEntries.length === 0}
                            className={classes.fab}
                        >
                            <Icon>assignment</Icon>
                        </Button>
                    </div>
                </Tooltip>
            </div>
        );
    // eslint-disable-next-line no-else-return
    } else {
        return null;
    }
}

Actions.defaultProps = {
    user: null,
};

Actions.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    TimeEntries: PropTypes.array.isRequired,
    user: PropTypes.shape({
        id: PropTypes.number,
        firstname: PropTypes.string,
        lastname: PropTypes.string,
    }),
    getTime: PropTypes.func.isRequired,
    getReports: PropTypes.func.isRequired,
};

export default withStyles(styles)(Actions);
