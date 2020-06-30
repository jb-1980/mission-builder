const { Mission } = require("./models")

const idGenerator = (size = 8) => {
  // Return a useful mission code like "EJ6T9Y".
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  return Array.apply(null, Array(size))
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join("")
}

exports.resolvers = {
  Query: {
    missions: async (parent, { kaid }) => await Mission.find({ owner: kaid }),
    mission: async (parent, { code }) => await Mission.findOne({ code }),
  },
  Mutation: {
    saveMission: async (parent, { mission }) => {
      if (mission.code === "create") {
        // create new mission
        let code = idGenerator()
        let _mission = await Mission.findOne({ code })
        while (_mission) {
          code = idGenerator()
          _mission = await Mission.findOne({ code })
        }

        _mission = Mission({ ...mission, code })
        await _mission.save()
        return _mission
      } else {
        const res = await Mission.replaceOne({ code: mission.code }, mission)
        if (res.ok) {
          return mission
        } else {
          throw "Unable to update mission"
        }
      }
    },
  },
}
