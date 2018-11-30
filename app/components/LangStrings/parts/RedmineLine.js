import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles';

function RedmineLine(props) {
    const {
        text,
        className,
        color,
        en,
        de,
    } = props;
    return (
        <div
            key={text}
            style={styles[className]}
            className={className}
        >
            <span>|</span>
            <span>
                {color}
                {text}
                %
            </span>
            <span>|</span>
            <span>
                {color}
                {en}
                %
            </span>
            <span>|</span>
            {de !== '' && (
                <span>
                    {color}
                    {de}
                    %
                </span>
            )}
            <span>|</span>
        </div>
    );
}

RedmineLine.propTypes = {
    text: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    en: PropTypes.string.isRequired,
    de: PropTypes.string.isRequired,
};

export default RedmineLine;
