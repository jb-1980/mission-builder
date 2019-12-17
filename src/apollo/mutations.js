import { gql } from "apollo-boost"
import { useMutation } from "@apollo/react-hooks"

export const useSaveMission = options =>
  useMutation(
    gql`
      mutation saveMission($mission: MissionInput!) {
        saveMission(mission: $mission) {
          title
          code
          owner
          topics {
            title
            tasks {
              exportid
              kaid
              kind
              title
              name
              url
            }
          }
        }
      }
    `,
    options
  )
