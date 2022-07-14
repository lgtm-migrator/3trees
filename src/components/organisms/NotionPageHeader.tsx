import React, { useEffect } from 'react'

import { Breadcrumbs, Search } from 'react-notion-x'

import * as types from 'lib/types'

export const NotionPageHeader: React.FC<{
  block: types.CollectionViewPageBlock | types.PageBlock
}> = ({ block }) => {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'p') {
        if (e.shiftKey) return
        e.preventDefault()
        const searchBtn = document.querySelector('.notion-search-button') as HTMLElement
        searchBtn.click()
      }
    }
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [])
  return (
    <header className="notion-header" w="!full !max-10/12 !<sm:max-12/12" m="x-auto">
      <div className="notion-nav-header">
        <Breadcrumbs block={block} rootOnly={false} />
        <Search block={block} title={'Search'} />
      </div>
    </header>
  )
}
