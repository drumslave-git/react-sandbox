import React from 'react';
import UserInfo from './UserInfo';

function Header(props) {
    const {
        user,
        classes,
        loading,
        doLogin,
        doLogout,
        title,
    } = props;
    return (
        <UserInfo
            user={user}
            title={title}
            classes={classes}
            loading={loading}
            doLogin={doLogin}
            doLogout={doLogout}
        />
    );
}

Header.propTypes = { ...UserInfo.propTypes };

export default Header;
