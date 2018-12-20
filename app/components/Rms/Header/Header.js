import React from 'react';
import PropTypes from 'prop-types';
import SaveIcon from '@material-ui/icons/Save';

class Header extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            draftData: false,
        };
    }

    componentDidMount() {
        const { EE } = this.props;
        if (EE) {
            EE.on('beforeRequest', this.beforeRequest);
            EE.on('afterRequest', this.afterRequest);
        }
    }

    componentWillUnmount() {
        const { EE } = this.props;
        if (EE) {
            EE.removeListener('beforeRequest', this.beforeRequest);
            EE.removeListener('afterRequest', this.afterRequest);
        }
    }

    beforeRequest = () => {
        this.setState({ draftData: true });
    };

    afterRequest = () => {
        this.setState({ draftData: false });
    };

    render() {
        const { draftData } = this.state;
        return (
            <h1>
                RMS
                {draftData && <SaveIcon style={{ color: 'red' }} />}
            </h1>
        );
    }
}

Header.defaultProps = {
    EE: null,
};

Header.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    EE: PropTypes.object,
};

export default Header;
