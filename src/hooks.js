import React from "react"

export const useOutsideClick = (ref, clickHandler) => {
  const onOutsideClick = e => {
    if (!ref.current || ref.current.contains(e.target)) {
      return null
    }
    return clickHandler(false)
  }

  React.useEffect(() => {
    document.addEventListener("click", onOutsideClick)
    document.addEventListener("touchstart", onOutsideClick)
    return () => {
      document.removeEventListener("click", onOutsideClick)
      document.removeEventListener("touchstart", onOutsideClick)
    }
  })
}
