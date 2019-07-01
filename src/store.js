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
  initContext () { this.context = React.createContext(this.initialState) },
  context: React.createContext(),
}

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
  return useEnhancedReducer(reducer, useContext(store.context), store.middlewares)
}

// Hoc to access context
export const connect = (WrappedComponent) => {
  return class ConnectClass extends React.Component {
    render () {
      const StoreConsumer = store.context.Consumer
      return (
        <StoreConsumer>
          {
            state => <WrappedComponent {...state} {...this.props} />
          }
        </StoreConsumer>
      )
    }
  }
}

// Global Context Provider
export const PageProvider = ({ children }) => {
  const StoreProvider = store.context.Provider
  const [state, dispatch] = useStore()

  return <StoreProvider value={{ ...state, dispatch }}>{children}</StoreProvider>
}

export default store
