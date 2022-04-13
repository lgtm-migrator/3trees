import React, { useEffect, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import cs from 'classnames'
import { useRouter } from 'next/router'
import { useSearchParam } from 'react-use'
import BodyClassName from 'react-body-classname'
import useDarkMode from 'use-dark-mode'
import { NotionRenderer, Code, Collection, CollectionRow, Equation } from 'react-notion-x'

// utils
import { getBlockTitle } from 'notion-utils'
import { GiscusFoot } from '@/components/organisms/GiscusFoot'
import { mapPageUrl, getCanonicalPageUrl } from 'lib/map-page-url'
import { mapNotionImageUrl } from 'lib/map-image-url'
import { getPageDescription } from 'lib/get-page-description'
import { searchNotion } from 'lib/search-notion'
import {
  isDev,
  defaultPageCover,
  description,
  giscusRepo,
  twitter,
  defaultPageCoverPosition,
  defaultPageIcon,
} from 'lib/config'

// components
import { bgColor } from '~/site-config'
import { NotionCustomFont } from '../molecules/NotionCustomFont'
import { Loading } from '../molecules/Loading'
import { NotionError } from '@/components/organisms/NotionError'
import { PageHead } from '../organisms/PageHead'
import { Footer } from '@/components/molecules/Footer'

import type { PageBlock } from 'notion-types'
import type { PageProps } from 'lib/types'

const Modal = dynamic(() => import('react-notion-x').then(notion => notion.Modal), { ssr: false })

const DARK_CLASS = 'dark'
const LIGHT_CLASS = 'light'
const SUFFIX = '-mode'

export const NotionPage: React.FC<PageProps> = ({ site, recordMap, error, pageId }) => {
  // Theme
  function changeTheme(mode: typeof DARK_CLASS | typeof LIGHT_CLASS) {
    document.body.classList.add(mode, mode + SUFFIX)
    if (mode === DARK_CLASS) document.body.classList.remove(LIGHT_CLASS, LIGHT_CLASS + SUFFIX)
    else if (mode === LIGHT_CLASS) document.body.classList.remove(DARK_CLASS, DARK_CLASS + SUFFIX)
  }
  const themeChange = (isDark?: boolean) => (isDark ? changeTheme(DARK_CLASS) : changeTheme(LIGHT_CLASS))
  const darkMode = useDarkMode(false, {
    classNameDark: DARK_CLASS + SUFFIX,
    classNameLight: LIGHT_CLASS + SUFFIX,
    onChange: themeChange,
  })
  const themeColor = useMemo(() => (darkMode.value ? bgColor.dark : bgColor.light), [darkMode])
  useEffect(() => {
    document.body.style.background = themeColor
  }, [themeColor])

  // Lite
  const lite = useSearchParam('lite')
  const params: { lite?: string } = {}
  if (lite) params.lite = lite
  const isLiteMode = lite === 'true'

  // Loading
  const router = useRouter()
  if (router.isFallback) return <Loading />

  // Error
  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value
  if (error || !site || !keys.length || !block)
    return <NotionError darkMode={darkMode.value} site={site} pageId={pageId} error={error} />

  // Metadatas
  const title = getBlockTitle(block, recordMap) || site.name
  const searchParams = new URLSearchParams(params)
  const siteMapPageUrl = mapPageUrl(site, recordMap, searchParams)
  const canonicalPageUrl = !isDev && getCanonicalPageUrl(site, recordMap)(pageId)
  const isBlogPost = block.type === 'page' && block.parent_table === 'collection'
  const minTableOfContentsItems = 3
  const cover = (block as PageBlock).format?.page_cover
  const socialImage = cover ? mapNotionImageUrl(cover, block) : undefined
  const socialDescription = getPageDescription(block, recordMap) ?? description

  // Components
  let comments: React.ReactNode = null
  const pageAside: React.ReactChild | null = null
  if (giscusRepo) comments = <GiscusFoot pageId={pageId} darkMode={darkMode.value} />

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
        {twitter && <meta name="twitter:creator" content={`@${twitter}`} />}
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
        recordMap={recordMap}
        rootPageId={site.rootNotionPageId}
        fullPage={!isLiteMode}
        darkMode={darkMode.value}
        previewImages={site.previewImages !== false}
        showCollectionViewDropdown={false}
        showTableOfContents={isBlogPost}
        minTableOfContentsItems={minTableOfContentsItems}
        defaultPageIcon={defaultPageIcon}
        defaultPageCover={defaultPageCover}
        defaultPageCoverPosition={defaultPageCoverPosition}
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
