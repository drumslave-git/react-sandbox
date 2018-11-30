import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import TimeTable from './TimeTable';
import { convertTime, convertTimeInverse } from '../../helper';
import ReportGroup from './ReportGroup';

function calcTime(source) {
    const state = {
        totalHours: source.TimeEntries.reduce((acc, entry) => acc + entry.hours, 0),
        totalWorked: (source.totalWorked !== undefined ? source.totalWorked : '8h00min'),
    };
    const totalLeft = convertTimeInverse(state.totalWorked) - state.totalHours;
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(totalLeft)) {
        state.totalLeft = totalLeft;
    }
    return state;
}

class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = calcTime(props);
    }

    componentWillReceiveProps(nextProps) {
        const { state = {} } = this;
        const source = {
            ...state,
            ...nextProps,
        };
        this.setState(calcTime(source));
    }

    handleWorkedTimeChange(value) {
        const { TimeEntries } = this.props;
        this.setState(calcTime({
            TimeEntries,
            totalWorked: value,
        }));
    }

    render() {
        const {
            classes,
            issuesGrouping,
            reports,
            TimeEntries,
            isIdInGrouping,
            forRedmine,
            toggleIssueID,
            toggleForRedmine,
            addNote,
            autoComplete,
            updateReportGroup,
        } = this.props;
        const { totalHours, totalWorked, totalLeft } = this.state;
        const handleForRedmineChange = ({ target: { checked } }) => toggleForRedmine(checked);
        return (
            <div>
                {TimeEntries.length > 0 && (
                    <Paper className={classes.root}>
                        <FormGroup row>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    type="text"
                                    readOnly
                                    value={issuesGrouping.join(', ')}
                                    label="Issues grouping"
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    type="text"
                                    readOnly
                                    value={convertTime(totalHours)}
                                    label="Total"
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    type="text"
                                    onChange={
                                        ({
                                            target:
                                                 { value },
                                        }) => this.handleWorkedTimeChange(value)
                                    }
                                    value={totalWorked}
                                    label="Worked"
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    type="text"
                                    readOnly
                                    value={convertTime(totalLeft)}
                                    label="Left"
                                />
                            </FormControl>
                        </FormGroup>
                        <div>
                            <TimeTable
                                TimeEntries={TimeEntries}
                                isIdInGrouping={isIdInGrouping}
                                toggleIssueID={toggleIssueID}
                            />
                        </div>
                    </Paper>
                )}
                {reports && Object.keys(reports.groups).length > 0
                && (
                    <Paper className={classes.root}>
                        <FormGroup row>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    type="text"
                                    readOnly
                                    value={reports.totals.humanTime}
                                    label="Total"
                                />
                            </FormControl>
                            <FormControlLabel
                                control={
                                    (
                                        <Switch
                                            checked={forRedmine}
                                            onChange={handleForRedmineChange}
                                            color="primary"
                                        />
                                    )
                                }
                                label="For Redmine"
                            />
                        </FormGroup>
                        {Object.keys(reports.groups).map((key) => {
                            const group = reports.groups[key];
                            const { isIt } = isIdInGrouping(Number(key));
                            return (
                                <ReportGroup
                                    classes={classes}
                                    group={group}
                                    id={key}
                                    isIt={isIt}
                                    forRedmine={forRedmine}
                                    addNote={addNote}
                                    autoComplete={autoComplete}
                                    updateReportGroup={updateReportGroup}
                                />
                            );
                        })}
                    </Paper>
                )}
            </div>
        );
    }
}

Report.defaultProps = {
    reports: null,
};

Report.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    classes: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    issuesGrouping: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    reports: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    TimeEntries: PropTypes.array.isRequired,
    forRedmine: PropTypes.bool.isRequired,
    isIdInGrouping: PropTypes.func.isRequired,
    toggleIssueID: PropTypes.func.isRequired,
    toggleForRedmine: PropTypes.func.isRequired,
    addNote: PropTypes.func.isRequired,
    autoComplete: PropTypes.func.isRequired,
    updateReportGroup: PropTypes.func.isRequired,
};

export default Report;
