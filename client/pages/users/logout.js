'use strict'

import React from 'react'

import { Loading } from 'components/Partials';

import UserActions from 'actions/users/UserActions';
import Store from 'actions/Store';

class Logout extends React.Component {

  componentWillMount() {

    UserActions.logoutUser(this.props.history)

  }

  render() {

    return (
      <Loading />
    )
  }
}

export default Logout
