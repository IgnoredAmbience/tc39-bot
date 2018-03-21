// These options may be over-ridden in the file '.github/tc39-bot.yml' of target repositories
const defaultConfig = {
  CLACheck: {
    // Log all write actions instead of performing
    dryRun: true,
    // Check all open PRs on bot start
    testOnStart: true,
    // Regular expression to match against PR titles
    titleMatch: /\bNormative\b/i,

    checkCreator: true,
    checkAuthors: false,
    sources: {
      teams: ["delegates"],
      googleSheet: {
        id: "aaaaaaaaaaaa",
        range: "A1:A"
    }}
  }
}

const getConfig = async context => {
  try {
    return await context.config('tc39-bot.yml', defaultConfig)
  } catch (err) {
    return defaultConfig
  }
}

const testCLA = async context => {
  const config = getConfig(context)

  const title = context.payload.pull_request.title
  const username = context.payload.pull_request.user.login
  const isNormative = /\bNormative\b/i.test(title)

  const response = await fetch(`http://spreadsheets.google.com/feeds/list/${SHEET_ID}/od6/public/values?alt=json`)
  const json = await response.json()

  const hasSigned = json.feed.entry.find(entry => entry.username === username)

  context.github.repos.createStatus(context.repo({
    sha: context.payload.pull_request.head.sha,
    state: hasSigned ? 'success' : 'failure',
    target_url: 'https://github.com/...',
    description: `${username} ${hasSigned ? 'has' : 'has not'} signed the CLA`,
    context: 'NormativeCLACheck'
  }))
}

const statusEmoji = {
  success: ":white_check_mark:",
  error: ":x:",
  failure: ":x:",
  pending: ":question:",
  warning: ":warning:"
}

const getPreviousStatus = async (botContext, sha, statusContext) => {
  const {data: statuses} = await botContext.github.repos.getStatuses(botContext.repo({
    ref: sha
  }))
  return statuses.filter(s => s.context === statusContext)[0]
}

const commentUrlToId = url => {
  const result = /#issuecomment-(\d+)/.exec(url)
  return result ? result[1] : undefined
}

const testPR = async context => {
  const config = await getConfig(context)
  const statusContext = "tc39-bot/test"
  const pr = context.payload.pull_request
  const sha = pr.head.sha

  const newState = pr.title
  let commentText = `Current status: ${statusEmoji[newState]} ${newState}`

  const previousStatus = await getPreviousStatus(context, sha, statusContext)
  let commentId
  if (previousStatus) {
    commentText += `\nPrevious status: ${statusEmoji[previousStatus.state]} ${previousStatus.state}`
    commentId = commentUrlToId(previousStatus.target_url)
  }

  let comment
  if (commentId != undefined) {
    ({data: comment} = await context.github.issues.editComment(context.repo({
      id: commentId,
      body: commentText
    })))
  } else {
    ({data: comment} = await context.github.issues.createComment(context.issue({
      body: commentText
    })))
  }

  context.github.repos.createStatus(context.repo({
    sha: pr.head.sha,
    context: statusContext,
    target_url: comment.html_url,
    state: newState
  }))
}

module.exports = robot => {
  robot.on([
    'pull_request.opened',
    'pull_request.edited',
    'pull_request.synchronize',
    //'issue_comment' // needs a wrapper/helper function to fetch correct information
  ], testPR)
}
