import React from 'react'
import { StaticRouter, Switch, Route } from 'react-router-dom'
import { PageProvider, useStore } from '../src/store'
import {
  pathResolve, LoginLayout, AuthRoute,
} from '../src/router'
import defaultNoMatch from '../src/page-error/no-match'
import defaultErrorBoundary from '../src/error-boundary'

export default ({
  location, context, storeData, ...props
}) => {
  const {
    routerConfig,
    checkLogin,
    checkAuth,
  } = props
  const {
    staticRouters,
    loginUrl,
    pageError = {},
  } = routerConfig

  const NoMatch = pageError.noMatch || defaultNoMatch
  const ErrorFallback = pageError.fallback || defaultErrorBoundary

  return (
    <PageProvider source="server" createStore={useStore}>
      <StaticRouter location={location} context={context}>
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
      </StaticRouter>
    </PageProvider>
  )
}
