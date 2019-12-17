const { gql } = require("apollo-server-express")

exports.typeDefs = gql`
  type User {
    username: String
    nickname: String
    kaid: String
  }

  type Task {
    exportid: String
    kaid: String
    kind: String
    name: String
    title: String
    url: String
  }

  type Topic {
    id: String
    title: String
    tasks: [Task]
  }

  type Mission {
    title: String
    code: String
    owner: String
    topics: [Topic]
  }

  input TaskInput {
    exportid: String
    kaid: String
    kind: String
    name: String
    title: String
    url: String
  }

  input TopicInput {
    id: String
    title: String
    tasks: [TaskInput]
  }

  input MissionInput {
    title: String
    code: String
    owner: String
    topics: [TopicInput]
  }
  type Query {
    user: User
    missions(kaid: String!): [Mission]
    mission(code: String!): Mission
  }

  type Mutation {
    createMission(mission: MissionInput!): Mission
    saveMission(mission: MissionInput!): Mission
  }
`
