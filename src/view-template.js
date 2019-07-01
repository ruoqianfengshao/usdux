import React from 'react'

export default (props) => {
  const {
    _page_: {
      head: {
        meta, lang = 'en', title, base,
      },
    }, children,
  } = props
  return (
    <html lang={lang}>
      <head>
        <title>{title}</title>
        {
          Object.keys(meta).map((n) => {
            return <meta name={n} content={meta[n]} />
          })
        }
        <base {...base} />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
