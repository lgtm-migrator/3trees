import { Firestore } from '@google-cloud/firestore'
import {
  isPreviewImageSupportEnabled,
  googleProjectId,
  googleApplicationCredentials,
  firebaseCollectionImages,
} from './config'
import type { CollectionReference } from '@google-cloud/firestore'

export let db: Firestore
export let images: CollectionReference

if (isPreviewImageSupportEnabled) {
  db = new Firestore({
    projectId: googleProjectId,
    credentials: googleApplicationCredentials,
  })
  images = db.collection(firebaseCollectionImages)
}
