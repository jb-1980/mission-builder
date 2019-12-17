const jsonxml = require("jsontoxml")
const { createContentString } = require("./content")

// Create files in root directory: files.xml, groups.xml, moodle_backup.xml,
// outcomes.xml, questions.xml, roles.xml, scales.xml
exports.filesxml = () => {
  const xml = jsonxml([{ name: "files" }], {
    xmlHeader: true,
    indent: "spaces",
  })
  return { name: "files.xml", xml }
}

exports.groupsxml = () => {
  const xml = jsonxml([{ name: "groups", children: [{ name: "groupings" }] }], {
    xmlHeader: true,
    indent: "spaces",
  })
  return { name: "groups.xml", xml }
}

exports.outcomesxml = () => {
  const xml = jsonxml([{ name: "outcomes_definition" }], {
    xmlHeader: true,
    indent: "spaces",
  })
  return { name: "outcomes.xml", xml }
}

exports.questionsxml = () => {
  const xml = jsonxml([{ name: "question_categories" }], {
    xmlHeader: true,
    indent: "spaces",
  })
  return { name: "questions.xml", xml }
}

exports.rolesxml = () => {
  const xml = jsonxml([{ name: "roles_definition" }], {
    xmlHeader: true,
    indent: "spaces",
  })
  return { name: "roles.xml", xml }
}

exports.scalesxml = () => {
  const xml = jsonxml([{ name: "scales_definition" }], {
    xmlHeader: true,
    indent: "spaces",
  })
  return { name: "scales.xml", xml }
}

exports.moodle_backupxml = params => {
  const xml = jsonxml(
    [
      {
        name: "moodle_backup",
        children: [
          {
            name: "information",
            children: [
              { name: "name", text: params.backupname },
              { moodle_version: 2012120300 },
              { moodle_release: "2.4 (Build: 20121203)" },
              { backup_version: 2012112900 },
              { backup_release: 2.4 },
              { name: "backup_date" },
              { mnet_remoteusers: 0 },
              { include_file_references_to_external_content: 0 },
              { original_wwwroot: "https://example.org" },
              { name: "original_site_identifier_hash" },
              { original_course_id: 10 },
              { original_course_fullname: params.coursetitle },
              { original_course_shortname: params.coursetitle },
              { original_course_startdate: 1407110400 },
              { original_course_contextid: 1 },
              { original_system_contextid: 1 },
              {
                name: "details",
                children: [
                  {
                    name: "detail",
                    children: [
                      { type: "course" },
                      { format: "moodle2" },
                      { interactive: 1 },
                      { mode: 10 },
                      { execution: 1 },
                      { executiontime: 0 },
                    ],
                  },
                ],
              },
              {
                name: "contents",
                children: [
                  {
                    name: "activities",
                    children: params.activities.map(a => ({
                      name: "activity",
                      children: [
                        { moduleid: a.modid },
                        { sectionid: a.sectionid },
                        { modulename: "page" },
                        { title: a.title },
                        { directory: `activities/page_${a.modid}` },
                      ],
                    })),
                  },
                  {
                    name: "sections",
                    children: params.sections.map(s => ({
                      name: "section",
                      children: [
                        { sectionid: s.id },
                        { title: s.title },
                        { directory: `sections/section_${s.id}` },
                      ],
                    })),
                  },
                  {
                    name: "course",
                    children: [
                      { courseid: 10 },
                      { title: params.coursetitle },
                      { directory: "course" },
                    ],
                  },
                ],
              },
              {
                name: "settings",
                children: create_settings_children(params),
              },
            ],
          },
        ],
      },
    ],
    {
      xmlHeader: true,
      escape: true,
      indent: " ",
      prettyPrint: true,
    }
  )
  return { name: "moodle_backup.xml", xml }
}

