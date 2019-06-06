import React, { useContext } from 'react'
import useEnhancedReducer from './enhanced-reducer'

// Default Store state with base structure
const initialStore = {
  _global_: {
    _user_: {},
    _auth_: {},
  },
  _page_: {},
}

// Dtore object with method and data
const store = {
  useMiddleware (middlewares) {
    this.middlewares = [...this.middlewares, ...[].concat(middlewares)]
  },
  initStore (state = {}) {
    this.initialState = { ...initialStore, ...state }
  },
  initialState: initialStore,
  middlewares: [],
}

// Global context
const StoreContext = React.createContext(store.initialState)

// Default store reducer for operation global and page
const reducer = (state, action) => {
  switch (action.type) {
    case 'setGlobal':
      return { ...state, _global_: { ...state._global_, ...action.payload } }
    case 'resetGlobal':
      return { ...state, _global_: {} }
    case 'setPage':
      return { ...state, _page_: { ...state._page_, ...action.payload } }
    case 'resetPage':
      return { ...state, _page_: {} }
    default:
      throw new Error(
        `action: '${action.type}' not defined,
        the store only accept action type: 'setGloabl', 'resetGlobal', 'setPage', 'resetPage'`
      )
  }
}

// Hooks to access context
export const useStore = () => {
  return useEnhancedReducer(reducer, useContext(StoreContext), store.middlewares)
}

// Hoc to access context
export const connect = (WrappedComponent) => {
  return class ConnectClass extends React.Component {
    render () {
      return (
        <StoreContext.Consumer>
          {
            state => <WrappedComponent {...state} {...this.props} />
          }
        </StoreContext.Consumer>
      )
    }
  }
}

// Global Context Provider
export const PageProvider = ({ children }) => {
  const [context, dispatch] = useStore()
  return <StoreContext.Provider value={{ ...context, dispatch }}>{children}</StoreContext.Provider>
}

export default store
