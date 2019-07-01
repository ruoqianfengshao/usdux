import React, { useEffect, useState } from 'react'
import {
  BrowserRouter, Route, Switch, Redirect,
} from 'react-router-dom'
import { createBrowserHistory } from 'history'
import defaultErrorBoundary from './error-boundary'
import { useStore, PageProvider } from './store'
import defaultNoMatch from './page-error/no-match'
import defaultNoAuth from './page-error/no-auth'

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
  }, [])

  return props.children
}

/**
 *  routerConfig 数据结构
 *  {
 *    checkLogin: function,
 *    checkAuth: function,
 *    getDynamicRouters: function,
 *    pageError: {
 *      noMatch: ReactNode || string,
 *      noAuth: ReactNode || string,
 *      noLogin:  ReactNode || string,
 *    },
 *    staticRouters: [{
 *      layout: ReactNode || string,
 *      prefix: string,
 *      title: string,
 *      needLogin: boolean,
 *      pageError: {
 *        fallback: ReactNode || stirng,
 *        noMatch: ReactNode || string,
 *        noAuth: ReactNode || string,
 *      },
 *      routers: [{
 *        title: string,
 *        authKey: string,
 *        path: string || array,
 *        needAuth: boolean,
 *        component: ReactNode || string,
 *      }],
 *    }]
 *  }
 *
 */


export const pathResolve = (path, prefix = '/') => {
  if (path.indexOf(prefix) === 0) {
    return path
  }

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

  return prefix + path
}

export const flatRouter = (routerConfig) => {
  const { staticRouters } = routerConfig
  const arr = []
  staticRouters.forEach((i) => {
    const { prefix } = i
    i.routers.forEach((r) => {
      arr.push({
        path: pathResolve(r.path, prefix),
        component: r.component,
      })
    })
  })

  return arr
}

export const LoginLayout = ({
  component: Component, checkLogin, loginUrl, frame, needLogin, ...restProps
}) => {
  const [state] = useStore()

  return (
    <Route
      {...restProps}
      render={(props) => {
        if ((needLogin === true && checkLogin(state)) || !needLogin) {
          return (<Component {...props} />)
        }

        const { staticContext } = props
        if (staticContext) {
          Object.assign(staticContext, { status: 401 })
        }

        return (
          <Redirect
            from={props.location.pathname}
            to={{
              pathname: loginUrl,
              state: { from: props.location },
            }}
          />
        )
      }}
    />
  )
}

export const AuthRoute = ({
  component: Component, checkAuth, route, pageError, needAuth, ...restProps
}) => {
  const [state] = useStore()
  const NoAuth = route.noAuth || pageError.noAuth || defaultNoAuth
  const routeAuth = route.needAuth === undefined ? needAuth : route.needAuth

  return (
    <Route
      {...restProps}
      render={(props) => {
        return (
          (routeAuth && checkAuth(state, route)) || !routeAuth
            ? <Component {...props} />
            : <NoAuth {...props} />
        )
      }}
    />
  )
}

const router = (props) => {
  const history = createBrowserHistory()
  const {
    routerConfig,
    checkLogin,
    checkAuth,
  } = props
  const {
    // getDynamicRouters,
    staticRouters,
    loginUrl,
    pageError = {},
    // routerUpdateInterval = 15 * 60 * 1000,
  } = routerConfig
  // const { dynamicRouters, setDynamicRouters } = useState([])
  const NoMatch = pageError.noMatch || defaultNoMatch
  const ErrorFallback = pageError.fallback || defaultErrorBoundary

  // useEffect(() => {
  //   if (getDynamicRouters instanceof Function) {
  //     setInterval(getDynamicRouters(props).then(data => setDynamicRouters(data)), routerUpdateInterval)
  //   }
  // })

  return (
    <PageProvider createStore={useStore}>
      <BrowserRouter>
        <PageRouter history={history}>
          <Switch>
            {
              staticRouters.map((frame, i) => {
                const framePageError = frame.pageError || {}
                const ErrorPage = framePageError.fallback || ErrorFallback
                const Layout = frame.layout || React.Fragment
                const {
                  prefix = '/', title = 'layout', routers = [], needAuth = false, needLogin = false,
                } = frame

                return (
                  <LoginLayout
                    key={`layout-${i}`}
                    path={prefix || '/'}
                    loginUrl={frame.loginUrl || loginUrl || '/login'}
                    checkLogin={checkLogin}
                    needLogin={needLogin}
                    frame={frame}
                    component={() => (
                      <Layout key={`static-router-${title}-${i}`}>
                        <ErrorPage>
                          <Switch>
                            {
                              routers.map((r) => {
                                const path = r.path instanceof Array ? r.path.map(p => pathResolve(p, prefix)) : pathResolve(r.path, prefix)

                                return (
                                  <AuthRoute
                                    exact
                                    checkAuth={checkAuth}
                                    pageError={framePageError}
                                    key={path}
                                    route={r}
                                    needAuth={needAuth}
                                    path={path}
                                    component={r.component}
                                  />
                                )
                              })
                            }
                            {
                              <Route key={`${frame.prefix}-no-match`} path={frame.prefix} component={framePageError.noMatch || NoMatch} />
                            }
                          </Switch>
                        </ErrorPage>
                      </Layout>
                    )}
                  />
                )
              })
            }
            <Route component={NoMatch} key="global-no-match" />
          </Switch>
        </PageRouter>
      </BrowserRouter>
    </PageProvider>
  )
}

export default router
