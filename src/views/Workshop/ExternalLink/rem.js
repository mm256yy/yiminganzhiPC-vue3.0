export function changeScale() {
  const normalBox = document.getElementById('LeaderSide_work_home_rem')
  const widthScale = window.innerWidth / 1920
  const heightScale = window.innerHeight / 1080
  document.body.style.width = '1920px'
  document.body.style.height = '1080px'
  document.body.style.overflow = 'hidden'
  // document.body.style.background = "#070818";
  normalBox.style.width = '1920px'
  normalBox.style.height = '1080px'
  normalBox.style.transformOrigin = 'left top'
  normalBox.style.transition = '.3s ease-in-out'
  const bottom = 1080 - 1080 * heightScale
  normalBox.style.marginBottom = `-${bottom}px`
  normalBox.style.transform = `scale(${widthScale}, ${heightScale})`
}
