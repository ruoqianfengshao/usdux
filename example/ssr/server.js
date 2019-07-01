import { createServer } from 'http'
import React from 'react'
import { renderToString } from 'react-dom/server'
import fs from 'fs'
import config from './config'
import store from '../../src/store'
import { flatRouter } from '../../src/router'
import Router from '../../server/router'
import viewTemplate from '../../src/view-template'

const client = fs.readFileSync('/Users/vico/workspace/vico/usdux/example/ssr/dist/main.js')

createServer(async (req, res) => {
  const context = {}

  if (req.url === '/main.js' || req.url === '/main.js.map' || req.url === '/favicon.ico') {
    res.write(client)
    res.end()
    return
  }

  const routers = flatRouter(config.routerConfig)
  const router = routers.filter(i => i.path === req.url)[0]

  const _DATA_ = await router.component.fetchData()
  store.initStore({ _DATA_ })
  store.initContext()

  const html = await renderToString((
    <Router key="usdux-server-root"
      context={{ source: 'server' }}
      location={req.url}
      {...config}
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
      ${viewTemplate()}
      <div id="app">${html}</div>
      <script>window._USDUX_STORE_=${JSON.stringify({ _DATA_ })}</script>
      <script src="main.js"></script>
    `)
    res.end()
  }
}).listen(3001)
