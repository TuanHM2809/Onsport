export const state = () => {
  return {
    fetching: false,
    events: [],
    stats: {},
    info: {}
  }
}
export const mutations = {
  REQUEST_LIST (state) {
    state.fetching = true
  },
  GET_EVENTS_SUCCESS (state, action) {
    state.fetching = false
    state.info = action.data
    state.events = action.data.match_events
  },
  GET_STATS_SUCCESS (state, action) {
    state.fetching = false
    state.info = action.data
    state.stats = action.data.stats
  },
  GET_LIST_FAILURE (state) {
    state.fetching = false
    state.events = []
    state.stats = {}
  }
}
