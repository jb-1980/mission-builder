import { css } from "emotion"

import { colors } from "./colors"

export const btn = css`
  cursor: pointer;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
`

export const btnPrimary = css`
  ${btn};
  color: #fff;
  background-color: ${colors.primary};
  border-color: ${colors.primary};
`

export const btnPrimaryOutline = css`
  ${btn};
  color: ${colors.primary};
  border-color: ${colors.primary};
  background-color: #fff;
  &:hover {
    color: #fff;
    background-color: ${colors.primary};
  }
`
