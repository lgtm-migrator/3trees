import { NextApiRequest, NextApiResponse } from 'next'

import { rootNotionPageId } from '~/lib/config'
import { search } from '~/lib/notion'
import type { SearchParams } from 'notion-types'

const searchNotion = async (req: NextApiRequest, res: NextApiResponse) => {
  console.debug('Search')
  if (req.method !== 'POST') return res.status(405).send({ error: 'method not allowed' })
  const searchParams: SearchParams = req.body
  searchParams.ancestorId = rootNotionPageId
  console.debug('lambda search-notion', searchParams)
  const results = await search(searchParams)
  results.results.map(result => (result.isNavigable = true))
  res.setHeader('Cache-Control', 'public, s-maxage=60, max-age=60, stale-while-revalidate=60')
  res.status(200).json(results)
}

export default searchNotion
