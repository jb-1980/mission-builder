import React from "react"
import { colors } from "./colors"

export const TaskRows = ({ tasks }) => {
  const taskCounts = tasks.reduce(
    (acc, task) => {
      if (task.mastery_level) {
        acc[task.mastery_level] += 1
      } else {
        acc["unstarted"] += 1
      }
      return acc
    },
    {
      mastery3: 0,
      mastery2: 0,
      mastery1: 0,
      practiced: 0,
      unstarted: 0,
    }
  )

  const taskRows = [
    "mastery3",
    "mastery2",
    "mastery1",
    "practiced",
    "unstarted",
  ].map((taskRow, i) => {
    return (
      <div className="task-count-row" key={i}>
        <div
          className={"task-count-row__color-square"}
          style={{
            backgroundColor: colors[taskRow],
          }}
        ></div>
        <span className="task-count-row__count-text">
          {taskCounts[taskRow]}&nbsp;
          {taskCounts[taskRow] === 1 ? "skill" : "skills"}&nbsp;
          {
            {
              mastery3: "mastered",
              mastery2: "level two",
              mastery1: "level one",
              practiced: "practiced",
              unstarted: "not started",
            }[taskRow]
          }
        </span>
      </div>
    )
  })
  return <div className="mission-progress-level-counts">{taskRows}</div>
}