exports.create_page_activity = page => {
  const content = createContentString(page)
  const page_xml = jsonxml(
    [
      {
        name: "activity",
        attrs: {
          id: page.lessonid,
          moduleid: page.modid,
          modulename: "page",
          contextid: page.ctxid,
          exportid: page.exportid,
        },
        children: [
          {
            name: "page",
            attrs: { id: page.lessonid },
            children: [
              { name: "name", text: page.title },
              { name: "intro" },
              { introformat: 1 },
              { content: content },
              { grade: 100 },
              { contentformat: 1 },
              { legacyfiles: 0 },
              { legacyfileslast: "$@NULL@$" },
              { display: 5 },
              {
                displayoptions:
                  'a:2:{s:12:"printheading";s:1:"1";s:10:"printintro";s:1:"0";}',
              },
              { revision: 1 },
              { timemodified: 1433446757 },
            ],
          },
        ],
      },
    ],
    {
      xmlHeader: true,
      escape: true,
      prettyPrint: true,
      indent: " ",
    }
  )

  const grades_xml = jsonxml(
    [
      {
        name: "activity_gradebook",
        children: [
          {
            name: "grade_items",
            children: [
              {
                name: "grade_item",
                attrs: { id: page.gradeitem },
                children: [
                  { categoryid: 1 },
                  { itemname: page.title },
                  { itemtype: "mod" },
                  { itemmodule: "page" },
                  { iteminstance: page.lessonid },
                  { itemnumber: 0 },
                  { iteminfo: "$@NULL@$" },
                  { gradetype: 1 },
                  { grademax: 100 },
                  { grademin: 0.0 },
                  { scaleid: "$@NULL@$" },
                  { outcomeid: "$@NULL@$" },
                  { gradepass: 0.0 },
                  { multfactor: 1.0 },
                  { plusfactor: 0.0 },
                  { aggregationcoef: 0.0 },
                  { sortorder: 8 },
                  { display: 0 },
                  { descimals: "$@NULL@$" },
                  { hidden: 0 },
                  { locked: 0 },
                  { locktime: 0 },
                  { needsupdate: 0 },
                  { timecreated: 1427316857 },
                  { timemodified: 1427316857 },
                  { name: "grade_grades" },
                ],
              },
            ],
          },
          { name: "grade_letters" },
        ],
      },
    ],
    {
      xmlHeader: true,
      indent: "spaces",
    }
  )

  const inforef_xml = jsonxml(
    [
      {
        name: "inforef",
        children: [
          {
            name: "grade_itemref",
            children: [
              { name: "grade_item", children: [{ id: page.lessonid }] },
            ],
          },
        ],
      },
    ],
    {
      xmlHeader: true,
      indent: "spaces",
    }
  )

  const module_xml = jsonxml(
    [
      {
        name: "module",
        attrs: { id: page.modid, version: "2012112900" },
        children: [
          { modulename: "page" },
          { sectionid: page.sectionid },
          { idnumber: page.idnumber },
          { added: 1387404689 },
          { score: 0 },
          { indent: 0 },
          { visible: 1 },
          { visibleold: 1 },
          { groupmode: 0 },
          { groupingid: 0 },
          { groupmembersonly: 0 },
          { completion: 2 },
          { completiongradeitemnumber: 0 },
          { completionview: 0 },
          { completionexpected: 0 },
          { availablefrom: 0 },
          { availableuntil: 0 },
          { showavailability: 1 },
          { showdescription: 0 },
          { name: "availability_info" },
        ],
      },
    ],
    {
      xmlHeader: true,
      indent: "spaces",
    }
  )

  const roles_xml = jsonxml([{ name: "roles_defintion" }], {
    xmlHeader: true,
    indent: "spaces",
  })
  return [
    { name: `activities/page_${page.modid}/page.xml`, xml: page_xml },
    { name: `activities/page_${page.modid}/grades.xml`, xml: grades_xml },
    { name: `activities/page_${page.modid}/inforef.xml`, xml: inforef_xml },
    { name: `activities/page_${page.modid}/module.xml`, xml: module_xml },
    { name: `activities/page_${page.modid}/roles.xml`, xml: roles_xml },
  ]
}

