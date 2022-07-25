import * as React from 'react'
import { DefaultSeo, SocialProfileJsonLd } from 'next-seo'
import Head from 'next/head'
import NProgress from 'nprogress'
import Router from 'next/router'

import siteConfig from '~/site-config'
import { GA4 } from '@/components/atoms/GA4'

import 'windi.css'
import 'katex/dist/katex.min.css'
import 'react-notion-x/src/styles.css'

import 'prismjs'

import '@/styles/global.css'
import '@/styles/nprogress.css'
import '@/styles/notion.css'
import '@/styles/prism-theme.css'

import type { AppProps } from 'next/app'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function App({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <DefaultSeo canonical={siteConfig.url + router.asPath} />
      <SocialProfileJsonLd
        type="Organization"
        name={siteConfig.title}
        url={siteConfig.url}
        sameAs={Object.values(siteConfig.socials)}
      />
      {/* @ts-ignore */}
      <Component {...pageProps} />
      <GA4 id="G-9T961HYDTR" />
    </>
  )
}

export default App
