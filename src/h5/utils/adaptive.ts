export const isIOS = (): any => {
  const user = navigator.userAgent
  return !!user.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}
