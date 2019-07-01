import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from '../../src/store'
import getInitialData from '../../src/get-initial'

const getData = () => new Promise((resolve) => { resolve({ id: 1 }) })

export default @getInitialData(getData) @connect class One extends React.Component {
  render () {
    let { _DATA_: { id } } = this.props

    return (
      <div>
        <Link to="/1">{`to /${id}`}</Link>
      </div>
    )
  }
}
