'use strict'

import React from 'react'

import Immutable from 'immutable'

import Store from 'actions/Store'

import Actions from 'actions/monitor/MonitorActions'

import Inconsistent from 'components/helpers/Inconsistent'

import Hint from 'components/Layouts/Hint'

class One extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    //Inconsistent.stabilize()
    const result = Inconsistent.GetPassword(Inconsistent.stabilize())

    //Does "Actions.ini" exist? Is it spelled right?
    Actions.init(
      {
        result
      }
    )

    this.state = Store.getState()
  }

  render() {
    return (
      <div className="page_one">

        <h1>{this.state.result}</h1>

      </div>
    );
  }
}

export default One
