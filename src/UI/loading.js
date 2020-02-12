import React from "react"
import { AtomSpinner } from "./atom"

export const Loading = ({ message, style }) => {
  const [paint, setPaint] = React.useState(false)

  React.useEffect(() => {
    let timeout
    if (!paint) {
      timeout = setTimeout(setPaint, 500, true)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [paint])
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        ...style,
      }}
    >
      <h3>{message}</h3>
      <AtomSpinner />
    </div>
  )
}
