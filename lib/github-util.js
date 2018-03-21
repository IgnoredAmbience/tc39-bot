/** Converts a GitHub issue comment URL (html_url parameter of the comment object) to the issue id */
const commentUrlToId = url => {
  const result = /#issuecomment-(\d+)/.exec(url)
  return result ? result[1] : undefined
}

