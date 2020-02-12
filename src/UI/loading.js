import React from "react"
import { AtomSpinner } from "./spinners/atom"

export const Loading = ({ message, style, ...props }) => {
  const [paint, setPaint] = React.useState(false)

  React.useEffect(() => {
    const timeoutId = setTimeout(() => setPaint(true), 100)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    paint && (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          ...style,
        }}
        {...props}
      >
        <h3>{message}</h3>
        <AtomSpinner />
      </div>
    )
  )
}
