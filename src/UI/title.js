import React from 'react'
import { FaPencilSquare } from "react-icons/fa"

export const Title = ({ initialTitle, onUpdate }) => {
    const [title, setTitle] = React.useState(initialTitle || "Edit mission title")
    const [isEditing, setIsEditing] = React.useState(false)
  
    return isEditing ? <div>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlue
        />
    </div> : 
    
        <div onClick={() => setIsEditing(true)}>
          <span className="value">
            {title}&nbsp;
            <FaPencilSquare className="edit-icon"/>
          </span>
        </div>
    
  }
  