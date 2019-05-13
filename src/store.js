import React, {useEffect, useState, useContext} from 'react'
import useEnhancedReducer from './enhanced-reducer'

const initialStore = {
  _global_: {},
  _page_: {},
}

const store = {
  useMiddleware(middlewares) {
    this.middlewares = [...this.middlewares, ...[].concat(middlewares)]
  },
  initStore(state = {}){
    this.initialState = {...initialStore, ...state}
  },
  initialState: initialStore,
  middlewares: [],
}

const StoreContext = React.createContext(store.initialState)

export const useStore = () => {
  return useEnhancedReducer(reducer, useContext(StoreContext), store.middlewares)
}

export const PageProvider = (props) => {
  const [context, dispatch] = useStore()
  return <StoreContext.Provider value={{...context, dispatch}}>{props.children}</StoreContext.Provider>
}

// default store reducer for operation global and page
export const reducer = (state, action) => {
  switch(action.type) {
    case 'setGlobal':
      return {...state, _global_: {...state._global_, ...action.payload}}
    case 'resetGlobal':
      return {...state, _global_: {}}
    case 'setPage':
      return {...state, _page_: {...state._page_, ...action.payload}}
    case 'resetPage':
      return {...state, _page_: {}}
    default:
      throw new Error(
        `action: '${action.type}' not defined,
        the store only accept action type: 'setGloabl', 'resetGlobal', 'setPage', 'resetPage'`
      )
  }
}

export const connect = WrappedComponent => {
  return class ConnectClass extends React.Component {
    render () {
      return (
        <StoreContext.Consumer>
          {
            (state) => <WrappedComponent {...state} {...this.props} />
          }
        </StoreContext.Consumer>
      )
    }
  }
}

export default store