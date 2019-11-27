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

let lastURL

export function useScrollToTop() {
  const ref = React.useRef()
  const { current } = ref
  if (current && document.URL !== lastURL) {
    current.scrollIntoView({ alignToTop: true })
    lastURL = document.URL
  }
  return ref
}
