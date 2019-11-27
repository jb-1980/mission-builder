import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"

export const MISSIONS = gql`
  query missions($kaid: String!) {
    missions(kaid: $kaid) {
      title
      code
      owner
    }
  }
`
export const useMissions = options => useQuery(MISSIONS, options)

export const MISSION = gql`
  query mission($code: String!) {
    mission(code: $code) {
      title
      code
      owner
      topics {
        id
        title
        tasks {
          kaid
          title
          name
        }
      }
    }
  }
`
export const useMission = options => useQuery(MISSION, options)
