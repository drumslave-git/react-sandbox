import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Paper from '@material-ui/core/Paper';

function Filter(props) {
    const {
        classes,
        period,
        dateFrom,
        dateTo,
        changeDate,
    } = props;
    return (
        <Paper className={classes.root}>
            <FormControl component="fieldset">
                <FormLabel component="legend">Filtration</FormLabel>
                <FormGroup row>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="age-native-simple">Period</InputLabel>
                        <Select
                            native
                            value={period}
                            onChange={({ target: { value } }) => changeDate('period', value)}
                            inputProps={{
                                name: 'period',
                                id: 'period-native-simple',
                            }}
                        >
                            <option value="range">range</option>
                            <option value="today">today</option>
                            <option value="yesterday">yesterday</option>
                            {/* <option value="current_week">this week</option>
                                        <option value="last_week">last week</option>
                                        <option value="last_2_weeks">last 2 weeks</option>
                                        <option value="7_days">last 7 days</option>
                                        <option value="current_month">this month</option>
                                        <option value="last_month">last month</option>
                                        <option value="30_days">last 30 days</option>
                                        <option value="current_year">this year</option> */}
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <TextField
                            type="date"
                            label="Date From"
                            value={dateFrom}
                            onChange={({ target: { value } }) => changeDate('dateFrom', value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <TextField
                            type="date"
                            label="Date To"
                            value={dateTo}
                            onChange={({ target: { value } }) => changeDate('dateTo', value)}
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

Filter.propTypes = {
// eslint-disable-next-line react/forbid-prop-types
    classes: PropTypes.object.isRequired,
    period: PropTypes.string.isRequired,
    dateFrom: PropTypes.string.isRequired,
    dateTo: PropTypes.string.isRequired,
    changeDate: PropTypes.func.isRequired,
};

export default Filter;
