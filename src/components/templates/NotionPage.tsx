import React, { useEffect, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import cs from 'classnames'
import { useRouter } from 'next/router'
import { useSearchParam } from 'react-use'
import BodyClassName from 'react-body-classname'
import useDarkMode from 'use-dark-mode'
import { PageBlock } from 'notion-types'
import { NotionRenderer, Code, Collection, CollectionRow, Equation } from 'react-notion-x'

// utils
import { getBlockTitle } from 'notion-utils'

import { mapPageUrl, getCanonicalPageUrl } from 'lib/map-page-url'
import { mapNotionImageUrl } from 'lib/map-image-url'
import { getPageDescription } from 'lib/get-page-description'
import { searchNotion } from 'lib/search-notion'
import * as config from 'lib/config'

// components
import { NotionCustomFont } from '../molecules/NotionCustomFont'
import { Loading } from '../molecules/Loading'
import { NotionError } from '@/components/organisms/NotionError'
import { PageHead } from '../organisms/PageHead'
import Footer from '@/components/molecules/Footer'

import type { PageProps } from 'lib/types'

const Modal = dynamic(() => import('react-notion-x').then(notion => notion.Modal), { ssr: false })

// Main
export const NotionPage: React.FC<PageProps> = ({ site, recordMap, error, pageId }) => {
  const router = useRouter()
  const lite = useSearchParam('lite')

  // lite mode is for oembed
  const params: { lite?: string } = {}
  if (lite) params.lite = lite
  const isLiteMode = lite === 'true'

  // Theme
  const searchParams = new URLSearchParams(params)
  function resetTheme(mode: 'light' | 'dark') {
    const notion = document.querySelector('.notion') as HTMLElement
    const target = notion ? notion : document.body
    for (const root of [document.body, target]) {
      root.classList.remove('light')
      root.classList.remove('dark')
      root.classList.remove('light-mode')
      root.classList.remove('dark-mode')
    }
    for (const root of [document.body, target]) {
      root.classList.add(mode)
      root.classList.add(`${mode}-mode`)
    }
  }
  const themeChange = (isDark?: boolean) => (isDark ? resetTheme('dark') : resetTheme('light'))

  const darkMode = useDarkMode(false, {
    classNameDark: 'dark',
    classNameLight: 'light',
  })
  useEffect(() => themeChange(darkMode.value), [darkMode])

  const themeColor = useMemo(() => (darkMode.value ? '#2F3437' : '#fff'), [darkMode])
  useEffect(() => {
    document.body.style.background = themeColor
  }, [themeColor])

  if (router.isFallback) return <Loading />
  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value
  if (error || !site || !keys.length || !block)
    return <NotionError darkMode={darkMode.value} site={site} pageId={pageId} error={error} />

  const title = getBlockTitle(block, recordMap!) || site.name

  if (!config.isServer) {
    const g = window as any
    g.pageId = pageId
    g.recordMap = recordMap
    g.block = block
  }

  const siteMapPageUrl = mapPageUrl(site, recordMap!, searchParams)

  const canonicalPageUrl = !config.isDev && getCanonicalPageUrl(site, recordMap!)(pageId)
  const isBlogPost = block.type === 'page' && block.parent_table === 'collection'
  const minTableOfContentsItems = 3

  const imageURL = (block as PageBlock).format?.page_cover || config.defaultPageCover
  const socialImage = imageURL ? mapNotionImageUrl(imageURL, block) : null

  const socialDescription = getPageDescription(block, recordMap!) ?? config.description

  let comments: React.ReactNode = null
  let pageAside: React.ReactChild | null = null

  if (config.giscusRepo) comments = <></>

  const pageLink = ({
    href,
    as,
    passHref,
    prefetch,
    replace,
    scroll,
    shallow,
    locale,
    ...props
  }: {
    href: string
    as: URL
    passHref?: boolean
    prefetch?: boolean
    replace?: boolean
    scroll?: boolean
    shallow?: boolean
    locale?: string
  }) => (
    <Link
      href={href}
      as={as}
      passHref={passHref}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      locale={locale}>
      <a {...props} />
    </Link>
  )

  return (
    <>
      <PageHead site={site} darkMode={darkMode.value} />
      <Head>
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content={site.name} />
        <meta name="twitter:title" content={title} />
        <meta property="twitter:domain" content={site.domain} />
        {config.twitter && <meta name="twitter:creator" content={`@${config.twitter}`} />}
        {socialDescription && (
          <>
            <meta name="description" content={socialDescription} />
            <meta property="og:description" content={socialDescription} />
            <meta name="twitter:description" content={socialDescription} />
          </>
        )}
        {socialImage ? (
          <>
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={socialImage} />
            <meta property="og:image" content={socialImage} />
          </>
        ) : (
          <meta name="twitter:card" content="summary" />
        )}
        {canonicalPageUrl && (
          <>
            <link rel="canonical" href={canonicalPageUrl} />
            <meta property="og:url" content={canonicalPageUrl} />
            <meta property="twitter:url" content={canonicalPageUrl} />
          </>
        )}
        <title>{title}</title>
      </Head>
      <NotionCustomFont site={site} />
      {isLiteMode && <BodyClassName className="notion-lite" />}
      <NotionRenderer
        bodyClassName={cs(pageId === site.rootNotionPageId && 'index-page')}
        components={{
          pageLink,
          code: Code,
          collection: Collection,
          collectionRow: CollectionRow,
          modal: Modal,
          equation: Equation,
        }}
        recordMap={recordMap!}
        rootPageId={site.rootNotionPageId}
        fullPage={!isLiteMode}
        darkMode={darkMode.value}
        previewImages={site.previewImages !== false}
        showCollectionViewDropdown={false}
        showTableOfContents={isBlogPost}
        minTableOfContentsItems={minTableOfContentsItems}
        defaultPageIcon={config.defaultPageIcon}
        defaultPageCover={config.defaultPageCover}
        defaultPageCoverPosition={config.defaultPageCoverPosition}
        mapPageUrl={siteMapPageUrl}
        mapImageUrl={mapNotionImageUrl}
        searchNotion={searchNotion}
        pageFooter={comments}
        pageAside={pageAside}
        footer={<Footer isDarkMode={darkMode.value} toggleDarkMode={darkMode.toggle} />}
      />
    </>
  )
}
