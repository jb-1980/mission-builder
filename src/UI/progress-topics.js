import React from "react"
import { colors } from "./colors"

export const Topics = ({ topics }) => (
  <div className="progress-cells">
    {topics.map(topic => (
      <div key={topic.id} className="clearfix progress-by-topic">
        <div className="progress-by-topic__title">{topic.title}</div>
        {topic.tasks.map(task => (
          <div
            key={task.id}
            className="progress-cell"
            style={{
              backgroundColor: task.mastery_level
                ? colors[task.mastery_level]
                : "#ddd",
            }}
          />
        ))}
      </div>
    ))}
  </div>
)
