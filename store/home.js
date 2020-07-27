export const state = () => {
  return {
    fetching: false,
    data: []
  }
}

export const mutations = {
  REQUEST_HOME (state) {
    state.fetching = true
  },
  GET_HOME_FAILURE (state) {
    state.fetching = false
    state.data = []
  },
  GET_HOME_SUCCESS (state, data) {
    state.fetching = false
    state.data = data
  }
}
