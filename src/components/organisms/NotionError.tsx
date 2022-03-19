import Head from 'next/head'
import * as React from 'react'

import { PageHead } from './PageHead'
import { ErrorPage } from '@/components'
import type { PageProps } from 'lib/types'

export const NotionError: React.FC<PageProps & { darkMode: boolean }> = ({ site, error, darkMode }) => {
  const title = error?.message
  return (
    <>
      <PageHead site={site} darkMode={darkMode} />
      <Head>
        <meta property="og:site_name" content={title} />
        <meta property="og:title" content={title} />
        <title>{title}</title>
      </Head>
      <ErrorPage statusCode={error?.statusCode} title={title} subtitle={'Notion Error'} />
    </>
  )
}
