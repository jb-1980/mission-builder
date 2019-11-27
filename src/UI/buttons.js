import React from "react"
import { css } from "emotion"
import { FaPlus, FaTrash } from "react-icons/fa"

import { btnPrimary, btnPrimaryOutline } from "./btn-css"

export const ButtonPrimary = ({ children, ...props }) => (
  <button className={btnPrimary} {...props}>
    {children}
  </button>
)

export const ButtonPrimaryOutline = ({ children, ...props }) => (
  <button className={btnPrimaryOutline} {...props}>
    {children}
  </button>
)

export const ButtonAdd = props => (
  <button
    className={css`
      ${btnPrimaryOutline};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
    `}
    {...props}
  >
    <FaPlus />
  </button>
)

export const ButtonTrash = props => (
  <button
    className={css`
      ${btnPrimaryOutline};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
    `}
    {...props}
  >
    <FaTrash />
  </button>
)
