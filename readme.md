# Usdux

<div style="text-align: center; margin: 20px;">
  <img src="./icon.png" width="30%">
</div>

A **frontend business framework**，build-in common develop feature for fast build application,
Build SPA application with MPA store, no redux but compat middlewares, the global store apply with React.createContext

- ✅ Build-in page and global store
- ✅ Hocs and hooks to access store
- ✅ Support redux middlewares
- ✅ Plugins execute when application start
- ✅ Integration react-router and allow jsonify router config
- ✅ Build-in error-boundary and allow customize
- ✅ Build-in routerError page and allow customize
- ✅ Build-in auth page logic
- ✅ support simple ssr, one router only allow one component with async request
- [todo] Build-in key title description with router
- [todo] support React suspence and lazy import in server

## Install

```shell
npm i usdux -S
```

## Usage

### quick start

write following code in `index.js` which starts application

```js
import App from 'usdux'

App({
  routerConfig: {
    staticRouters: [{
      prefix: '/center',
      layout: (props) => props.children,
      title: 'example 1',
      routers: [{
        title: 'home',
        component: () => <div>hello world!</div>,
        path: '/1'
      }]
    }]
  },
})
```

#### Class Component

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

#### Functional Component

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

### Dispatch middlewares

In theory, compat redux-chunk middewares :）

### Options

``` js
{
  checkLogin: 'function',
  checkAuth: 'function',
  routerConfig: {
    loginUrl: 'string',
    getDynamicRouters: 'function',
    pageError: {
      fallback: 'ReactNode || stirng',
      noMatch: 'ReactNode || string',
      noAuth: 'ReactNode || string',
    },
    staticRouters: [{
      layout: 'ReactNode || string',
      loginUrl: 'string',
      prefix: 'string',
      title: 'string',
      needLogin: 'boolean',
      pageError: {
        fallback: 'ReactNode || stirng',
        noMatch: 'ReactNode || string',
        noAuth: 'ReactNode || string',
      },
      routers: [{
        title: 'string',
        authKey: 'string',
        path: 'string || array',
        needAuth: 'boolean',
        component: 'ReactNode || string',
      }],
    }]
  }

}
```