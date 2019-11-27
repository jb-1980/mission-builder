import React from "react"

import { colors } from "./colors"

const polarToCartesian = (startX = 0, startY = 0, radius, angle) => [
  startX + radius * Math.sin(angle),
  startY - radius * Math.cos(angle),
]

// Found that 2pi would not create circle, so getting really close to it
const findAngle = num => (num === 1 ? 1.9999999 * Math.PI : 2 * Math.PI * num)

const parametizeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, startAngle)
  const end = polarToCartesian(x, y, radius, endAngle)
  const arcsweep = Math.abs(endAngle - startAngle) <= Math.PI ? 0 : 1

  return `M ${start[0]},${start[1]} A ${radius},${radius} 0 ${arcsweep} 1 ${
    end[0]
  },${end[1]}`
}

export const ProgressCircle = ({ tasks }) => {
  // First convert relavent progress data to values of a circle

  const angles = {
    mastery3: { count: 0, stroke: colors.mastery3 },
    mastery2: { count: 0, stroke: colors.mastery2 },
    mastery1: { count: 0, stroke: colors.mastery1 },
    practiced: { count: 0, stroke: colors.practiced },
    unstarted: { count: 0, stroke: "#ddd" },
    struggling: { count: 0, stroke: colors.struggling },
  }

  let progressArcs
  if (tasks.length === 0) {
    progressArcs = [
      <path
        key={0}
        style={{
          stroke: "#ddd",
          strokeWidth: 10,
          strokeCap: "butt",
          fill: "transparent",
        }}
        d={parametizeArc(70, 70, 65, 0, 1.999999 * Math.PI)}
      />,
    ]
  } else {
    tasks.forEach(task => {
      if (task.mastery_level) {
        angles[task.mastery_level].count += 1
      } else {
        angles.unstarted.count += 1
      }
    })

    let startAngle = 0
    let endAngle = 0
    progressArcs = [
      "mastery3",
      "mastery2",
      "mastery1",
      "practiced",
      "struggling",
      "unstarted",
    ].map(task => {
      startAngle = endAngle
      endAngle += angles[task].count / tasks.length
      const start = findAngle(startAngle)
      const end = findAngle(endAngle)
      const path = parametizeArc(70, 70, 65, start, end)

      return (
        <path
          key={task}
          style={{
            stroke: angles[task].stroke,
            strokeWidth: 10,
            strokeCap: "butt",
            fill: "transparent",
          }}
          d={path}
        />
      )
    })
  }

  // found at https://khanacademy.zendesk.com/hc/en-us/articles/210934888-How-are-the-percentages-on-my-Student-Progress-report-calculated-
  const progress =
    (4 * angles["mastery3"].count +
      3 * angles["mastery2"].count +
      2 * angles["mastery1"].count +
      angles["practiced"].count) /
    (4.0 * tasks.length)

  return (
    <svg width={140} height={140} style={{ cursor: "pointer" }}>
      <g>{progressArcs}</g>
      <g>
        <circle style={{ fill: "#fff" }} radius={60} />
      </g>

      <g>
        <text
          style={{
            fill: colors.mastery3,
            font: '34px "Arial"',
            textAnchor: "middle",
            dominantBaseline: "text-after-edge",
          }}
          x="50%"
          y="50%"
        >
          {Math.round(progress * 100) + "%"}
        </text>
        <text
          style={{
            fill: colors.mastery3,
            font: '18px "Arial"',
            textAnchor: "middle",
            dominantBaseline: "text-before-edge",
          }}
          x="50%"
          y="50%"
        >
          progress
        </text>
      </g>
    </svg>
  )
}
