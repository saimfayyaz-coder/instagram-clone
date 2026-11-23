// Same rules as the server: unicode #tags, @usernames, no matches inside words or emails
const HASHTAG_REGEX = /(?<![\p{L}\p{N}_])#([\p{L}\p{N}_]+)/gu;
const MENTION_REGEX = /(?<![\w.])@([a-zA-Z0-9._]{1,30})/g;

const countUnique = (caption: string, regex: RegExp) =>
  new Set([...caption.matchAll(regex)].map(match => match[1].toLowerCase())).size;

export const countCaptionTags = (caption: string) => ({
  hashtags: countUnique(caption, HASHTAG_REGEX),
  mentions: countUnique(caption, MENTION_REGEX),
});
