const router = require("express").Router()
const { KhanApi } = require("khan-graphql")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const Archiver = require("archiver")
const { promisify } = require("util")
const readAsync = promisify(fs.readFile)
const writeAsync = promisify(fs.writeFile)

const { make_backup } = require("./mission/make-zip-export")
const { Mission } = require("./models")

router.use(async (req, res, next) => {
  const { tokens } = req.cookies
  if (tokens) {
    const { identifier, password } = jwt.verify(tokens, process.env.JWT_SECRET)
    if (!identifier || !password) {
      return res.sendStatus(401)
    }
    const kapi = new KhanApi()
    await kapi.authenticate(identifier, password).catch(() => {
      return res.sendStatus(401)
    })

    req.kapi = kapi
    return next()
  } else {
    res.sendStatus(401)
  }
})

router.get("/user/verify", async (req, res) => {
  try {
    const user = await req.kapi.getFullUserProfile().then(({ data }) => data)

    let _user = user?.data?.user || {}
    res.status(200).json(_user)
  } catch (err) {
    console.error({ ["/user/verify"]: err })
    res.status(err.response.status).json({ error: err })
  }
})

router.get("/get/missions/:userKaid", async (req, res) => {
  const { userKaid } = req.params
  const missions = await Mission.find({ owner: userKaid })
  res.json(missions)
})

router.get("/get/data", async (req, res, next) => {
  const data = await readAsync("data_cache.json", { encoding: "utf8" })
    .then((jsonString) => JSON.parse(jsonString))
    .catch((error) => next(error))
  res.status(200).json(data)
})

router.get("/get/assignment_data/:courseId", async (req, res) => {
  const { courseId } = req.params
  const { data } = await req.kapi
    .ProgressByStudent(courseId)
    .then(({ data }) => data)
    .catch((err) => {
      console.error({ ["/get/assignment_data/:courseId"]: err })
      return res.sendStatus(500)
    })
  if (data === null) {
    res.sendStatus(400)
    return
  }

  console.log(JSON.stringify(data))

  const { assignments } = data?.coach?.studentList?.assignmentsPage || {
    assignments: [],
  }

  // parsing data to look like mission structure
  const mission = assignments.reduce(
    (acc, a) => {
      const assignment = a.contents[0]
      acc.progressInfo.push({
        exportid: a.id,
        id: assignment.id,
        kind: assignment.kind,
        name: assignment.defaultUrlPath.split("/").pop(),
        translatedDisplayName: assignment.translatedTitle,
        url: assignment.defaultUrlPath,
      })

      acc.topicBreakdown[0].exerciseIds.push(assignment.id)

      return acc
    },
    {
      progressInfo: [],
      translatedTitle: "Edit Me",
      topicBreakdown: [
        {
          translatedTitle: "Topic 1",
          exerciseIds: [],
        },
      ],
    }
  )
  res.status(200).json(mission)
})

router.put("/update/data", async (req, res) => {
  const endpoint = "https://www.khanacademy.org/api/v2/topics/topictree"
  const topics = await req.kapi
    .get(endpoint)
    .then(({ data }) => data)
    .catch((err) => {
      console.error(err)
      res.status(500)
    })

  await writeAsync("data_cache.json", JSON.stringify(topics, null, 2), {
    encoding: "utf8",
  })

  res.status(200).json(topics)
})

router.get("/get/mission_export/:code", async (req, res) => {
  const { code } = req.params
  const { condensed } = req.query
  const mission = await Mission.findOne({ code })

  const xml_files = await make_backup(mission, condensed)

  const zip = Archiver("zip")
  zip.pipe(res)
  xml_files.forEach((f) => zip.append(f.xml, { name: f.name }))
  zip.finalize()
  res.writeHead(200, {
    "Content-Type": "application/zip",
    "Content-disposition": `attachment; filename=${mission.title}.mbz`,
  })
})
module.exports = router
