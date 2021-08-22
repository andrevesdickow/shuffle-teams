import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { setCookie, parseCookies } from 'nookies'

function usePersistedTheme(key: string, initialState: string): [string, Dispatch<SetStateAction<string>>] {
  const [state, setState] = useState(() => {
    const { [key]: storageValue } = parseCookies()

    if (storageValue) {
      return storageValue
    }

    return initialState
  })

  useEffect(() => {
    setCookie(undefined, key, state)
  }, [key, state])

  return [state, setState]
}

export default usePersistedTheme
