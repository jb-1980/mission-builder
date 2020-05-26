import React from "react"
import { useDrag, useDrop } from "react-dnd"
import { FaTimesCircle } from "react-icons/fa"

import { Editable } from "./editable-input"

export const Topics = ({ topics, dispatch }) => {
  return (
    <div className="topics">
      {topics.map((topic) => (
        <Topic topic={topic} key={topic.id} dispatch={dispatch} />
      ))}
    </div>
  )
}

const Topic = ({ topic, dispatch }) => {
  const [, drop] = useDrop({
    accept: "task",
    drop: (item, monitor) => {
      if (monitor.didDrop()) return
      dispatch({
        type: "MOVE_TASK",
        source: item.task,
        target: {},
        $targetTopic: topic,
      })
    },
  })
  const deleteTopic = (e, topicId) => {
    e.stopPropagation()

    dispatch({
      type: "DELETE_TOPIC",
      id: topicId,
    })
  }
  return (
    <div ref={drop} className="topic clearfix">
      <div className="topic-header">
        <div className="topic-title">
          <TopicTitle title={topic.title} id={topic.id} dispatch={dispatch} />

          <div className="topic-delete">
            <FaTimesCircle
              onClick={(e) => deleteTopic(e, topic.id)}
              className="delete-button"
            />
          </div>
        </div>
      </div>
      <Tasks topicId={topic.id} tasks={topic.tasks} dispatch={dispatch} />
    </div>
  )
}

const TopicTitle = ({ title, id, dispatch }) => {
  const [isEditing, setIsEditing] = React.useState(false)

  const onEdit = (title) => {
    dispatch({
      type: "UPDATE_TOPIC_TITLE",
      id,
      title,
    })
    setIsEditing(false)
  }
  return (
    <Editable
      className="topic-name"
      onValueClick={() => setIsEditing(true)}
      editing={isEditing}
      value={title}
      onEdit={onEdit}
    />
  )
}

export const Tasks = ({ tasks, topicId, dispatch }) => (
  <ul className="tasks">
    {tasks.map((task) => (
      <Task
        key={task.id}
        className="task"
        topicId={topicId}
        task={task}
        dispatch={dispatch}
      />
    ))}
  </ul>
)

export const Task = ({ task, topicId, dispatch, ...props }) => {
  const ref = React.useRef(null)
  const [, drop] = useDrop({
    accept: "task",
    hover(item) {
      if (!ref.current) return

      if (item.task.id !== task.id) {
        dispatch({
          type: "MOVE_TASK",
          source: item.task,
          target: task,
        })
      }
    },
  })
  const [{ isDragging }, drag] = useDrag({
    item: { type: "task", task },
    isDragging: (monitor) => {
      return task.id === monitor.getItem().task.id
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const handleDelete = () =>
    dispatch({
      type: "DELETE_TASK",
      topicId,
      task,
    })

  drag(drop(ref))
  return (
    <li
      ref={ref}
      style={{
        opacity: isDragging ? 0 : 1,
      }}
      {...props}
    >
      <span className="value">{task.title}&nbsp;</span>
      <FaTimesCircle className="delete-button" onClick={handleDelete} />
    </li>
  )
}
