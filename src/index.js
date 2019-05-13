import React from 'react'
import ReactDOM from 'react-dom'
import router from './router'
import plugin from './plugin'
import store from './store'

const defaultOptions = {
  routerConfig: {

  }
}

export default (options = {}) => {
  const opts = { ...defaultOptions, ...options }
  const { layout, Router = router, root = document.getElementById('root')} = opts

  // plugin config, once execute at start
  plugin.usePlugin(opts.plugins)

  // execption config

  // auth config

  // i18n config

  // store config, middlewares execute every dispatch
  store.useMiddleware(opts.middlewares)

  // ssr config

  // router config, and render page after error, 404, 403, 401 validate
  ReactDOM.render(<Router routerConfig={opts.routerConfig} />, root);

}