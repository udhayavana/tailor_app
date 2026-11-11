import { useMemo, useState } from 'react'
import AuthContext from './authContext.js'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const value = useMemo(() => ({ token, setToken, user, setUser }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
