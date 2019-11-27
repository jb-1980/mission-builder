import React from "react"
import { css } from "emotion"
import { useData } from "../contexts/data-context"
import { ButtonPrimary } from "./buttons"

export const TaskSelector = ({ topicId, dispatch }) => {
  const { data, loading } = useData()
  const [task, setTask] = React.useState({})
  const [value, setValue] = React.useState("")

  if (loading) return
  return (
    <div
      className={css`
        display: flex;
      `}
    >
      <Select
        placeholder="Add a task..."
        options={data.exercises}
        onChange={setTask}
        value={value}
        setValue={setValue}
        style={{ flex: 1 }}
      />

      <div style={{ width: 90 }}>
        <ButtonPrimary
          onClick={() => {
            if (task.id) {
              dispatch({ type: "ATTACH_TASK_TO_TOPIC", topicId, task })
              setValue("")
              setTask({})
            }
          }}
        >
          Add task
        </ButtonPrimary>
      </div>
    </div>
  )
}

const Select = ({
  options,
  placeholder,
  value,
  setValue,
  onChange,
  ...props
}) => {
  const [listVisible, setListVisible] = React.useState(false)

  const ref = React.useRef()

  const onOutsideClick = e => {
    if (!ref.current || ref.current.contains(e.target)) {
      return null
    }
    return setListVisible(false)
  }

  React.useEffect(() => {
    document.addEventListener("click", onOutsideClick)
    document.addEventListener("touchstart", onOutsideClick)
    return () => {
      document.removeEventListener("click", onOutsideClick)
      document.removeEventListener("touchstart", onOutsideClick)
    }
  })
  const filteredOptions = options.filter(o =>
    o.title.toLowerCase().includes(value.toLowerCase())
  )
  const list = filteredOptions.slice(0, 10)

  return (
    <div ref={ref} {...props}>
      <input
        value={value}
        placeholder={placeholder}
        onFocus={e => {
          setListVisible(true)
          e.target.select()
        }}
        onChange={e => setValue(e.target.value)}
        className={css`
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
          font-size: 14px;
          font-family: Ubuntu;
        `}
      />
      <div
        className={css`
          border: 1px solid #ddd;
          height: 150px;
          overflow-y: auto;
        `}
        style={{
          display: listVisible ? "inherit" : "none",
        }}
      >
        <ul
          className={css`
            list-style-type: none;
          `}
        >
          {list.map(task => (
            <li
              className={css`
                cursor: pointer;
                margin: 5px 0px;
                font-size: 17px;
                &:hover {
                  background: #555;
                  color: #fff;
                }
              `}
              key={task.id}
              data-kaid={task.id}
              data-slug={task.slug}
              onClick={() => {
                setValue(task.title)
                onChange(task)
                setListVisible(false)
              }}
            >
              {task.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
