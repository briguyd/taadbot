export enum EmojiCharacters {
  zero = "0⃣",
  one = "1⃣",
  two = "2⃣",
  three = "3⃣",
  four = "4⃣",
  five = "5⃣",
  six = "6⃣",
  seven = "7⃣",
  eight = "8⃣",
  nine = "9⃣",
  ten = "🔟",
  a = "🇦",
  b = "🇧",
  c = "🇨",
  d = "🇩",
  e = "🇪",
  f = "🇫",
  g = "🇬",
  h = "🇭",
  i = "🇮",
  j = "🇯",
  k = "🇰",
  l = "🇱",
  m = "🇲",
  n = "🇳",
  o = "🇴",
  p = "🇵",
  q = "🇶",
  r = "🇷",
  s = "🇸",
  t = "🇹",
  u = "🇺",
  v = "🇻",
  w = "🇼",
  x = "🇽",
  y = "🇾",
  z = "🇿",
  hash = "#⃣",
  asterisk = "*⃣",
  exclamation = "❗",
  question = "❓"
}

export function enumKeys<E>(e: E): (keyof E)[] {
  return Object.keys(e) as (keyof E)[];
}