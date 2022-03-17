import crypto from 'crypto'
import got from 'got'
import pMap from 'p-map'

import { api, isPreviewImageSupportEnabled } from './config'
import { db, images as imagedb } from './db'

import type { PreviewImage, PreviewImageMap } from './types'

function sha256(input: Buffer | string) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input)
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

export async function getPreviewImages(images: string[]): Promise<PreviewImageMap> {
  if (!isPreviewImageSupportEnabled) return {}

  const imageDocRefs = images.map(url => {
    const id = sha256(url)
    return imagedb.doc(id)
  })

  if (!imageDocRefs.length) return {}

  const imageDocs = await db.getAll(...imageDocRefs)
  const results = await pMap(imageDocs, async (model, index) => {
    if (model.exists) {
      return model.data() as PreviewImage
    } else {
      const json = { url: images[index], id: model.id }
      // TODO: should we fire and forget here to speed up builds?
      return got.post(api.createPreviewImage, { json }).json() as Promise<PreviewImage>
    }
  })

  return results
    .filter(Boolean)
    .filter(image => !image.error)
    .reduce((acc, result) => ({ ...acc, [result.url]: result }), {})
}
