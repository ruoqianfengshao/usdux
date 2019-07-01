import React, { useEffect, useState } from 'react'

const getInitialData = (service, transfer = data => data) => (WrappedComponent) => {
  // Hoc for class component
  if (WrappedComponent.prototype instanceof React.Component || WrappedComponent.prototype instanceof React.PureComponent) {
    class DataComponent extends React.Component {
      state = {
        data: {},
      }

      // client execute once
      componentDidMount () {
        service().then(data => transfer(data)).then((data) => {
          this.setState({ data })
        })
      }

      render () {
        const { data } = this.state
        if (Object.keys(data).length !== 0) {
          return <WrappedComponent {...this.props} _DATA_={data} />
        }
        return <WrappedComponent {...this.props} />
      }
    }

    DataComponent.fetchData = () => {
      return service().then(data => transfer(data)).then((data) => {
        return Promise.resolve(data)
      })
    }

    return DataComponent
  }

  // Hof for functional component
  const DataFunctionalComponent = (props) => {
    const [state, setState] = useState({ data: {} })

    // client execute once
    useEffect(() => {
      service().then(data => transfer(data)).then((data) => {
        setState({ data })
      })
    }, [])

    const { data } = state
    if (Object.keys(data).length !== 0) {
      return <WrappedComponent {...props} _DATA_={data} />
    }
    return <WrappedComponent {...props} />
  }

  DataFunctionalComponent.fetchData = () => {
    return service().then(data => transfer(data)).then((data) => {
      return Promise.resolve(data)
    })
  }

  return DataFunctionalComponent
}

export default getInitialData
