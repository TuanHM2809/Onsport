export const state = () => {
  return {
    fetching: false,
    detail: {
      fetching: false,
      data: {

      }
    },
    total: {
      fetching: false,
      data: []
    }
  }
}

export const mutations = {
  REQUEST_LIST (state) {
    state.detail.fetching = true
  },
  GET_LIST_SUCCESS (state, action) {
    state.detail.fetching = false
    state.detail.data = action.data
  },
  GET_LIST_FAILURE (state) {
    state.detail.fetching = false
  },
  CLEAR_LIST (state) {
    state.list.data = {
      detai: {
        fetching: false,
        data: {

        }
      }
    }
  },
  // Total
  REQUEST_TOTAL_LIST (state) {
    state.total.fetching = true
  },
  GET_TOTAL_LIST_FAILURE (state) {
    state.total.fetching = false
  },
  GET_TOTAL_LIST_SUCCESS (state, data) {
    state.total.fetching = false
    state.total.data = data
  }
}
