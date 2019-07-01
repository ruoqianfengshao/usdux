// import React from 'react'
import config from './config'
import usdux from '../../src'

usdux({
  ...config,
  plugins: {
    getUser: async ({ store }) => {
      const a = new Promise((resolve) => {
        resolve(store.initStore({ _global_: { _user_: { id: 2 } } }))
      })
      await a
    },
  },
  root: document.getElementById('app'),
})
