const mxml = require("./elms-xml-files")

const getVideoIds = async (kapi, videos) =>
  Promise.all(videos.map(name => kapi.videos(name))).then(data =>
    data.reduce((ids, vid) => {
      ids[vid.readable_id] = vid.youtube_id
      return ids
    }, {})
  )

const getManyExercises = async (kapi, exercises) =>
  Promise.all([
    ...exercises.map(name => kapi.exercisesExerciseName(name)),
    ...exercises.map(name => kapi.exercisesExerciseVideos(name)),
  ]).then(data => {
    let { videoMap, skills } = data.reduce(
      (map, datum) => {
        if (Array.isArray(datum)) {
          datum.forEach(video => {
            map.videoMap[video.readable_id] = video.youtube_id
          })
        } else {
          map.skills.push(datum)
        }
        return map
      },
      { videoMap: {}, skills: [] }
    )

    return skills.map(skill => ({
      ...skill,
      related_videos: skill.related_video_readable_ids.map(
        vid => videoMap[vid]
      ),
    }))
  })

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

  // parse mission data to build sections and activities:
  const { exercises, videos } = mission.topics.reduce(
    (acc, topic) => {
      topic.tasks.forEach(task => {
        if (task.kind === "Exercise") {
          acc.exercises.push(task.name)
        } else if (task.kind === "Video") {
          acc.videos.push(task.name)
        }
      })
      return acc
    },
    { exercises: [], videos: [] }
  )

  const videoIds = await getVideoIds(kapi, videos)
  const pageData = await getManyExercises(kapi, exercises)
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
      let { kind } = task
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
        url: task.url,
        related_videos:
          kind === "Video"
            ? [videoIds[task.name]]
            : taskData.related_videos || [],
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
