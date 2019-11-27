import React from "react"

const DataContext = React.createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_DATA_SUCCESS":
      return { data: action.data, loading: false, error: null, updating: false }
    case "FETCH_DATA_ERROR":
      return {
        data: null,
        loading: false,
        error: action.error,
        updating: false,
      }

    case "UPDATE_DATA_BEGIN":
      return { data: null, loading: false, error: null, updating: true }
    case "UPDATE_DATA_SUCCESS":
      return { data: action.data, loading: false, error: null, updating: false }
    case "UPDATE_DATA_ERROR":
      return {
        data: null,
        loading: false,
        error: action.error,
        updating: false,
      }

    default:
      return state
  }
}

const DataProvider = props => {
  const [data, dispatch] = React.useReducer(reducer, {
    data: null,
    loading: true,
    error: null,
    updating: false,
  })

  React.useEffect(() => {
    let isCurrent = true
    if (isCurrent && data.loading) {
      fetch("/api/get/data", { credentials: "include" })
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
        .then(data => dispatch({ type: "FETCH_DATA_SUCCESS", data }))
        .catch(err => dispatch({ type: "FETCH_DATA_ERROR", error: err }))
    }

    return () => {
      isCurrent = false
    }
  }, [data])

  const updateData = () => {
    dispatch({ type: "UPDATE_DATA_BEGIN" })
    fetch("/api/update/data", { method: "put", credentials: "include" })
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
      .then(data => dispatch({ type: "UPDATE_DATA_SUCCESS", data }))
      .catch(err => dispatch({ type: "UPDATE_DATA_ERROR", error: err }))
  }
  return (
    <DataContext.Provider value={{ ...data, updateData }}>
      {props.children}
    </DataContext.Provider>
  )
}

const useData = () => {
  const data = React.useContext(DataContext)

  if (data === undefined) {
    throw new Error(`useUser must be used within a DataProvider`)
  }
  return data
}

export { useData, DataProvider }
