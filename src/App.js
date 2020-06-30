import React from "react"
import { css } from "emotion"
import { navigate } from "@reach/router"
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
    return <Login />
  } else {
    return <Dashboard />
  }
}

export const Login = () => {
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")

  const { login, error } = useUser()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ username, password })
    login(username, password)
    navigate("/", { replace: true })
  }
  return (
    <div
      className={css`
        display: flex;
        width: 100vw;
        height: 100vh;
        justify-content: center;
        align-items: center;
        background: ${colors.primary};
      `}
    >
      <form
        className={css`
          display: flex;
          flex-direction: column;
          background: white;
          width: 300px;
          height: 350px;
          padding: 5px;
          justify-content: start;
          align-items: center;
          border-radius: 5px;
        `}
        onSubmit={handleSubmit}
      >
        <h1 style={{ color: colors.primary, marginBottom: 0 }}>
          Mission Builder
        </h1>
        <h5 style={{ color: colors.darkText, margin: "10px 0" }}>
          Login with Khan Academy credentials
        </h5>
        <div
          className={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          `}
        >
          {error && (
            <div
              style={{
                color: colors.warning,
              }}
            >
              {error}
            </div>
          )}
          <div className={loginInputGroup}>
            <input
              className={loginInput}
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <span className={bar} />
            <label className={loginLabel}>Username</label>
          </div>
          <div className={loginInputGroup}>
            <input
              className={loginInput}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className={bar} />
            <label className={loginLabel}>Password</label>
          </div>
          <input
            className={css`
              margin: 10px;
              width: 70px;
              height: 30px;
              background: ${colors.primary};
              color: #fff;
              border: none;
              border-radius: 5px;
            `}
            type="submit"
            value="Log in"
          />
        </div>
      </form>
    </div>
  )
}

const loginLabel = css`
  color: #c6c6c6;
  font-size: 16px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  top: 10px;
  transition: 300ms ease all;
`

const loginInputGroup = css`
  position: relative;
  margin: 15px 0;
`

const bar = css`
  position: relative;
  display: block;
  width: initial;

  &:before {
    content: "";
    height: 2px;
    width: 0;
    bottom: 0px;
    position: absolute;
    background: ${colors.primary};
    transition: 300ms ease all;
    left: 0%;
  }
`

const loginInput = css`
  background: none;
  color: #c6c6c6;
  font-size: 18px;
  padding: 10px 10px 10px 5px;
  display: block;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #c6c6c6;

  &:focus {
    outline: none;
  }
  &:focus ~ label,
  &:valid ~ label {
    top: -14px;
    font-size: 12px;
    color: ${colors.primary};
  }
  &:focus ~ span:before,
  &:valid ~ span:before {
    width: 100%;
  }
`

export default App
