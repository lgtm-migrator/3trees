import React from 'react'
import { Head, Html, Main, NextScript } from 'next/document'

const noflash = `
;(function () {
  // Change these if you use something different in your hook.
  var storageKey = 'darkMode'
  var classNameDark = 'dark'
  var classNameLight = 'light'
  var suffix = '-mode'

  function setClassOnDocumentBody(darkMode) {
    document.body.classList.add(darkMode ? classNameDark : classNameLight)
    document.body.classList.add(darkMode ? classNameDark + suffix : classNameLight + suffix)
    document.body.classList.remove(darkMode ? classNameLight : classNameDark)
    document.body.classList.remove(darkMode ? classNameLight + suffix : classNameDark + suffix)
  }

  var preferDarkQuery = '(prefers-color-scheme: dark)'
  var mql = window.matchMedia(preferDarkQuery)
  var supportsColorSchemeQuery = mql.media === preferDarkQuery
  var localStorageTheme = null
  try {
    localStorageTheme = localStorage.getItem(storageKey)
  } catch (err) {}
  var localStorageExists = localStorageTheme !== null
  if (localStorageExists) {
    localStorageTheme = JSON.parse(localStorageTheme)
  }

  // Determine the source of truth
  if (localStorageExists) {
    // source of truth from localStorage
    setClassOnDocumentBody(localStorageTheme)
  } else if (supportsColorSchemeQuery) {
    // source of truth from system
    setClassOnDocumentBody(mql.matches)
    localStorage.setItem(storageKey, String(mql.matches))
  } else {
    // source of truth from document.body
    var isDarkMode = document.body.classList.contains(classNameDark)
    localStorage.setItem(storageKey, JSON.stringify(isDarkMode))
  }
})()
`

const Document = () => {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        <link rel="manifest" href="/manifest.json" />

        <meta content="/mstile-70x70.png" name="msapplication-square70x70" />
        <meta content="/mstile-144x144.png" name="msapplication-square144x144" />
        <meta content="/mstile-150x150.png" name="msapplication-square150x150" />
        <meta content="/mstile-310x150.png" name="msapplication-wide310x150" />
        <meta content="/mstile-310x310.png" name="msapplication-square310x310" />
        <link href="/apple-touch-icon-57x57.png" rel="apple-touch-icon" sizes="57x57" />
        <link href="/apple-touch-icon-60x60.png" rel="apple-touch-icon" sizes="60x60" />
        <link href="/apple-touch-icon-72x72.png" rel="apple-touch-icon" sizes="72x72" />
        <link href="/apple-touch-icon-76x76.png" rel="apple-touch-icon" sizes="76x76" />
        <link href="/apple-touch-icon-114x114.png" rel="apple-touch-icon" sizes="114x114" />
        <link href="/apple-touch-icon-120x120.png" rel="apple-touch-icon" sizes="120x120" />
        <link href="/apple-touch-icon-144x144.png" rel="apple-touch-icon" sizes="144x144" />
        <link href="/apple-touch-icon-152x152.png" rel="apple-touch-icon" sizes="152x152" />
        <link href="/apple-touch-icon-167x167.png" rel="apple-touch-icon" sizes="167x167" />
        <link href="/apple-touch-icon-180x180.png" rel="icon" sizes="180x180" type="image/png" />
        <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
      </Head>

      <body>
        <script dangerouslySetInnerHTML={{ __html: noflash }}></script>
        <Main />
        <NextScript />
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "2a669fe98f2743749ff5c52292cd54c1"}'></script>
      </body>
    </Html>
  )
}

export default Document
