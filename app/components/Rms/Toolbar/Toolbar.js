import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';

function Toolbar(props) {
    const {
        expandAll,
        expandNone,
        searchString,
        searchFoundCount,
        selectPrevMatch,
        selectNextMatch,
        searchFocusIndex,
    } = props;
    return (
        <div>
            <IconButton onClick={expandAll}>
                <UnfoldMoreIcon />
            </IconButton>
            <IconButton onClick={expandNone}>
                <UnfoldLessIcon />
            </IconButton>
            <form
                style={{ display: 'inline-block' }}
                onSubmit={event => {
                    event.preventDefault();
                }}
            >
                <input
                    id="find-box"
                    type="text"
                    placeholder="Search..."
                    style={{ fontSize: '1rem' }}
                    value={searchString}
                    onChange={event =>
                        this.setState({ searchString: event.target.value })
                    }
                />

                <button
                    type="button"
                    disabled={!searchFoundCount}
                    onClick={selectPrevMatch}
                >
                    &lt;
                </button>

                <button
                    type="submit"
                    disabled={!searchFoundCount}
                    onClick={selectNextMatch}
                >
                    &gt;
                </button>

                <span>
                    &nbsp;
                    {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
                    &nbsp;/&nbsp;
                    {searchFoundCount || 0}
                </span>
            </form>
        </div>
    );
}

Toolbar.propTypes = {
    expandAll: PropTypes.func.isRequired,
    expandNone: PropTypes.func.isRequired,
    selectPrevMatch: PropTypes.func.isRequired,
    selectNextMatch: PropTypes.func.isRequired,
    searchFocusIndex: PropTypes.func.isRequired,
    searchString: PropTypes.string.isRequired,
    searchFoundCount: PropTypes.number.isRequired,
};

export default Toolbar;
