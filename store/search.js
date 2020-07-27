export const state = () => {
  return {
    fetching: false,
    data: [],
    pagination: {}
  }
}

export const mutations = {
  REQUEST_LIST (state) {
    state.fetching = true
  },
  GET_LIST_SUCCESS (state, action) {
    state.fetching = false
    state.data = action.data
    state.pagination = action.pagination
  },
  ADD_LIST_SUCCESS (state, action) {
    state.fetching = false
    state.data.push.apply(state.data, action.data)
    state.pagination = action.pagination
  },
  GET_LIST_FAILURE (state) {
    state.fetching = false
    state.data = []
    state.pagination = {}
  }
}
