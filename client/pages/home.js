'use strict'

import React from 'react'

import {Header} from 'components/Layouts';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page_home">
        <Header history={this.props.history} />
        Home

      </div>
    );
  }
}

export default Home
