const router = require("express").Router()
const { KhanAPIWrapper } = require("khan-api-wrapper")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const Archiver = require("archiver")
const { promisify } = require("util")
const readAsync = promisify(fs.readFile)
const writeAsync = promisify(fs.writeFile)

const { make_backup } = require("./edkey/make-zip-export")
const { Mission } = require("./models")

router.get("/user/verify", async (req, res) => {
  const { tokens } = req.cookies
  if (tokens) {
    const authTokens = jwt.verify(tokens, process.env.JWT_SECRET)
    const kapi = new KhanAPIWrapper(
      process.env.KHAN_CONSUMER_KEY,
      process.env.KHAN_CONSUMER_SECRET,
      authTokens.token,
      authTokens.secret
    )
    const user = await kapi.user()
    res.status(200).json(user)
  } else {
    res.sendStatus(401)
  }
})

router.get("/get/missions/:userKaid", async (req, res) => {
  const { userKaid } = req.params
  const missions = await Mission.find({ owner: userKaid })
  res.json(missions)
})

router.get("/get/mission/:missionSlug", async (req, res) => {
  const { missionSlug } = req.params
  const { tokens } = req.cookies
  if (tokens) {
    const authTokens = jwt.verify(tokens, process.env.JWT_SECRET)
    const kapi = new KhanAPIWrapper(
      process.env.KHAN_CONSUMER_KEY,
      process.env.KHAN_CONSUMER_SECRET,
      authTokens.token,
      authTokens.secret
    )
    const endpoint = `/api/internal/user/mission/${missionSlug}`
    const mission = await kapi.fetchResource(endpoint, true)
    res.status(200).json(mission)
  } else {
    res.sendStatus(401)
  }
})

router.get("/get/data", async (req, res, next) => {
  const data = await readAsync("data_cache.json", { encoding: "utf8" })
    .then(jsonString => JSON.parse(jsonString))
    .catch(error => next(error))
  res.status(200).json(data)
})

router.put("/update/data", async (req, res) => {
  const { tokens } = req.cookies

  if (tokens) {
    const authTokens = jwt.verify(tokens, process.env.JWT_SECRET)
    const kapi = new KhanAPIWrapper(
      process.env.KHAN_CONSUMER_KEY,
      process.env.KHAN_CONSUMER_SECRET,
      authTokens.token,
      authTokens.secret
    )
    const endpoint = "/api/v2/topics/topictree"
    const topics = await kapi.fetchResource(endpoint)

    await writeAsync("data_cache.json", JSON.stringify(topics), {
      encoding: "utf8",
    })

    res.status(200).json(topics)
  } else {
    res.sendStatus(401)
  }
})

router.get("/get/mission_export/:code", async (req, res) => {
  const { tokens } = req.cookies

  if (tokens) {
    const authTokens = jwt.verify(tokens, process.env.JWT_SECRET)
    const kapi = new KhanAPIWrapper(
      process.env.KHAN_CONSUMER_KEY,
      process.env.KHAN_CONSUMER_SECRET,
      authTokens.token,
      authTokens.secret
    )

    var zip = Archiver("zip")

    // Send the file to the page output.
    zip.pipe(res)
    const { code } = req.params
    const mission = await Mission.findOne({ code })
    const xml_files = await make_backup(kapi, mission)
    xml_files.forEach(f => zip.append(f.xml, { name: f.name }))
    zip.finalize()
    res.writeHead(200, {
      "Content-Type": "application/zip",
      "Content-disposition": `attachment; filename=${mission.title}.mbz`,
    })
  } else {
    res.sendStatus(401)
  }
})
module.exports = router