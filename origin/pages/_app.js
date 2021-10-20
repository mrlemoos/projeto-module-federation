import Head from 'next/head'
import React from 'react'
import '../src/styles/global.css'

const _App = ({ Component, pageProps }) => (
  <>
    <Head>
      <script src='http://localhost:3002/web/remoteEntry.js' />
    </Head>
    <Component {...pageProps} />
  </>
)

globalThis.React = React

export default _App
