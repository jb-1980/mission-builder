const mxml = require("./elms-xml-files")

const getManyExercises = async (kapi, exercises, accumulator = []) => {
  // Setting up strings to test length against. 1500 is kind of arbitrary, but
  // it should give room for other things like token and secret
  let _exercises = []
  let tmpString = ""
  let exercisesString = ""
  // Copy of exercises, which will shift off the exercises we use so we have a
  // smaller list for the next fetch
  let unusedExercises = [...exercises]

  for (var i = 0; i < exercises.length; i++) {
    tmpString = `${exercisesString},${exercises[i]}`
    if (tmpString.length < 1500) {
      unusedExercises.shift()
      _exercises.push(exercises[i])
      exercisesString = tmpString
    } else {
      // string has reached its max length, let's fetch some data
      return await kapi.userExercises(_exercises).then(res => {
        _accumulator = res.map(e => e.exercise_model)
        return getManyExercises(kapi, unusedExercises, [
          ...accumulator,
          ..._accumulator,
        ])
      })
    }
  }

  // not enough exercises to exceed the 2048 limit
  const res = await kapi
    .userExercises(exercises)
    .then(res => res.map(e => e.exercise_model))

  return [...accumulator, ...res]
}

const KHAN_URL = "https://www.khanacademy.org/"

exports.make_backup = async (kapi, mission) => {
  //     //
  //     // mission object should look like {
  //     //   "_id" : ObjectId("56fd84b01c1601ea17be56a9"),
  //     //   "code" : "5M517Z",
  //     //   "topics" : [
  //     //     {
  //     //       "id": "123456",
  //     //       "title" : "Adding Fractions",
  //     //       "tasks" : [
  //     //         {
  //     //           "kaid" : "66768579",
  //     //           "title" : "Add fractions with common denominators",
  //     //           "name" : "adding_fractions_with_common_denominators"
  //     //         },
  //     //         {
  //     //           "kaid" : "201422224",
  //     //           "title" : "Add fractions with unlike denominators",
  //     //           "name" : "adding_fractions"
  //     //         }
  //     //       ]
  //     //     }
  //     //   ],
  //     //   "owner" : ObjectId("56fd83761c1601ea17be5521"),
  //     //   "title" : "Fraction Ninja"
  //     // }
  //     // So every topic should become a section, and each task should become a page
  //     //
  const fileName = `${mission.title}-export.mbz`

  // parse mission data to build sections and activities:
  const skills = mission.topics.reduce((acc, topic) => {
    topic.tasks.forEach(task => acc.push(task.name))
    return acc
  }, [])

  const pageData = await getManyExercises(kapi, skills)
  const pageDataRef = pageData.reduce((acc, page) => {
    acc[page.name] = page
    return acc
  }, {})

  let sect = 1
  let lessonid = 1
  let modid = 1
  let ctxid = 1
  let pageid1 = 1
  let pageid2 = pageid1 + 1
  let answerid = 1
  let answerid2 = 2
  let answerid3 = 3
  let gradeitem = 1
  let sequenceStart = 1
  let sequenceEnd = 1

  let mission_backup = {
    backupname: `${mission.title}.mbz`,
    coursetitle: mission.title,
    modtype: "page",
    activities: [],
    sections: [],
  }

  mission.topics.forEach(topic => {
    sect += 1

    topic.tasks.forEach(task => {
      let taskData = pageDataRef[task.name] || {}

      mission_backup.activities.push({
        modid,
        sectionid: sect,
        title: task.title,
        exportid: task.exportid || task.name,
        lessonid,
        modid,
        ctxid,
        pageid1,
        pageid2,
        answerid,
        answerid2,
        answerid3,
        gradeitem,
        idnumber: task.name,
        sectionid: sect,
        ka_url: task.url ? KHAN_URL + task.url : taskData.ka_url,
        related_videos: taskData.related_videos || [],
        kind: task.kind,
        ...taskData,
      })
      lessonid += 1
      modid += 1
      ctxid += 1
      pageid1 += 1
      pageid2 += pageid1 + 1
      answerid += 3
      answerid2 += 3
      answerid3 += 3
      gradeitem += 1
      sequenceEnd += 1
    })

    const sequenceArray = Array(sequenceEnd - sequenceStart + 1)
      .fill()
      .map((_, i) => i + sequenceStart)
    sequenceStart = sequenceEnd

    mission_backup.sections.push({
      id: sect,
      number: sect,
      title: topic.title,
      summary: "description",
      sequence: sequenceArray.join(),
    })
  })

  return [
    mxml.filesxml(),
    mxml.groupsxml(),
    mxml.outcomesxml(),
    mxml.questionsxml(),
    mxml.rolesxml(),
    mxml.scalesxml(),
    mxml.moodle_backupxml(mission_backup),
    ...mission_backup.activities.reduce(
      (acc, a) => [...acc, ...mxml.create_page_activity(a)],
      []
    ),
    ...mission_backup.sections.reduce(
      (acc, s) => [...acc, ...mxml.makesection(s)],
      []
    ),
    ...mxml.makecourse(mission_backup),
  ]
}
