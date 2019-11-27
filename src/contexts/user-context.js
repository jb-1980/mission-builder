import React from "react"

const UserContext = React.createContext()
const UserProvider = props => {
  const [user, setUser] = React.useState(null)
  const [verifying, setVerifying] = React.useState(true)

  React.useEffect(() => {
    let isCurrent = true
    if (isCurrent && verifying) {
      fetch("/api/user/verify", { credentials: "include" })
        .then(res => {
          const { status } = res

          if (status === 401) {
            throw Error("401")
          } else if (!res.ok) {
            throw Error(res.statusText)
          }
          return res
        })
        .then(res => res.json())
        .then(user => {
          setUser(user)
          setVerifying(false)
        })
        .catch(err => {
          setUser(null)
          setVerifying(false)
          console.error(err)
        })
    }

    return () => {
      isCurrent = false
    }
  }, [verifying])

  const signout = () => {
    fetch("/logout")
      .then(res => {
        if (res.ok) {
          setUser(null)
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <UserContext.Provider value={{ user, setUser, verifying, signout }}>
      {props.children}
    </UserContext.Provider>
  )
}

const useUser = () => {
  const user = React.useContext(UserContext)

  if (user === undefined) {
    throw new Error(`useUser must be used within a UserProvider`)
  }
  return user
}

export { useUser, UserProvider }