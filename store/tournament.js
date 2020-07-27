export const state = () => {
  return {
    fetching: false,
    data: {},
    all: {
      fetching: false,
      data: []
    },
    standings: [],
    fixtures: {
      fetching: false,
      data: {},
      pagination: {}
    }
  }
}
export const mutations = {
  REQUEST_LIST (state) {
    state.fetching = true
  },
  REQUEST_FIXTURES_LIST (state) {
    state.fixtures.fetching = true
  },
  GET_FIXTURES_SUCCESS (state, action) {
    state.fixtures.fetching = false
    state.fixtures.data = action.data
    state.fixtures.pagination = action.pagination
  },
  ADD_FIXTURES_SUCCESS (state, action) {
    state.fixtures.fetching = false
    state.fixtures.data.push.apply(state.fixtures.data, action.data)
    state.fixtures.pagination = action.pagination
  },
  GET_FIXTURES_FAILURE (state) {
    state.fixtures.fetching = false
    state.fixtures.data = {}
  },
  GET_STANDINGS_SUCCESS (state, action) {
    state.fetching = false
    state.standings = action.data.standings
  },
  GET_STANDINGS_FAILURE (state) {
    state.fetching = false
    state.standings = {}
  },
  GET_LIST_SUCCESS (state, action) {
    state.fetching = false
    state.data = action.data
  },
  GET_LIST_FAILURE (state) {
    state.fetching = false
    state.data = {}
  },
  REQUEST_ALL (state) {
    state.all.fetching = true
  },
  GET_ALL_SUCCESS (state, action) {
    state.all.fetching = false
    state.all.data = action.data
  },
  GET_ALL_FAILURE (state) {
    state.all.fetching = false
    state.all.data = {}
  }
}
