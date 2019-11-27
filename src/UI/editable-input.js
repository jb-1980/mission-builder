import React from "react"
import { FaPenSquare } from "react-icons/fa"

export const Editable = ({
  value,
  onEdit,
  onValueClick,
  editing,
  ...props
}) => {
  return (
    <div {...props}>
      {editing ? (
        <Edit initialValue={value} onEdit={onEdit} />
      ) : (
        renderValue(value, onValueClick, props.onDelete)
      )}
    </div>
  )
}

const Edit = ({ initialValue, onEdit }) => {
  const [value, changeValue] = React.useState(initialValue)

  const handleEdit = e => {
    const { value } = e.target

    if (onEdit && value.trim()) {
      onEdit(value)
    }
  }

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      handleEdit(e, onEdit)
    } else {
      changeValue(e.target.value)
    }
  }
  return (
    <input
      type="text"
      autoFocus={true}
      onFocus={e => e.target.select()}
      value={value}
      onBlur={handleEdit}
      onKeyPress={handleKeyPress}
      onChange={handleKeyPress}
    />
  )
}

const renderValue = (value, onValueClick, onDelete) => (
  <div onClick={onValueClick}>
    <span className="value">
      {value}&nbsp;
      <FaPenSquare className="edit-icon" />
    </span>
    {onDelete ? renderDelete() : null}
  </div>
)

const renderDelete = onDelete => (
  <button className="delete" onClick={onDelete}>
    x
  </button>
)
