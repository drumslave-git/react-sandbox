import React from 'react';
import UserInfo from './UserInfo';

function Header(props) {
    const {
        user,
        classes,
        loading,
        doLogin,
        doLogout,
    } = props;
    return (
        <UserInfo
            user={user}
            classes={classes}
            loading={loading}
            doLogin={doLogin}
            doLogout={doLogout}
        />
    );
}

Header.propTypes = { ...UserInfo.propTypes };

export default Header;
