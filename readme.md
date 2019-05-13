# usdux

fast build SPA application with MPA store

- ✅ Build-in page and global store
- ✅ Hocs and hooks to access store
- ✅ Support redux middlewares
- ✅ Plugins execute when application start
- ✅ Integration react-router and allow jsonify router config
- ✅ Build-in error-boundary and allow customize
- ✅ Build-in routerError page and allow customize
- [todo] Build-in auth page logic
- [todo] support React suspence and lazy import
- [todo] support ssr

## Use

```
npm i usdux -S
```

write following code in `index.js`

```js
import App from 'usdux'
import logger from 'redux-logger'

App({
  routerConfig: {
    staticRouters: [{
      prefix: '/center',
      layout: (props) => <div {...props}/>,
      title: 'hhh',
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