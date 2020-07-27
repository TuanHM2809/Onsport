export const state = () => ({
  status: false,
  x: 0,
  y: 0
})
export const mutations = {
  SET_INFO (state, payload) {
    const { status, x, y } = payload
    state.status = status
    state.x = x
    state.y = y
  }
}
