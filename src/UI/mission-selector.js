import React from "react"
import { css } from "emotion"
import { colors } from "./colors"
import { btnPrimary } from "./btn-css"

export const AssignmentSelector = ({ dispatch }) => {
  const [loadingMission, setLoadingMission] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [missionId, setMissionId] = React.useState("")

  const setMission = (missionId) => {
    setLoadingMission(true)
    setError(null)
    fetch(`/api/get/assignment_data/${missionId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((mission) => {
        dispatch({
          type: "SET_MISSION_FROM_TEMPLATE",
          mission,
        })
        setLoadingMission(false)
        setError(null)
      })
      .catch((err) => {
        setError("Error loading assignments")
        setLoadingMission(false)
        console.error(err)
      })
  }

  if (loadingMission)
    return (
      <div style={{ minWidth: 300, margin: "20px auto" }}>
        Fetching course data...
      </div>
    )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setMission(missionId)
      }}
    >
      <h4>Import from a Khan Academy Course</h4>
      {error && (
        <div style={{ minWidth: 300, margin: "20px auto" }}>{error}</div>
      )}
      <div
        className={css`
          width: 400px;
          display: flex;
        `}
      >
        <input
          className={css`
            transition: all 0.3s ease-in-out;
            outline: none;
            padding: 3px 0px 3px 3px;
            margin: 5px 0;
            border: 1px solid ${colors.primary};
            width: 100%;
            height: 30px;
            font-size: 20px;
            color: ${colors.primary}AA;
            font-weight: bold;
            &:focus {
              box-shadow: 0 0 5px ${colors.primary};
              padding: 3px 0px 3px 3px;
              margin: 5px 0;
              border: 1px solid ${colors.primary};
            }
          `}
          type="text"
          placeholder="Khan Academy Course ID"
          value={missionId}
          onChange={(e) => setMissionId(e.target.value)}
        />
        <input
          type="submit"
          className={css`
            ${btnPrimary};
            line-height: 30px;
            padding: 0 5px;
            margin: 5px 0;
            border-radius: 0 5px 5px 0;
          `}
          value="import"
        />
      </div>
    </form>
  )
}
