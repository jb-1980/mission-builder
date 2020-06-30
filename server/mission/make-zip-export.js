const mxml = require("./elms-xml-files")
const { VIDEOS } = require("./videos")

exports.make_backup = async (mission, condensed = false) => {
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

  const videoIds = VIDEOS.reduce((dict, v) => {
    dict[v.title] = v.youtubeid
    return dict
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

  mission.topics.forEach((topic) => {
    sect += 1

    topic.tasks.forEach((task) => {
      let { kind } = task
      mission_backup.activities.push({
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
        url: task.url,
        related_videos: kind === "Video" ? [videoIds[task.title]] : [],
        kind: task.kind,
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
      (acc, a) => [...acc, ...mxml.create_page_activity(a, condensed)],
      []
    ),
    ...mission_backup.sections.reduce(
      (acc, s) => [...acc, ...mxml.makesection(s)],
      []
    ),
    ...mxml.makecourse(mission_backup),
  ]
}
