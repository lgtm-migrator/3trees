import fetch from 'isomorphic-unfetch'
import pMemoize from 'p-memoize'

import { api } from './config'
import type { SearchParams, SearchResults } from 'notion-types'

export const searchNotion = pMemoize(searchNotionImpl, { maxAge: 10000 })

async function searchNotionImpl(params: SearchParams): Promise<SearchResults> {
  return fetch(api.searchNotion, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { 'content-type': 'application/json' },
  })
    .then(res => {
      if (res.ok) return res

      // convert non-2xx HTTP responses into errors
      const error: Error & { response?: Response } = new Error(res.statusText)
      error.response = res
      return Promise.reject(error)
    })
    .then(res => res.json())
}
