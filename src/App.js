import React from "react"
import { css } from "emotion"
import "./App.css"
import { Dashboard } from "./UI/dashboard"
import { Loading } from "./UI/loading"
import { colors } from "./UI/colors"
import { btnPrimary } from "./UI/btn-css"
import { useUser } from "./contexts/user-context"

function App() {
  const { user, verifying } = useUser()

  if (verifying) {
    return <Loading message="Verifying user..." />
  } else if (user === null || user.authenticated === false) {
    return (
      <div
        className={css`
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${colors.primary};
        `}
      >
        <div
          className={css`
            width: 400px;
            height: 200px;
            background: #fff;
            display: flex;
            flex-direction: column;
            padding: 20px;
            align-items: center;
            border-radius: 7px;
            justify-content: space-evenly;
          `}
        >
          <h1>Mission Control</h1>
          <a
            className={css`
              ${btnPrimary};
              text-decoration: none;
              text-transform: uppercase;
            `}
            href="/login"
          >
            Authenticate with Khan Academy
          </a>
        </div>
      </div>
    )
  } else {
    return <Dashboard />
  }
}

export default App
