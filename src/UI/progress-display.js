import React from "react"

import { Topics } from "./progress-topics"
import { TaskRows } from "./task-rows"
import { ProgressCircle } from "./progress-circle"

export const ProgressDisplay = ({ mission }) => {
  const tasks = mission.topics.reduce((acc, topic) => {
    return [...acc, ...topic.tasks]
  }, [])
  return (
    <div className="progress-bar-container info-container">
      <div className="mission-progress-icon-container">
        <div className="mission-progress-icon">
          <ProgressCircle tasks={tasks} />
        </div>
        <TaskRows tasks={tasks} />
      </div>
      <div className="toggle-skills-link-container"></div>
      <Topics topics={mission.topics} />
    </div>
  )
}
