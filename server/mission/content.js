const baseUrl = "https://www.khanacademy.org/embed_video?v="

const createVideoButton = (i, youtubeId) => `
  <button
    onclick="changeVideo('${baseUrl + youtubeId}')"
    style="
      background: #089de3;
      border: thin solid #089de3;
      border-radius: 5px;
      padding: 5px 9px;
      margin: 0 3px;
      color: #fff;
    "
  >
    Video ${i}
  </button>
`

const createVideoString = videos =>
  videos.length > 1
    ? `
<div>
  <iframe
    id="kaskill-ka-player"
    style="width:853px;height:480px;border:none;background-color:ghostwhite;margin:auto;"
    scrolling="no"
    src="http://www.khanacademy.org/embed_video?v=${videos[0]}"
  ></iframe>
</div>
<div>
${videos.map((v, i) => createVideoButton(i + 1, v)).join("")}
</div>
<script type="text/javascript">
 function changeVideo(url){
     document.getElementById("kaskill-ka-player").src = url;
 }
</script>`
    : `<div>
<iframe
  id="kaskill-ka-player"
  style="width:853px;height:480px;border:none;background-color:ghostwhite;margin:auto;"
  scrolling="no"
  src="http://www.khanacademy.org/embed_video?v=${videos[0]}"
></iframe>
</div>`

const createSkillString = skill => {
  const videos = skill.related_videos.map(v => v.youtube_id)
  const videosDescription = skill.image_url
    ? videos.length > 0
      ? `<p>
  These videos will prepare you to solve problems similar
  to the one displayed above. When you are ready, please click
  the button below to practice this skill on Khan Academy.
</p>`
      : `<p>
  When you are ready, please click the button below to practice this
  skill on Khan Academy.
</p>`
    : videos.length > 0
    ? `<p>
  These videos will prepare you to successfully complete this skill on
  Khan Academy. When you are ready, please click the button below to
  practice this skill on Khan Academy.
</p>`
    : `<p>
        When you are ready, please click the button below to practice this
        skill on Khan Academy.
      </p>`

  return `<div style="font-family: Verdana">
  <h2>${skill.title}</h2>
  ${
    skill.image_url
      ? `<div style="text-align: center;">
    <img src="${skill.image_url}" alt="${skill.display_name}"/>
  </div>`
      : ""
  }
  ${videosDescription}
  ${videos.length > 0 ? createVideoString(videos) : ""}
  <div style="margin: auto;text-align:center;">
    <a
      href="${skill.ka_url}"
      target="_blank"
      rel="noopener noreferrer"
      style="color: white;
        font-family: Verdana;
        display: inline-block;
        margin: auto;
        width: 250px;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        background-color: rgb(8, 157, 227);
        text-align: center;
        border-radius: 8px;
        border: thin solid white;
        box-shadow: rgb(0, 0, 0) 0px 0px 3px;
        cursor: pointer;
        text-decoration: none;"
    >
      Take me to practice this skill
    </a>
  </div>
</div>`
}

const createUnitTestString = unitTest => `
<h1 style="text-align: center;">${unitTest.title}</h1>
<h2>
  Before taking the unit test, please make sure that you have completed all of
  the exercises in this unit. You must pass the test with no outside help. If
  you don't get a passing score, I suggest you review the videos and skills that
  have a gold star like this:
  <svg
    aria-hidden="true"
    focusable="false"
    role="img"
    style="display: inline-block; height: 22px; width: 22px;"
    viewbox="0 0 22 22"
  >
    <path d="M15 17a7 7 0 0 1 7-7 7 7 0 0 1-7-7 7 7 0 0 1-7 7 7 7 0 0 1 7 7M4
      12a4 4 0 0 1 4-4 4 4 0 0 1-4-4 4 4 0 0 1-4 4 4 4 0 0 1 4 4M8 20a3 3 0 0 1
      3-3 3 3 0 0 1-3-3 3 3 0 0 1-3 3 3 3 0 0 1 3 3" fill="#ffbe26"></path>
  </svg> Those are the review materials that Khan Academy is
  able to assess based on your performance. Mastery of those is usually the
  fastest route to mastery of the test.
</h2>

<h2>
  Before clicking the button that takes you to the test, make sure you have
  logged into Khan Academy with your school email address and password or else
  your attempt will not be counted.
</h2>

<div style="margin: auto; text-align: center;">
  <a
    href="${unitTest.ka_url}"
    target="_blank"
    rel="noopener noreferrer"
    style="color: white;
      font-family: Verdana;
      display: inline-block;
      margin: auto;
      width: 250px;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      background-color: rgb(8, 157, 227);
      text-align: center;
      border-radius: 8px;
      border: thin solid white;
      box-shadow: rgb(0, 0, 0) 0px 0px 3px;
      cursor: pointer;
      text-decoration: none;"
  >
    Take me to the test
  </a>
</div>
`

const createTopicQuizString = topicQuiz => `
<h1 style="text-align: center;">${topicQuiz.title}</h1>
<h2>
  This quiz will test your mastery of the topic's skills. If you don't get a
  passing score, I suggest you review the videos and skills that have a gold
  star like this:
  <svg
    aria-hidden="true"
    focusable="false"
    role="img"
    style="display: inline-block; height: 22px; width: 22px;"
    viewbox="0 0 22 22"
  >
    <path d="M15 17a7 7 0 0 1 7-7 7 7 0 0 1-7-7 7 7 0 0 1-7 7 7 7 0 0 1 7 7M4
      12a4 4 0 0 1 4-4 4 4 0 0 1-4-4 4 4 0 0 1-4 4 4 4 0 0 1 4 4M8 20a3 3 0 0 1
      3-3 3 3 0 0 1-3-3 3 3 0 0 1-3 3 3 3 0 0 1 3 3" fill="#ffbe26"></path>
  </svg> Those are the review materials that Khan Academy is
  able to assess based on your performance. Mastery of those is usually the
  fastest route to mastery of the test.
</h2>

<h2>
  Before clicking the button that takes you to the test, make sure you have
  logged into Khan Academy with your school email address and password or else
  your attempt will not be counted.
</h2>

<div style="margin: auto; text-align: center;">
  <a
    href="${topicQuiz.ka_url}"
    target="_blank"
    rel="noopener noreferrer"
    style="color: white;
      font-family: Verdana;
      display: inline-block;
      margin: auto;
      width: 250px;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      background-color: rgb(8, 157, 227);
      text-align: center;
      border-radius: 8px;
      border: thin solid white;
      box-shadow: rgb(0, 0, 0) 0px 0px 3px;
      cursor: pointer;
      text-decoration: none;"
  >
    Take me to the quiz
  </a>
</div>
`

const createContentString = content => {
  switch (content.kind) {
    case "Exercise":
      return createSkillString(content)

    case "Video":
      return createVideoString([content])

    case "TopicQuiz":
      return createTopicQuizString(content)

    case "TopicUnitTest":
      return createUnitTestString(content)

    default:
      return createSkillString(content)
  }
}

module.exports = {
  createVideoString,
  createSkillString,
  createUnitTestString,
  createTopicQuizString,
  createContentString,
}
