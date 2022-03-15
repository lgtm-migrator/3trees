/* eslint-disable */

// Insert this script in your index.html right after the <body> tag.
// This will help to prevent a flash if dark mode is the default.

;(function () {
  // Change these if you use something different in your hook.
  var storageKey = 'darkMode'
  var classNameDark = 'dark'
  var classNameLight = 'light'
  const notion = document.querySelector('.notion')
  const target = notion ? notion : document.body

  function setClass(darkMode) {
    target.classList.remove(darkMode ? classNameLight : classNameDark)
    target.classList.add(darkMode ? classNameDark : classNameLight)
  }

  var preferDarkQuery = '(prefers-color-scheme: dark)'
  var mql = window.matchMedia(preferDarkQuery)
  var supportsColorSchemeQuery = mql.media === preferDarkQuery
  var localStorageTheme = null
  try {
    localStorageTheme = localStorage.getItem(storageKey)
  } catch (err) {}
  var localStorageExists = localStorageTheme !== null
  if (localStorageExists) {
    localStorageTheme = JSON.parse(localStorageTheme)
  }

  // Determine the source of truth
  if (localStorageExists) {
    // source of truth from localStorage
    setClass(localStorageTheme)
  } else if (supportsColorSchemeQuery) {
    // source of truth from system
    setClass(mql.matches)
    localStorage.setItem(storageKey, String(mql.matches))
  } else {
    // source of truth from document.documentElement
    var isDarkMode = target.classList.contains(classNameDark)
    localStorage.setItem(storageKey, JSON.stringify(isDarkMode))
  }
})()
