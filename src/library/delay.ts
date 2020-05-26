export function delay(n = 0) {
  return new Promise<void>(r => setTimeout(r, n))
}