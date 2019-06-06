import React, { useEffect, useState } from 'react'
import {
  BrowserRouter, Route, Switch, Redirect,
} from 'react-router-dom'
import { createBrowserHistory } from 'history'
import ErrorBoundary from './error-boundary'
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
  })

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

const LoginLayout = ({
  component: Component, checkLogin, loginUrl, frame, needLogin, ...restProps
}) => {
  const [state] = useStore()

  return (
    <Route
      {...restProps}
      render={props => (
        (needLogin === true && checkLogin(state)) || !needLogin
          ? <Component {...props} />
          : (
            <Redirect to={{
              pathname: loginUrl,
              state: { from: props.location },
            }}
            />
          )
      )}
    />
  )
}

const AuthRoute = ({
  component: Component, checkAuth, route, framePageError, ...restProps
}) => {
  const [state] = useStore()
  const NoAuth = route.noAuth || framePageError.noAuth || defaultNoAuth

  return (
    <Route
      {...restProps}
      render={(props) => {
        return (
          (route.needAuth && checkAuth(state, route)) || !route.needAuth
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
  const ErrorFallback = pageError.fallback || ErrorBoundary

  // useEffect(() => {
  //   if (getDynamicRouters instanceof Function) {
  //     setInterval(getDynamicRouters(props).then(data => setDynamicRouters(data)), routerUpdateInterval)
  //   }
  // })

  return (
    <BrowserRouter>
      <PageProvider>
        <PageRouter history={history}>
          <Switch>
            {
              staticRouters.map((frame, i) => {
                const framePageError = frame.pageError || {}
                const ErrorPage = framePageError.fallback || ErrorFallback
                const Layout = frame.layout || React.Fragment

                return (
                  <LoginLayout
                    key={frame.prefix}
                    path={frame.prefix}
                    loginUrl={frame.loginUrl || loginUrl}
                    checkLogin={checkLogin}
                    frame={frame}
                    component={() => (
                      <Layout key={`static-router-${frame.title || 'router'}-${i}`}>
                        <ErrorPage>
                          <Switch>
                            {
                              frame.routers.map((r) => {
                                const path = r.path instanceof Array ? r.path.map(p => pathResolve(p, frame.prefix)) : pathResolve(r.path, frame.prefix)

                                return (
                                  <AuthRoute
                                    exact
                                    checkAuth={checkAuth}
                                    framePageError={framePageError}
                                    key={path}
                                    route={r}
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
      </PageProvider>
    </BrowserRouter>
  )
}

export default router
