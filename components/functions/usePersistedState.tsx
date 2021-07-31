import { useState, useEffect } from 'react'

function usePersistedState(key: string, initialState: Object) {
  const [state, setState] = useState(() => {
    if (typeof window !== 'undefined') {
      const storageValue = window.localStorage.getItem(key)

      if (storageValue) {
        return JSON.parse(storageValue)
      }
    }

    return initialState
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(state))
    }
  }, [key, state])

  return [state, setState]
}

export default usePersistedState
