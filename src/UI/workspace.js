import React from "react"
import { navigate } from "@reach/router"
import { Topics } from "./topics"
import Modal from "react-modal"

import { useSaveMission } from "../apollo/mutations"
import { MISSIONS, MISSION } from "../apollo/queries"

import { ButtonPrimary } from "./buttons"
import { btnPrimary } from "./btn-css"
import { Loading } from "./loading"
import { AtomSpinner } from "./atom"
import { Editable } from "./editable-input"
import { useData } from "../contexts/data-context"
import { useUser } from "../contexts/user-context"
import { AssignmentSelector } from "./mission-selector"

const cleanMission = (dirtyMission) => ({
  code: dirtyMission.code,
  owner: dirtyMission.owner,
  title: dirtyMission.title,
  topics: dirtyMission.topics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    tasks: topic.tasks.map((task) => ({
      exportid: task.exportid,
      kaid: task.kaid,
      kind: task.kind,
      name: task.name,
      title: task.title,
      url: task.url,
    })),
  })),
})

export const Workspace = ({ mission, dispatch }) => {
  const [open, setOpen] = React.useState(false)
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
    onCompleted: () => dispatch({ type: "SAVE_MISSION" }),
  })

  return (
    <>
      <div className="dashboard-task-list-container">
        <div className="editor-task-list">
          <div style={{ textAlign: "right" }}>
            <ButtonPrimary
              disabled={mission.editing}
              style={
                mission.editing ? { opacity: 0.5, cursor: "not-allowed" } : {}
              }
              onClick={() => setOpen(true)}
            >
              Export
            </ButtonPrimary>
            <ButtonPrimary
              disabled={!mission.editing}
              style={{
                marginLeft: 3,
                opacity: mission.editing ? 1 : 0.5,
                cursor: mission.editing ? "pointer" : "not-allowed",
              }}
              onClick={saveMission}
            >
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
                some topics, and then using the search box to add some skills
                from Khan Academy.
              </p>
              <p>We see something awesome about to happen!</p>
              {loading || updating ? (
                <Loading message="Updating data cache, this could take a minute..." />
              ) : (
                <>
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
                  <AssignmentSelector dispatch={dispatch} />
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
      {open && (
        <Modal
          isOpen
          onRequestClose={() => setOpen(false)}
          style={{
            overlay: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            content: {
              width: 400,
              height: 200,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-around",
            },
          }}
        >
          <div style={{ position: "absolute", top: 0, right: 0 }}>
            <button
              style={{
                border: "none",
                background: "none",
                fontSize: 25,
                color: "#747474",
                cursor: "pointer",
              }}
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
          </div>
          <div style={{ textAlign: "center" }}>
            <a
              className={btnPrimary}
              style={{ textDecoration: "none", width: 300 }}
              href={`/api/get/mission_export/${mission.code}?condensed=true`}
            >
              Export with condensed exercise pages
            </a>
          </div>
          <div style={{ textAlign: "center" }}>
            <a
              className={btnPrimary}
              style={{ textDecoration: "none", width: 300 }}
              href={`/api/get/mission_export/${mission.code}`}
            >
              Export
            </a>
          </div>
        </Modal>
      )}
    </>
  )
}

const MissionTitle = ({ initialTitle, dispatch }) => {
  const [isEditing, setIsEditing] = React.useState(false)

  const updateTitle = (title) => {
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
