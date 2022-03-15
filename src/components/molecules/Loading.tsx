import * as React from 'react'
import { LoadingIcon } from '../atoms/LoadingIcon'
import Footer from '@/components/molecules/Footer'
import useDarkMode from 'use-dark-mode'

export const Loading: React.FC = () => {
  const darkMode = useDarkMode(false, {
    classNameDark: 'dark',
    classNameLight: 'light',
    onChange: isDark => {
      if (isDark) {
        document.body.classList.remove('light')
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
        document.body.classList.add('light')
      }
    },
  })

  return (
    <div text="dark:white" className="flex absolute inset-0" justify="center">
      <main className="flex items-center" justify="center" flex="col">
        <LoadingIcon />
      </main>
      <Footer isDarkMode={darkMode.value} toggleDarkMode={darkMode.toggle} />
    </div>
  )
}
