import React from "react"

export const Error = ({ message, style }) => (
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
  </div>
)
