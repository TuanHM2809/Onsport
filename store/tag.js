export const state = () => {
  return {
    fetching: false,
    detail: {
      fetching: false,
      data: {
        data: [],
        pagination: {}
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
    state.detail.data.data = action.data
    state.detail.data.pagination = action.pagination
  },
  ADD_LIST_SUCCESS (state, action) {
    console.log('add list success')
    state.detail.fetching = false
    state.detail.data.data.items.push.apply(state.detail.data.data.items, action.data.items)
    state.detail.data.pagination = action.pagination
  },
  GET_LIST_FAILURE (state) {
    state.detail.fetching = false
  },
  CLEAR_LIST (state) {
    state.list.data = {
      detai: {
        fetching: false,
        data: {
          pagination: {
          },
          data: []
        }
      }
    }
  },
  // Total
  REQUEST_TOTAL_LIST (state) {
    state.total.fetching = true
  },
  GET_TOAL_LIST_FAILURE (state) {
    state.total.fetching = false
  },
  GET_TOTAL_LIST_SUCCESS (state, data) {
    state.total.fetching = false
    state.total.data = data
  }
}
