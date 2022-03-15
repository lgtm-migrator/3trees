import { PageProps } from './types'

export function pageAcl({ site, recordMap, pageId }: Partial<PageProps>): PageProps | void {
  if (!site)
    return {
      error: {
        statusCode: 404,
        message: 'Unable to resolve notion site',
      },
    }

  if (!recordMap)
    return {
      error: {
        statusCode: 404,
        message: `Unable to resolve page for "${pageId}" not found.`,
      },
    }

  const keys = Object.keys(recordMap.block)
  const rootKey = keys[0]

  if (!rootKey)
    return {
      error: {
        statusCode: 404,
        message: `Unable to resolve page for "${pageId}" invalid data.`,
      },
    }

  const rootValue = recordMap.block[rootKey]?.value
  const rootSpaceId = rootValue?.space_id

  if (rootSpaceId && site.rootNotionSpaceId && rootSpaceId !== site.rootNotionSpaceId)
    if (process.env.NODE_ENV) {
      return {
        error: {
          statusCode: 404,
          message: `Notion page "${pageId}" doesn't belong to the Notion workspace owned by "${site.domain}".`,
        },
      }
    }
}
