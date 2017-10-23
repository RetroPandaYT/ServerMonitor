import { EventEmitter } from 'events'
import ActionDispatcher from 'actions/ActionDispatcher'
import Immutable from 'immutable'

let state = {
  loaded: false
}

let events = new EventEmitter();

let setState = (stateChange, replace) => {

  if(replace){

    delete state[replace]

  }

  state = Immutable.fromJS(state).mergeDeep(stateChange).toJS();

  events.emit('CHANGE');

};

let Store = {
  getState () {
    return state
  },
  addChangeListener (fn) {
    events.addListener('CHANGE', fn)
  },
  removeChangeListener (fn){
    events.removeListener('CHANGE', fn)
  }

}

Store.dispatchToken = ActionDispatcher.register((action) => {

  console.log(action.type)

  setState(
    action.stateChange,
    action.replace
  )


})

export default Store
