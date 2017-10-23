'use strict'

import React from 'react'

import Navigation from 'components/layouts/navigation/Navigation'

class Header extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}

  }

  render() {


    return (
        <div className="header">
          <Navigation history={this.props.history}/>
        </div>
      )

  }

}

export default Header
