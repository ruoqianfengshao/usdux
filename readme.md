# usdux

fast build SPA application with MPA store, no redux but compat middlewares, the global store apply with React.createContext

- ✅ Build-in page and global store
- ✅ Hocs and hooks to access store
- ✅ Support redux middlewares
- ✅ Plugins execute when application start
- ✅ Integration react-router and allow jsonify router config
- ✅ Build-in error-boundary and allow customize
- ✅ Build-in routerError page and allow customize
- [todo] Build-in auth page logic
- [todo] Build-in key title description with router
- [todo] support React suspence and lazy import
- [todo] support ssr

## Use

```shell
npm i usdux -S
```

write following code in `index.js` which starts application

```js
import App from 'usdux'
import logger from 'redux-logger'

App({
  routerConfig: {
    staticRouters: [{
      prefix: '/center',
      layout: (props) => <div {...props}/>,
      title: 'example 1',
      routers: [{
        title: 'asd',
        component: 'home',
        path: '/1'
      },{
        title: '123',
        component: () => <div>dog</div>,
        path: '/2'
      }]
    }]
  },
  middlewares: [
    logger
  ]
})
```

### Class Component

``` js
import React from 'react'
import { connect } from 'usdux'

export default @connect class Component extends React.Component {
  handleClick = () => {
    this.props.dispatch({type: 'setGlobal', payload: {a: 1}})
  }

  render() {
    return (<div>
      <div onClick={this.handleClick}>{JSON.stringify(this.props._global_)}</div>
      <div>{JSON.stringify(this.props._page_)}</div>
    </div>)
  }
}
```

### Functional Component

```js

import React from 'react'
import { useStore } from 'usdux'

export default const Component = () => {
  const [store, dispatch] = useStore()
  const handleClick = () => {
    dispatch({type: 'setPage', payload: {a: 1}})
  }

  return (<div>
      <div>{JSON.stringify(store._global_)}</div>
      <div onClick={handleClick}>{JSON.stringify(store._page_)}</div>
    </div>)
}
```

### Store Action

* `setGlobal` set global state

```js
dispatch({type: 'setGlobal', payload: 'xxx'})
```

* `resetGlobal` reset global state

```js
dispatch({type: 'resetGlobal'})
```

* `setPage`  set page state

```js
dispatch({type: 'setGlobal', payload: 'xxx'})
```

* `resetPage` reset page state

```js
dispatch({type: 'resetPage'})
```

### middlewares

In theory, compat redux-chunk middewares :）