import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../src/store'
import getInitialData from '../../src/get-initial'
import One from './app'

const login = () => 'login page'

const Two = getInitialData(() => new Promise((resolve, reject) => {
  return resolve({ id: 3 })
}))(() => {
  const [state, dispatch] = useStore()
  return (
    <div>
    <Link to="/">
    to /
    {state._DATA_.id}
    </Link>
    </div>
  )
})

export default {
  checkLogin: state => false,
  checkAuth: (state, route) => false,
  routerConfig: {
    staticRouters: [{
      prefix: '/login',
      routers: [{
        path: '/',
        component: login,
      }],
    }, {
      routers: [{
        path: '/',
        authKey: 'one',
        component: One,
      }, {
        path: '/1',
        authKey: 'two',
        component: Two,
      }],
    }],
  },
}
