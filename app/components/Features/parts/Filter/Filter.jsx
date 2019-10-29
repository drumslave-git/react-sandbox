import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Paper from '@material-ui/core/Paper';

function Filter(props) {
    const {
        classes,
        parentId,
        extraFieldId,
        changeParentId,
        changeExtraFieldId,
    } = props;
    return (
        <Paper className={classes.root}>
            <FormControl component="fieldset">
                <FormLabel component="legend">What to sync</FormLabel>
                <FormGroup row>
                    <FormControl className={classes.formControl}>
                        <TextField
                            type="number"
                            label="Issue ID"
                            value={parentId}
                            onChange={({ target: { value } }) => changeParentId(value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <TextField
                            type="number"
                            label="Extra field ID"
                            value={extraFieldId}
                            onChange={({ target: { value } }) => changeExtraFieldId(value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </FormGroup>
            </FormControl>
        </Paper>
    );
}

Filter.defaultProps = {
    parentId: '',
    extraFieldId: '',
};

Filter.propTypes = {
// eslint-disable-next-line react/forbid-prop-types
    classes: PropTypes.object.isRequired,
    parentId: PropTypes.string,
    changeParentId: PropTypes.func.isRequired,
    changeExtraFieldId: PropTypes.func.isRequired,
};

export default Filter;
