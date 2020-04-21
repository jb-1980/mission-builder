const KHAN_URL = "https://www.khanacademy.org"
const baseUrl = `${KHAN_URL}/embed_video?v=`

const buttonLink = (url, label) => `
  <a
    style="
      text-decoration:none;
      color:white;
      background-color:#1865f2;
      padding:5px 10px;
      border-radius:5px;
      font-size:20px"
    rel="noreferrer noopener"
    href="${KHAN_URL + url}"
    target="_blank"
  >
    ${label}
  </a>
`

const loginWarning = () => `<h4 style="color:red">
** Rember to log into your Khan Academy account before doing the activity,
   or you won't get credit **
</h4>`

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

const createVideoString = (videos, standAlone) => {
  let str = standAlone ? loginWarning : ""
  return str + videos.length > 1
    ? `
<div>
  <iframe
    id="kaskill-ka-player"
    style="width:853px;height:480px;border:none;background-color:ghostwhite;margin:auto;"
    scrolling="no"
    src="${baseUrl}${videos[0]}"
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
  src="${baseUrl}${videos[0]}"
></iframe>
</div>`
}

const createSkillString = (content) => {
  const videos = content.related_videos
  const videosDescription = content.image_url
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
  <h2>${content.title}</h2>
  ${
    content.image_url
      ? `<div style="text-align: center;">
    <img src="${content.image_url}" alt="${content.display_name}"/>
  </div>`
      : ""
  }
  ${videosDescription}
  ${videos.length > 0 ? createVideoString(videos) : ""}
  <div style="margin: auto;text-align:center;">
    ${buttonLink(content.url, "Take me to practice this skill")}
  </div>
</div>`
}

const createUnitTestString = (content) => `
<h1 style="text-align: center;">${content.title}</h1>
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
  ${buttonLink(content.url, "Take me to the test")}
</div>
`

const createTopicQuizString = (content) => `
<h1 style="text-align: center;">${content.title}</h1>
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
  ${buttonLink(content.url, "Take me to the quiz")}
</div>
`

const createArticleString = (content) => `
<div style="text-align:center">
  <h2>
    You will now read an article on Khan Academy.
    Please click the button to access the article on Khan Academy.
  </h2>
  ${buttonLink(content.url, `Article -- ${content.title}`)}
  <h4 style="color:red">
    ** Rember to log into your Khan Academy account before doing the activity,
       or you won't get credit **
  </h4>
</div>
`

const createChallengeString = (content) => `
<div style="text-align:center">
  <h2>
    Now you will complete a coding challenge on Khan Academy. Just click the button
    to access it.
  </h2>
  ${buttonLink(content.url, `Challenge -- ${content.title}`)}
  <h4 style="color:red">
    ** Rember to log into your Khan Academy account before doing the activity,
       or you won't get credit **
  </h4>
</div>
`

const createProjectString = (content) => `
<div style="text-align:center">
  <h2>
    Now you will complete a coding Project on Khan Academy. Just click the button
    to access it.
  </h2>
  ${buttonLink(content.url, `Project -- ${content.title}`)}
  <h4 style="color:red">
    ** Rember to log into your Khan Academy account before doing the activity,
       or you won't get credit **
  </h4>
</div>
`

const createTalkthroughString = (content) => `
<div style="text-align:center">
  <h2>Please click the button to complete the talkthrough activity on Khan Academy.</h2>
  ${buttonLink(content.url, `Talkthrough -- ${content.title}`)}
  <h4 style="color:red">
    ** Rember to log into your Khan Academy account before doing the activity,
       or you won't get credit **
  </h4>
</div>
`

const createContentString = (content) => {
  switch (content.kind) {
    case "Article":
      return createArticleString(content)

    case "Challenge":
      return createChallengeString(content)

    case "Exercise":
      return createSkillString(content)

    case "Project":
      return createProjectString(content)

    case "Talkthrough":
      return createTalkthroughString(content)

    case "TopicQuiz":
      return createTopicQuizString(content)

    case "TopicUnitTest":
      return createUnitTestString(content)

    case "Video":
      return createVideoString(content.related_videos, true)

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
