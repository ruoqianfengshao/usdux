import React from 'react'
import { renderToString } from 'react-dom/server'
import store from '../../src/store'
import { flatRouter } from '../../src/router'
import Router from '../../server/router'
import viewTemplate from '../src/view-template'

export const renderWithHttp = async (opts, res, req, context = {}) => {
  const routers = flatRouter(opts.routerConfig)
  const router = routers.filter(i => i.path === req.url)[0]

  const _DATA_ = await router.component.fetchData()
  store.initStore({ _DATA_ })
  store.initContext()

  const html = await renderToString((
    <Router key="usdux-server-root"
      context={{ source: 'server' }}
      location={req.url}
      {...opts}
    />
  ))

  if (context.url) {
    res.writeHead(301, {
      Location: context.url,
    })
    res.end()
  } else {
    res.write(`
      <!doctype html>
      <div id="app">${html}</div>
      <script>window._USDUX_STORE_=${JSON.stringify({ _DATA_ })}</script>
      <script src="main.js"></script>
    `)
    res.end()
  }
}

export const renderWithHerd = (ctx) => {
  ctx.render()
}
