export function getRem() {
  const width = window.innerWidth >= 1280 ? window.innerWidth : 1280
  const rem = width * (100 / 1920)
  return rem
}
