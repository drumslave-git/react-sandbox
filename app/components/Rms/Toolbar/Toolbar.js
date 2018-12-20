import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';

const styles = () => ({
    button: {
        width: 60,
        height: 60,
    },
});

class Toolbar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { q: '' };
        this.timeout = null;
    }

    updateQuery = (q) => {
        const { updateSearchQuery, type } = this.props;
        this.setState({ q });
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            updateSearchQuery(type, q);
        }, 300);
    };

    expandAll = () => {
        const { expandToggle, type } = this.props;
        expandToggle(type, true);
    };

    expandNone = () => {
        const { expandToggle, type } = this.props;
        expandToggle(type, false);
    };

    selectPrevMatch = () => {
        const { selectPrevMatch, type } = this.props;
        selectPrevMatch(type);
    };

    selectNextMatch = () => {
        const { selectNextMatch, type } = this.props;
        selectNextMatch(type);
    };

    render() {
        // eslint-disable-next-line react/prop-types
        const { classes } = this.props;
        const {
            searchFocusIndex,
            searchFoundCount,
        } = this.props;
        const { q } = this.state;
        return (
            <div>
                <form
                    style={{ display: 'inline-block' }}
                    onSubmit={event => event.preventDefault()}
                >
                    <FormGroup row>
                        <IconButton onClick={this.expandAll} className={classes.button}>
                            <UnfoldMoreIcon />
                        </IconButton>
                        <IconButton onClick={this.expandNone} className={classes.button}>
                            <UnfoldLessIcon />
                        </IconButton>
                        <TextField
                            id="find-box"
                            placeholder="Search"
                            value={q}
                            onChange={event => this.updateQuery(event.target.value)}
                            margin="normal"
                        />
                        <IconButton
                            disabled={!searchFoundCount}
                            onClick={this.selectPrevMatch}
                            className={classes.button}
                        >
                            <ArrowLeftIcon />
                        </IconButton>
                        <IconButton
                            disabled={!searchFoundCount}
                            onClick={this.selectNextMatch}
                            className={classes.button}
                        >
                            <ArrowRightIcon />
                        </IconButton>
                        <TextField
                            value={
                                `${searchFoundCount > 0 ? searchFocusIndex + 1 : 0}/${searchFoundCount || 0}`
                            }
                            disabled
                            onChange={() => {}}
                            margin="normal"
                        />
                    </FormGroup>
                </form>
            </div>
        );
    }
}

Toolbar.defaultProps = {
    searchFoundCount: null,
};

Toolbar.propTypes = {
    expandToggle: PropTypes.func.isRequired,
    selectPrevMatch: PropTypes.func.isRequired,
    selectNextMatch: PropTypes.func.isRequired,
    updateSearchQuery: PropTypes.func.isRequired,
    searchFocusIndex: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    searchFoundCount: PropTypes.number,
};

export default withStyles(styles)(Toolbar);
