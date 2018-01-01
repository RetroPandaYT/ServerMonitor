'use strict'

import 'styles/style.css';
import 'styles/style.scss';

import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import { Loading } from 'components/Partials';

import Bundle from 'components/Bundle'
import Home from 'pages/home'

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route path="/:page/:subPage" component={PageWrapper}/>
      <Route path="/:page" component={PageWrapper}/>
    </Switch>
  </Router>
)
const NotFound  = () => (
  <div className="not_found">Page Not Found</div>
)

const PageOne = (props) => (
  <Bundle load={require('bundle-loader?lazy!./pages/one')}>
    {(Comp) => (Comp
      ? <Comp/>
      : <Loading/>
    )}
  </Bundle>
)

const PageTwo = (props) => (
  <Bundle load={require('bundle-loader?lazy!./pages/two')}>
    {(Comp) => (Comp
      ? <Comp/>
      : <Loading/>
    )}
  </Bundle>
)

class PageWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ImportedPage: Loading
    };
  }

  componentDidMount() {
    this.importPage(this.props.match.params.page, this.props.match.params.subPage);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.page != this.props.match.params.page ||
        nextProps.match.params.subPage != this.props.match.params.subPage) {
      this.importPage(nextProps.match.params.page, nextProps.match.params.subPage);
    }
  }

  importPage(page, subPage) {

    this.setState({"ImportedPage": Loading})
    let path = page
    if (typeof subPage != "undefined") {
      path = page + "/" + subPage
    }

    import(`./pages/${path}`).then(function(mod) {

      if (mod.default) {

        this.setState({"ImportedPage": mod.default})
      } else {

        this.setState({"ImportedPage": NotFound})
      }
    }.bind(this)).catch(function(e) {

      this.setState({"ImportedPage": NotFound})
    }.bind(this));
  }

  render() {
    return (<this.state.ImportedPage {...this.props} />)
  }
}

ReactDOM.render( <App />, document.getElementById('appWrapper'));