exports.makecourse = course => {
  const course_xml = jsonxml(
    [
      {
        name: "course",
        attrs: { id: 10, contextid: 10 },
        children: [
          { shortname: course.coursetitle },
          { fullname: course.coursetitle },
          { name: "idnumber" },
          {
            summary: `<p>A master course with lessons for all Khan Academy math exercises in the ${course.title}" mission.</p>`,
          },
          { summaryformat: 1 },
          { format: "topics" },
          { showgrades: 1 },
          { newsitems: 0 },
          { startdate: 1407110400 },
          { marker: 0 },
          { maxbytes: 2097152 },
          { legacyfiles: 0 },
          { showreports: 0 },
          { visible: 1 },
          { groupmode: 0 },
          { groupmodeforce: 0 },
          { defaultgroupingid: 0 },
          { name: "lang" },
          { name: "theme" },
          { name: "timecreated" },
          { name: "timemodified" },
          { requested: 0 },
          { enablecompletion: 1 },
          { completionstartonenrol: 1 },
          { completionnotify: 0 },
          { numsections: course.sections.length },
          { hiddensections: 0 },
          { coursedisplay: 0 },
          { name: "tags" },
        ],
      },
    ],
    {
      xmlHeader: true,
      indent: "spaces",
    }
  )

  return [
    { name: "course/course.xml", xml: course_xml },
    {
      name: "course/enrolments.xml",
      xml: '<?xml version="1.0" encoding="UTF-8"?><enrolments/>',
    },
    {
      name: "course/inforef.xml",
      xml: '<?xml version="1.0" encoding="UTF-8"?><inforef/>',
    },
    {
      name: "course/roles.xml",
      xml: '<?xml version="1.0" encoding="UTF-8"?><roles/>',
    },
  ]
}

exports.makesection = section => {
  const xml = jsonxml(
    [
      {
        name: "section",
        attrs: { id: section.id },
        children: [
          { number: section.id },
          { name: "name", text: section.title },
          { summary: "description" },
          { summaryformat: 1 },
          { sequence: section.sequence },
          { visible: 1 },
          { availablefrom: 0 },
          { availableuntil: 0 },
          { showavailability: 1 },
          { groupingid: 0 },
          {
            name: "availability",
            attrs: { id: 1 },
            children: [
              { sourcecmid: "$@NULL@$" },
              { requiredcompletion: 0 },
              { gradeitemid: "$@NULL@$" },
              { grademin: "$@NULL@$" },
              { grademax: "$@NULL@$" },
            ],
          },
        ],
      },
    ],
    { xmlHeader: true, indent: "spaces" }
  )

  return [
    { name: `sections/section_${section.id}/section.xml`, xml },
    {
      name: `sections/section_${section.id}/inforef.xml`,
      xml: '<?xml version="1.0" encoding="UTF-8"?><inforef/>',
    },
  ]
}

function create_settings_children(params) {
  const activitySettings = params.activities.reduce((acc, a) => {
    acc.push({
      name: "setting",
      children: [
        { level: "activity" },
        { activity: `kaskill_${a.modid}` },
        { name: "name", text: `kaskill_${a.modid}_included` },
        { value: 1 },
      ],
    })
    acc.push({
      name: "setting",
      children: [
        { level: "activity" },
        { activity: `kaskill_${a.modid}` },
        { name: "name", text: `kaskill_${a.modid}_userinfo` },
        { value: 0 },
      ],
    })
    return acc
  }, [])

  const sectionSettings = params.sections.reduce((acc, s) => {
    acc.push({
      name: "setting",
      children: [
        { level: "section" },
        { section: `section_${s.id}` },
        { name: "name", text: `section_${s.id}_included` },
        { value: 1 },
      ],
    })
    acc.push({
      name: "setting",
      children: [
        { level: "section" },
        { section: `section_${s.id}` },
        { name: "name", text: `section_${s.id}_userinfo` },
        { value: 0 },
      ],
    })
    return acc
  }, [])

  const settings = [
    ["filename", params.backupname],
    ["imscc11", 0],
    ["users", 0],
    ["anonymize", 0],
    ["role_assignments", 0],
    ["activities", 1],
    ["blocks", 0],
    ["filters", 0],
    ["comments", 0],
    ["calendarevents", 0],
    ["userscompletion", 0],
    ["logs", 0],
    ["grade_histories", 0],
  ].map(([name, value]) => ({
    name: "setting",
    children: [{ level: "root" }, { name: "name", text: name }, { value }],
  }))

  return [...settings, ...sectionSettings, ...activitySettings]
}
