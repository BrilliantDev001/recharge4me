export function getPublicLinkUrl(username) {
  if (!username) return "";
  return `${window.location.origin}/u/${username}`;
}

export function getPublicLinkDisplay(username) {
  if (!username) return "";
  return `${window.location.host}/u/${username}`;
}
