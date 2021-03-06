import React from 'react'

export default class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError () {
    return { hasError: true }
  }

  componentDidCatch (error, info) {
    this.setState({ hasError: true })
    console.error(`Page Error: ${info.componentStack}`)
  }

  render () {
    const { hasError } = this.state
    const { children } = this.props
    if (hasError) {
      // You can render any custom fallback UI
      return <h1>The page has something wrong!</h1>
    }

    return children
  }
}
