export const state = () => ({
  isMobile: false,
  width: 0
})
const MOBILE = 768
export const mutations = {
  checkMobile (state, width) {
    state.isMobile = width < MOBILE
    state.width = width
  }
}
