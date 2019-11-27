import React from "react"
import uuidv4 from "uuid/v4"
import { css } from "emotion"
import { useMission } from "../apollo/queries"
import { useUser } from "../contexts/user-context"

import { ProgressDisplay } from "./progress-display"
import { Workspace } from "./workspace"
import { Error } from "./error"
import { Loading } from "./loading"

export const Mission = ({ missionCode }) => {
  const { data, loading, error } = useMission({
    variables: { code: missionCode },
  })

  if (error) return <Error message="Error loading mission" />
  if (loading) return <Loading message="Loading mission from server" />

  const { mission } = data

  return <MissionDashboard initialMission={mission} />
}

export const CreateMission = () => {
  const { user } = useUser()
  return (
    <MissionDashboard
      initialMission={{
        code: "create",
        owner: user.kaid,
        title: "Edit mission title",
        topics: [],
      }}
    />
  )
}

export const CloneMission = ({ missionCode }) => {
  const { user } = useUser()
  const { data, loading, error } = useMission({
    variables: { code: missionCode },
  })

  if (error) return <Error message="Error loading mission" />
  if (loading) return <Loading message="Loading mission from server" />

  const { mission } = data

  return mission === null ? (
    <Error message={`No mission found for code ${missionCode}`} />
  ) : (
    <MissionDashboard
      initialMission={{ ...mission, code: "create", owner: user.kaid }}
    />
  )
}

const MissionDashboard = ({ initialMission }) => {
  const injectedMission = {
    ...initialMission,
    topics: initialMission.topics.map(t =>
      t.id
        ? {
            ...t,
            tasks: t.tasks.map(task =>
              task.id ? task : { ...task, id: uuidv4() }
            ),
          }
        : {
            ...t,
            id: uuidv4(),
            tasks: t.tasks.map(task =>
              task.id ? task : { ...task, id: uuidv4() }
            ),
          }
    ),
  }
  const [mission, dispatch] = React.useReducer(reducer, injectedMission)

  React.useEffect(() => {
    if (mission.code !== injectedMission.code) {
      dispatch({ type: "SET_MISSION", mission: injectedMission })
    }
  }, [mission, injectedMission])
  return (
    <div className="dashboard-container">
      <div className="mission-container">
        <div className="progress-container">
          <div className="mission-title">{mission.title}</div>
          <div
            className={css`
              margin-top: 20px;
            `}
          >
            <div className="progress-header">Mission Progress</div>
          </div>
          <div className="dashboard-section-content mission-progress-container no-highlight-on-hover">
            <ProgressDisplay mission={mission} />
          </div>
        </div>
        <div className="workspace-container">
          <Workspace mission={mission} dispatch={dispatch} />
        </div>
      </div>
    </div>
  )
}

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_TITLE":
      return { ...state, title: action.title }

    case "UPDATE_TOPIC_TITLE":
      return {
        ...state,
        topics: state.topics.map(t => {
          if (t.id === action.id) {
            return { ...t, title: action.title }
          }
          return { ...t }
        }),
      }

    case "CREATE_TOPIC":
      return {
        ...state,
        topics: [
          ...state.topics,
          {
            id: uuidv4(),
            title: "Edit Topic Name",
            tasks: [],
          },
        ],
      }

    case "DELETE_TOPIC":
      return { ...state, topics: state.topics.filter(t => t.id !== action.id) }

    case "ATTACH_TASK_TO_TOPIC":
      return {
        ...state,
        topics: state.topics.map(topic => {
          if (topic.id === action.topicId) {
            const { task } = action
            const taskIds = topic.tasks.map(t => t.kaid)
            if (taskIds.includes(task.id)) {
              return { ...topic }
            }
            return {
              ...topic,
              tasks: [
                ...topic.tasks,
                { title: task.title, name: task.slug, kaid: task.id },
              ],
            }
          }
          return { ...topic }
        }),
      }

    case "DELETE_TASK":
      return {
        ...state,
        topics: state.topics.map(topic => {
          if (topic.id === action.topicId) {
            return {
              ...topic,
              tasks: topic.tasks.filter(t => t.kaid !== action.task.kaid),
            }
          }
          return { ...topic }
        }),
      }

    case "MOVE_TASK": {
      const { source, target, $targetTopic } = action
      const {
        sourceTopic,
        targetTopic,
        sourceIndex,
        targetIndex,
      } = state.topics.reduce(
        (acc, topic) => {
          topic.tasks.forEach((t, i) => {
            if (t.id === source.id) {
              acc.sourceTopic = topic
              acc.sourceIndex = i
            }
            if (t.id === target.id) {
              acc.targetTopic = topic
              acc.targetIndex = i
            }
          })
          return acc
        },
        { targetTopic: $targetTopic }
      )

      if (sourceTopic.id === targetTopic.id) {
        return {
          ...state,
          topics: state.topics.map(topic => {
            if (topic.id === sourceTopic.id) {
              const _tasks = [...topic.tasks]
              _tasks.splice(targetIndex, 0, _tasks.splice(sourceIndex, 1)[0])
              return { ...topic, tasks: _tasks }
            }
            return topic
          }),
        }
      } else {
        return {
          ...state,
          topics: state.topics.map(topic => {
            if (topic.id === sourceTopic.id) {
              // get rid of task from source
              const _tasks = [...topic.tasks]
              _tasks.splice(sourceIndex, 1)
              return { ...topic, tasks: _tasks }
            }

            if (topic === targetTopic) {
              // and move it to target
              const _tasks = [...topic.tasks]
              _tasks.splice(targetIndex, 0, source)
              return { ...topic, tasks: _tasks }
            }

            return topic
          }),
        }
      }
    }

    case "SET_MISSION_FROM_TEMPLATE": {
      const { mission } = action
      const tasks = mission.progressInfo.reduce(
        (acc, task) => ({ ...acc, [task.id]: task }),
        {}
      )
      return {
        ...state,
        title: mission.translatedTitle,
        topics: mission.topicBreakdown.map(topic => ({
          id: uuidv4(),
          title: topic.translatedTitle,
          tasks: topic.exerciseIds.map(task => ({
            id: uuidv4(),
            kaid: task,
            name: tasks[task].name,
            title: tasks[task].translatedDisplayName,
          })),
        })),
      }
    }

    case "SET_MISSION":
      return action.mission

    default:
      return state
  }
}
