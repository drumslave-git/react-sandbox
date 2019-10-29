import React from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';

function ReportGroup(props) {
    const {
        classes,
        group,
        id,
        isIt,
        forRedmine,
        addNote,
        autoComplete,
        updateReportGroup,
    } = props;
    return (
        <ExpansionPanel key={id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                    className={classes.heading}
                >
                    {isIt && `#${id} `}
                    {group.name}
                    &nbsp;
                    ({group.humanTime})
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.groupDetails}>
                {Object.keys(group.byDates).map((date) => {
                    const byDate = group.byDates[date];
                    if (!forRedmine) {
                        return (
                            <Card key={date}>
                                <CardContent>
                                    <Typography component="p">
                                        {date} {byDate.humanTime}
                                    </Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Time</TableCell>
                                                {!isIt && (
                                                    <TableCell>Issue ID</TableCell>
                                                )}
                                                <TableCell>Comments</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {byDate.entries.map((entry) => {
                                                return (
                                                    <TableRow>
                                                        <TableCell>
                                                            {entry.humanTime}
                                                        </TableCell>
                                                        {!isIt
                                                            && (
                                                                <TableCell>
                                                                    #{entry.issue.id}
                                                                </TableCell>
                                                            )
                                                        }
                                                        {!isIt
                                                            && (
                                                                <TableCell>
                                                                    #{entry.issue.subject}
                                                                </TableCell>
                                                            )
                                                        }
                                                        <TableCell>
                                                            {entry.comments}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        );
                    }
                    return (
                        <Card key={date}>
                            <CardContent>
                                <FormGroup row>
                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            type="text"
                                            label="issue id"
                                            value={byDate.targetIssueId}
                                            onChange={
                                                ({ target: { value } }) => autoComplete(
                                                    id,
                                                    date,
                                                    value,
                                                )
                                            }
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </FormControl>
                                    <ul>
                                        {byDate.autoCompleteResults.map(res => (
                                            <li key={res.id}>
                                                <Button
                                                    onClick={() => updateReportGroup(
                                                        id,
                                                        date,
                                                        res.id,
                                                        undefined,
                                                        res.title,
                                                    )}
                                                >
                                                    #{res.id} {res.title}
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                    {byDate.issueIdIsTrue && (
                                        <Button
                                            onClick={() => addNote(
                                                byDate.targetIssueId,
                                                byDate.text,
                                            )}
                                        >
                                            Add Note To &nbsp;
                                            <strong>{byDate.issueIdIsTrue}</strong>
                                        </Button>
                                    )}
                                </FormGroup>
                                <TextField
                                    multiline
                                    fullWidth
                                    value={byDate.text}
                                />
                            </CardContent>
                        </Card>
                    );
                })}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

ReportGroup.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    classes: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    group: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    id: PropTypes.string.isRequired,
    forRedmine: PropTypes.bool.isRequired,
    isIt: PropTypes.bool.isRequired,
    addNote: PropTypes.func.isRequired,
    autoComplete: PropTypes.func.isRequired,
    updateReportGroup: PropTypes.func.isRequired,
};

export default ReportGroup;
