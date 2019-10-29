import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
// import { withStyles } from '@material-ui/core/styles';

import { rmURL } from '../../../consts';
import { convertTime } from '../../../helper';

// const CustomTableCell = withStyles(theme => ({
//     head: {
//         backgroundColor: theme.palette.common.black,
//         color: theme.palette.common.white,
//     },
//     body: {
//         fontSize: 14,
//     },
// }))(TableCell);

const CustomTableCell = TableCell;

function TimeTable(props) {
    const {
        TimeEntries,
        isIdInGrouping,
        toggleIssueID,
    } = props;
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <CustomTableCell>ID</CustomTableCell>
                    <CustomTableCell>Issue ID</CustomTableCell>
                    <CustomTableCell>Issue</CustomTableCell>
                    <CustomTableCell>Spent On</CustomTableCell>
                    <CustomTableCell>Comments</CustomTableCell>
                    <CustomTableCell>Hours</CustomTableCell>
                    <CustomTableCell>Human Hours</CustomTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {TimeEntries.map((timeEntry) => {
                    let buttonColor;
                    const {
                        isIt,
                    } = isIdInGrouping(timeEntry.issue.id);
                    if (isIt) {
                        buttonColor = 'secondary';
                    } else {
                        buttonColor = 'primary';
                    }

                    return (
                        <TableRow key={timeEntry.id}>
                            <CustomTableCell>{timeEntry.id}</CustomTableCell>
                            <CustomTableCell>
                                <Button
                                    variant="contained"
                                    color={buttonColor}
                                    onClick={
                                        () => {
                                            toggleIssueID(timeEntry.issue.id);
                                        }
                                    }
                                >
                                    {timeEntry.issue.id}
                                </Button>
                            </CustomTableCell>
                            <CustomTableCell>
                                <Tooltip
                                    title={timeEntry.issue.description || ''}
                                    enterDelay={1000}
                                >
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={`${rmURL}/issues/${timeEntry.issue.id}`}
                                    >
                                        {timeEntry.issue.subject}
                                    </a>
                                </Tooltip>
                            </CustomTableCell>
                            <CustomTableCell>{timeEntry.spent_on}</CustomTableCell>
                            <CustomTableCell>{timeEntry.comments}</CustomTableCell>
                            <CustomTableCell>{timeEntry.hours}</CustomTableCell>
                            <CustomTableCell>
                                {convertTime(timeEntry.hours)}
                            </CustomTableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

TimeTable.propTypes = {
// eslint-disable-next-line react/forbid-prop-types
    TimeEntries: PropTypes.array.isRequired,
    isIdInGrouping: PropTypes.func.isRequired,
    toggleIssueID: PropTypes.func.isRequired,
};

export default TimeTable;
