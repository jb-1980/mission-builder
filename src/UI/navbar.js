import React from "react"
import { css } from "emotion"
import { Link } from "@reach/router"
import { useOutsideClick } from "../hooks"
import { useUser } from "../contexts/user-context"

import { colors } from "./colors"

export const Navbar = ({ menuOpen, setMenuOpen }) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const { user, signout } = useUser()

  const container = React.useRef()

  useOutsideClick(container, setDropdownOpen)

  const dropdownStyle = css`
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 100;
    min-width: 160px;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
    @media (max-width: 768px) {
      width: 100%;
    }
  `

  const navDropdownItemstyle = css`
    font-size: 15px;
    color: ${colors.primary};
    padding: 10px 20px;
    width: 100%;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      color: ${colors.primary};
      background: #eee;
      text-decoration: none;
    }

    @media (max-width: 768px) {
      text-align: center;
    }
  `
  const navbarToggleStyle = css`
    padding: 9px 10px;
    margin-right: 15px;
    margin-bottom: 8px;
    font-size: 15px;
    color: #fff;
    background: transparent;
    border: none;
    cursor: pointer;
  `

  const toggleSmall = css`
    ${navbarToggleStyle};
    @media (min-width: 768px) {
      display: none;
    }
  `

  const toggleLarge = css`
    ${navbarToggleStyle};
    @media (max-width: 768px) {
      display: none;
    }
  `

  const hamburger = css`
    width: 20px;
    margin: 3px 0px;
  `
  return (
    <div
      className={css`
        border: 0;
        position: fixed;
        top: 0;
        right: 0;
        z-index: 1980;
        height: 40px;
        width: inherit;
        color: #fff;
        background: ${colors.primary};
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        @media (max-width: 768px) {
          justify-content: space-between;
          height: inherit;
        }
      `}
    >
      <button
        className={css`
          margin: 0px 2px;
          font-size: 25px;
          color: #fff;
          background: transparent;
          border: none;
          cursor: pointer;
          align-self: flex-start;
          height: 100%;
          min-width: 35px;
        `}
        onClick={() => setMenuOpen(state => !state)}
      >
        {menuOpen ? (
          "🠬"
        ) : (
          <>
            <hr className={hamburger} />
            <hr className={hamburger} />
            <hr className={hamburger} />
          </>
        )}
      </button>
      <div
        className={css`
          display: flex;
          flex-direction: row;
          @media (max-width: 768px) {
            flex-direction: column;
          }
        `}
      >
        <Link style={{ textDecoration: "none", color: "#fff" }} to="/">
          Mission Builder
        </Link>
      </div>

      <div
        className={css`
          align-self: flex-start;

          @media (min-width: 768px) {
            margin-left: auto;
          }
        `}
        ref={container}
      >
        <button
          type="button"
          className={toggleSmall}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {dropdownOpen ? "▲" : "▼"}
        </button>
        <button
          type="button"
          className={toggleLarge}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {user.nickname}
          {dropdownOpen ? "▲" : "▼"}
        </button>
        {dropdownOpen && (
          <div className={dropdownStyle}>
            <div className={navDropdownItemstyle} onClick={signout}>
              logout
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
