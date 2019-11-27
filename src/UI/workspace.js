import React from "react"
import { navigate } from "@reach/router"
import { Topics } from "./topics"
import { useSaveMission } from "../apollo/mutations"
import { MISSIONS, MISSION } from "../apollo/queries"

import { ButtonPrimary } from "./buttons"
import { btnPrimary } from "./btn-css"
import { Loading } from "./loading"
import { AtomSpinner } from "./atom"
import { Editable } from "./editable-input"
import { useData } from "../contexts/data-context"
import { useUser } from "../contexts/user-context"
import { MissionSelector } from "./mission-selector"

const cleanMission = dirtyMission => ({
  code: dirtyMission.code,
  owner: dirtyMission.owner,
  title: dirtyMission.title,
  topics: dirtyMission.topics.map(topic => ({
    id: topic.id,
    title: topic.title,
    tasks: topic.tasks.map(task => ({
      kaid: task.kaid,
      name: task.name,
      title: task.title,
    })),
  })),
})

export const Workspace = ({ mission, dispatch }) => {
  const { loading, updating, error, updateData } = useData()
  const { user } = useUser()
  const [saveMission, { loading: isSaving }] = useSaveMission({
    variables: {
      mission: cleanMission(mission),
    },
    update: (cache, { data }) => {
      const { saveMission: _mission } = data
      if (mission.code === "create") {
        return navigate(`/mission/${_mission.code}`)
      } else {
        cache.writeQuery({
          query: MISSION,
          data: { mission: _mission },
        })
      }
    },
    refetchQueries: [
      {
        query: MISSIONS,
        variables: { kaid: user.kaid },
      },
    ],
  })

  return (
    <div className="dashboard-task-list-container">
      <div className="editor-task-list">
        <div style={{ textAlign: "right" }}>
          <a
            className={btnPrimary}
            style={{ textDecoration: "none" }}
            href={`/api/get/mission_export/${mission.code}`}
          >
            Export
          </a>
          <ButtonPrimary style={{ marginLeft: 3 }} onClick={saveMission}>
            {isSaving ? (
              <AtomSpinner
                size="20px"
                color="#fff"
                style={{ margin: "auto" }}
              />
            ) : (
              "Save mission"
            )}
          </ButtonPrimary>
        </div>
        <div className="dashboard-section-container">
          <MissionTitle initialTitle={mission.title} dispatch={dispatch} />
          <div className="edit-info-container">
            <h2 style={{ marginTop: 0 }}>
              Welcome to the mission control center!
            </h2>
            <p>
              You can easily set up a new mission by giving it a title, adding
              some topics, and then using the search box to add some skills from
              Khan Academy.
            </p>
            <p>We see something awesome about to happen!</p>
            {loading || updating ? (
              <Loading message="Updating data cache, this could take a minute..." />
            ) : (
              <>
                <MissionSelector dispatch={dispatch} />
                <ButtonPrimary
                  style={{ margin: "3px 3px 0 0" }}
                  onClick={() => dispatch({ type: "CREATE_TOPIC" })}
                >
                  Add Topic
                </ButtonPrimary>
                <ButtonPrimary
                  style={{ margin: "3px 0 0 3px" }}
                  onClick={() => updateData()}
                >
                  {error ? "Error updating! Try again?" : "Update Data Cache"}
                </ButtonPrimary>
              </>
            )}
          </div>
          <div className="up-next-outer-container">
            {!loading && !updating && (
              <Topics topics={mission.topics} dispatch={dispatch} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const MissionTitle = ({ initialTitle, dispatch }) => {
  const [isEditing, setIsEditing] = React.useState(false)

  const updateTitle = title => {
    dispatch({
      type: "UPDATE_TITLE",
      title,
    })
    setIsEditing(false)
  }
  return (
    <Editable
      className="topic-name"
      value={initialTitle || "Edit mission title"}
      onEdit={updateTitle}
      onValueClick={() => setIsEditing(true)}
      editing={isEditing}
    />
  )
}
