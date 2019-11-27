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
              kaid
              title
              name
            }
          }
        }
      }
    `,
    options
  )
