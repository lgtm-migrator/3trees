import React, { useEffect, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import cs from 'classnames'
import { useRouter } from 'next/router'
import { useSearchParam } from 'react-use'
import BodyClassName from 'react-body-classname'
import useDarkMode from 'use-dark-mode'
import { NotionRenderer, Breadcrumbs } from 'react-notion-x'
import { getBlockTitle, getPageProperty, parsePageId } from 'notion-utils'

// Utils
import { GiscusFoot } from '@/components/organisms/GiscusFoot'
import { NotionPageHeader } from '@/components/organisms/NotionPageHeader'
import { mapPageUrl, getCanonicalPageUrl } from 'lib/map-page-url'
import { mapImageUrl } from 'lib/map-image-url'
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

// Components
import { bgColor } from '~/site-config'
import { NotionCustomFont } from '../molecules/NotionCustomFont'
import { Loading } from '../molecules/Loading'
import { NotionError } from '@/components/organisms/NotionError'
import { PageHead } from '../organisms/PageHead'
import { Footer } from '@/components/molecules/Footer'

import type { PageBlock } from 'notion-types'
import type { PageProps } from 'lib/types'

// @ts-ignore
const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(async m => {
    await Promise.all([
      // @ts-ignore
      import('prismjs/components/prism-markup.js'),
      // @ts-ignore
      import('prismjs/components/prism-bash.js'),
      // @ts-ignore
      import('prismjs/components/prism-c.js'),
      // @ts-ignore
      import('prismjs/components/prism-cpp.js'),
      // @ts-ignore
      import('prismjs/components/prism-csharp.js'),
      // @ts-ignore
      import('prismjs/components/prism-docker.js'),
      // @ts-ignore
      import('prismjs/components/prism-java.js'),
      // @ts-ignore
      import('prismjs/components/prism-javascript.js'),
      // @ts-ignore
      import('prismjs/components/prism-typescript.js'),
      // @ts-ignore
      import('prismjs/components/prism-git.js'),
      // @ts-ignore
      import('prismjs/components/prism-go.js'),
      // @ts-ignore
      import('prismjs/components/prism-graphql.js'),
      // @ts-ignore
      import('prismjs/components/prism-makefile.js'),
      // @ts-ignore
      import('prismjs/components/prism-markdown.js'),
      // @ts-ignore
      import('prismjs/components/prism-objectivec.js'),
      // @ts-ignore
      import('prismjs/components/prism-ocaml.js'),
      // @ts-ignore
      import('prismjs/components/prism-python.js'),
      // @ts-ignore
      import('prismjs/components/prism-rust.js'),
      // @ts-ignore
      import('prismjs/components/prism-sass.js'),
      // @ts-ignore
      import('prismjs/components/prism-scss.js'),
      // @ts-ignore
      import('prismjs/components/prism-solidity.js'),
      // @ts-ignore
      import('prismjs/components/prism-sql.js'),
      // @ts-ignore
      import('prismjs/components/prism-stylus.js'),
      // @ts-ignore
      import('prismjs/components/prism-swift.js'),
      // @ts-ignore
      import('prismjs/components/prism-wasm.js'),
      // @ts-ignore
      import('prismjs/components/prism-yaml.js'),
    ])
    return m.Code
  })
)

// @ts-ignore
const Collection = dynamic(() => import('react-notion-x/build/third-party/collection').then(m => m.Collection))
// @ts-ignore
const Equation = dynamic(() => import('react-notion-x/build/third-party/equation').then(m => m.Equation))
const Modal = dynamic(
  () =>
    import('react-notion-x/build/third-party/modal').then(m => {
      m.Modal.setAppElement('.notion-viewport')
      return m.Modal
    }),
  {
    ssr: false,
  }
)

const formatDate = (input: string | number, { month = 'short' }: { month?: 'long' | 'short' } = {}) => {
  const date = new Date(input)
  const monthLocale = date.toLocaleString('en-US', { month })
  return `${date.getUTCFullYear()} ${monthLocale} ${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}`
}

// @ts-ignore
const propertyLastEditedTimeValue = ({ block, pageHeader }, defaultFn: () => React.ReactNode) => {
  if (pageHeader && block?.last_edited_time)
    return `Edited ${formatDate(block?.last_edited_time, {
      month: 'short',
    })}`

  return defaultFn()
}
// @ts-ignore
const propertyCreatedTimeValue = ({ block, pageHeader }, defaultFn: () => React.ReactNode) => {
  if (pageHeader && block?.created_time)
    return `Created ${formatDate(block?.created_time, {
      month: 'short',
    })}`

  return defaultFn()
}

// @ts-ignore
const propertyTextValue = ({ schema, pageHeader, block }, defaultFn: () => React.ReactNode) => {
  console.debug(schema, pageHeader, block)
  if (pageHeader && schema?.name?.toLowerCase() === 'author') return <b>{defaultFn()}</b>
  return defaultFn()
}

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

  // Components
  const components = useMemo(
    () => ({
      nextImage: Image,
      nextLink: Link,
      Code,
      Collection,
      Equation,
      Modal,
      Header: NotionPageHeader,
      propertyLastEditedTimeValue,
      propertyTextValue,
      propertyCreatedTimeValue,
    }),
    []
  )

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
  const canonicalPageUrl = isDev ? undefined : getCanonicalPageUrl(site, recordMap)(pageId)
  const isBlogPost = block.type === 'page' && block.parent_table === 'collection'
  const minTableOfContentsItems = 3

  const socialImage = mapImageUrl(
    getPageProperty<string>('Social Image', block, recordMap) || (block as PageBlock).format?.page_cover || description,
    block
  )
  const socialDescription = getPageProperty<string>('Description', block, recordMap) || description

  // Components
  let comments: React.ReactNode = null
  const pageAside: React.ReactChild | null = null
  if (giscusRepo)
    comments = (
      <>
        <GiscusFoot pageId={pageId} darkMode={darkMode.value} />
        {pageId === parsePageId(site.rootNotionPageId) ? (
          <></>
        ) : (
          <header className="notion-header">
            <Breadcrumbs block={block} rootOnly={false} />
          </header>
        )}
      </>
    )

  return (
    <>
      <PageHead
        pageId={pageId as string}
        site={site}
        title={title}
        darkMode={darkMode.value}
        description={socialDescription}
        image={socialImage}
        url={canonicalPageUrl}
      />
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
        bodyClassName={cs(pageId === parsePageId(site.rootNotionPageId) && 'index-page')}
        components={components}
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
        mapImageUrl={mapImageUrl}
        searchNotion={searchNotion}
        pageFooter={comments}
        pageAside={pageAside}
        footer={<Footer isDarkMode={darkMode.value} toggleDarkMode={darkMode.toggle} />}
      />
    </>
  )
}
