import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';

function Toolbar(props) {
    const { expandAll, expandNone } = props;
    return (
        <div>
            <IconButton onClick={expandAll}>
                <UnfoldMoreIcon />
            </IconButton>
            <IconButton onClick={expandNone}>
                <UnfoldLessIcon />
            </IconButton>
        </div>
    );
}

Toolbar.propTypes = {
    expandAll: PropTypes.func.isRequired,
    expandNone: PropTypes.func.isRequired,
};

export default Toolbar;
