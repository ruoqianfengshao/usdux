import React, { useEffect, useState } from 'react'
import {
  BrowserRouter, Route, Switch,
} from 'react-router-dom'
import loadable from '@loadable/component'
import { createBrowserHistory } from 'history'
import ErrorBoundary from './error-boundary'
import { useStore, PageProvider } from './store'
import defaultNoMatch from './page-error/no-match'
// import DefaultNoAuth from './page-error/no-auth'

export const PageRouter = (props) => {
  const [path, setPath] = useState('')
  const [, dispatch] = useStore()

  useEffect(() => {
    props.history.listen(({ pathname }) => {
      if (path !== pathname) {
        setPath(pathname)
        // TODO 获取 query 数据写入 _page_
        dispatch({ type: 'resetPage' })
      }
    })
  })

  return props.children
}

/**
 *  routerConfig 数据结构
 *  {
 *    getDynamicRouters: function,
 *    ErrorBoundary: ReactNode || stirng,
 *    pageError: {
 *      noMatch: ReactNode || string,
 *      noAuth: ReactNode || string,
 *      noLogin:  ReactNode || string,
 *    },
 *    staticRouters: [{
 *      layout: ReactNode || string,
 *      prefix: string,
 *      title: string,
 *      needAuth: boolean,
 *      pageError: {
 *        noMatch: ReactNode || string,
 *        noAuth: ReactNode || string,
 *        noLogin:  ReactNode || string,
 *      },
 *      routers: [{
 *        title: string,
 *        path: string || array,
 *        needAuth: boolean,
 *        component: ReactNode || string,
 *      }],
 *    }]
 *  }
 *
 */

const pathResolve = (path, prefix) => {
  if (prefix.indexOf('/') === prefix.length - 1) {
    throw new Error(
      `staticRouters' prefix: '${prefix}' can't be ended with '/', please delete '/'`
    )
  }

  if (path.indexOf('/') === -1) {
    throw new Error(
      `path: '${path}' must be started with '/', please add '/'`
    )
  }

  if (path.indexOf(prefix) === 0) {
    return path
  }

  return prefix + path
}

export default (props) => {
  const history = createBrowserHistory()
  const { routerConfig } = props
  const {
    getDynamicRouters, staticRouters, erroWrap, pageError = {}, routerUpdateInterval = 15 * 60 * 1000,
  } = routerConfig
  const { setDynamicRouters } = useState([])
  const NoMatch = pageError.noMatch || defaultNoMatch
  const ErrorWrap = (typeof erroWrap === 'string' ? loadable(() => import(`${process.env.usduxDir.execption}/${erroWrap}`)) : erroWrap) || ErrorBoundary

  useEffect(() => {
    if (getDynamicRouters instanceof Function) {
      setInterval(getDynamicRouters(props).then(data => setDynamicRouters(data)), routerUpdateInterval)
    }
  })

  return (
    <BrowserRouter>
      <PageProvider>
        <PageRouter history={history}>
          <Switch>
            {
              staticRouters.map((frame, i) => {
                const framePageError = frame.pageError || {}
                const Layout = typeof frame.layout === 'string' ? loadable(() => import(`${process.env.usduxDir.layout}/${frame.layout}`)) : frame.layout
                const NoMatchComponent = typeof framePageError.noMatch === 'string' ? loadable(() => import(`./${framePageError.noMatch}`)) : framePageError.noMatch
                return (
                  <Route path={frame.prefix}>
                    <Layout key={`static-router-${frame.title || 'router'}-${i}`}>
                      <ErrorWrap>
                        <Switch>
                          {
                            frame.routers.map((r) => {
                              const component = typeof r.component === 'string' ? loadable(() => import(`${process.env.usduxDir.component}/${r.component}`)) : r.component
                              return (
                                <Route
                                  exact
                                  key={r.title}
                                  component={component}
                                  path={r.path instanceof Array ? r.path.map(p => pathResolve(p, frame.prefix)) : pathResolve(r.path, frame.prefix)}
                                />
                              )
                            })
                          }
                          {
                            <Route path={frame.prefix} component={NoMatchComponent || NoMatch} />
                          }
                        </Switch>
                      </ErrorWrap>
                    </Layout>
                  </Route>
                )
              })
            }
            <Route component={NoMatch} />
          </Switch>
        </PageRouter>
      </PageProvider>
    </BrowserRouter>
  )
}
