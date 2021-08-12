import { useState, useEffect } from 'react'
import { setCookie, parseCookies } from 'nookies'

function usePersistedState(key: string, initialState: Object) {
  const [state, setState] = useState(() => {
    // const storageValue = window.localStorage.getItem(key)
    const { [key]: storageValue } = parseCookies()

    if (storageValue) {
      return JSON.parse(storageValue)
    }

    return initialState
  })

  useEffect(() => {
    // window.localStorage.setItem(key, JSON.stringify(state))
    setCookie(undefined, key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

export default usePersistedState
