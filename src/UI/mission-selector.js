import React from "react"
import Select from "react-select"
import { useData } from "../contexts/data-context"

export const MissionSelector = ({ dispatch }) => {
  const { data, updating } = useData()
  const [loadingMission, setLoadingMission] = React.useState(false)

  if (updating) return
  const setMission = missionId => {
    setLoadingMission(true)

    fetch(`/api/get/mission/${missionId}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(mission => {
        dispatch({
          type: "SET_MISSION_FROM_TEMPLATE",
          mission,
        })
        setLoadingMission(false)
      })
      .catch(err => {
        setLoadingMission(false)
        console.error(err)
      })
  }

  const { missions } = data

  const missionsList = missions
    .map(m => ({ value: m.slug, label: m.title }))
    .sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1))

  return loadingMission ? (
    <div style={{ minWidth: 300, marginLeft: 20 }}>Updating mission...</div>
  ) : (
    <Select
      name="mission-selector"
      value=""
      placeholder="Use mission as template..."
      onChange={e => setMission(e.value)}
      options={missionsList}
      style={{ minWidth: 300, marginLeft: 20 }}
      menuStyle={{ marginLeft: 20 }}
    />
  )
}
