import * as React from 'react'
import { LoadingIcon } from '../atoms/LoadingIcon'

export const Loading: React.FC = () => {
  return (
    <>
      <div text="dark:white" className="flex absolute inset-0" justify="center">
        <main className="flex items-center container" justify="center" flex="col">
          <LoadingIcon />
        </main>
      </div>
    </>
  )
}
