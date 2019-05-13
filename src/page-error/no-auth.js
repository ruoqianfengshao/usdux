import React from 'react'

function NoAuth({ location }) {
  return (
    <div>
      <h3>
        No auth for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

export default NoAuth