// import apiConfig from '~/api.config.js'
// import axios from '~/plugins/axios'
import moment from 'moment'
// import socket from '~/plugins/socket.io'
export const state = () => ({
  isLogging: false,
  user: null,
  token: null,
  error: null
})

export const mutations = {
  SET_USER: function (state, user) {
    state.user = user
  },
  SET_ERROR: function (state, e) {
    state.error = e
  },
  SET_TOKEN: function (state, token) {
    state.token = token
  },
  SET_LOGGING: function (state, logging) {
    state.isLogging = logging
  }
}
export const getters = {
  isAuthenticated (state) {
    return !!state.token && state.user
  },
  user (state) {
    return state.user
  },
  reverseEvents (state) {
    if (state.match) {
      return state.match.events.slice().reverse()
    }
    return []
  }
  // reverseTournamentFixtures (state) {
  //   if (state.tournament) {
  //     return state.tournament.fixtures.data.slice().reverse()
  //   }
  //   return []
  // }
}

export const actions = {
  async nuxtServerInit (store, { req }) {
    const initAppData = [
      store.dispatch('getUserData', req),
      store.dispatch('loadHome'),
      store.dispatch('loadSettings'),
      store.dispatch('loadMenu')
      // store.dispatch('loadMatchResults')
    ]
    const result = await Promise.all(initAppData)
    return result
  },
  cabLoginRequested ({ commit }) {
    commit('SET_LOGGING', true)
  },
  async cabLogoutRequested ({ commit, state }) {
    try {
      const data = await this.$axios.$post(`${process.env.baseUrlApi}/logout`, {
        token: state.token
      })
      if (data.code !== 0) {
        if (data.code === 404) {
          commit('SET_TOKEN', null)
          commit('SET_USER', null)
          this.$axios.setToken(false) // update axios module
        }
        // commit('SET_ERROR', data.message)
        this.$toast.error(data.message)
      } else {
        commit('SET_TOKEN', null)
        commit('SET_USER', null)

        this.$axios.setToken(false) // update axios module

        // await this.$axios.$get(`${process.env.ssoServer}/Logout`)
        this.$toast.show('Đăng xuất thành công', {
          action: {
            text: 'Đóng',
            onClick: (e, toastObject) => {
              toastObject.goAway(0)
            }
          }
        })
      }
    } catch (e) {
      commit('SET_ERROR', e)
    }
  },
  async cabLoginSuccess ({ commit, dispatch }, token) {
    await commit('SET_TOKEN', token)
    await dispatch('getUserProfile')
    commit('SET_LOGGING', false)
  },
  cabLoginFailure ({ state, commit }) {
    if (state.isLogging) {
      commit('SET_LOGGING', false)
    }
  },
  async getUserProfile ({ state, commit }) {
    try {
      const data = await this.$axios.$get(`${process.env.baseUrlApi}/get-profile?token=${state.token}`)
      if (data.code !== 0) {
        commit('SET_ERROR', data.message)
      } else {
        commit('SET_USER', data.data)
      }
    } catch (e) {
      commit('SET_ERROR', e)
    }
  },
  getUserData ({ commit }, req) {
    if (req.session && req.session.user) {
      commit('SET_USER', req.session.user)
    }
    if (req.session && req.session.user && req.session.user.access_token) {
      commit('SET_TOKEN', req.session.user.access_token)
    }
  },
  async loadHome ({ commit }, params = {}) {
    commit('home/REQUEST_HOME')

    try {
      const response = await this.$axios.get('/home')
      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      if (success) commit('home/GET_HOME_SUCCESS', response.data.data)
      if (!success) commit('home/GET_HOME_FAILURE')
    } catch (e) {
      commit('home/GET_HOME_FAILURE', e)
    }
  },
  async loadCategory ({ commit }, params = {}) {
    commit('category/REQUEST_LIST')
    try {
      // const response = await this.$axios.get(`categories/${params.id}`, {
      const response = await this.$axios.get(`categories/${params.id}/withEvent`, {
        params: {
          page: params.page || 1,
          pageSize: params.pageSize || 30
        }
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)

      const isFirstPage = params.page && params.page > 1
      const commitName = `category/${isFirstPage ? 'ADD' : 'GET'}_LIST_SUCCESS`
      if (success) commit(commitName, response.data)
      if (!success) commit('category/GET_LIST_FAILURE')
    } catch (e) {
      commit('category/GET_LIST_FAILURE')
    }
  },
  async loadPundit ({ commit }, params = {}) {
    commit('pundit/REQUEST_LIST')

    try {
      const response = await this.$axios.get(`pundits/${params.id}`, {
        params: {
          page: params.page || 1,
          pageSize: params.pageSize || 15
        }
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)

      const isFirstPage = params.page && params.page > 1
      const commitName = `pundit/${isFirstPage ? 'ADD' : 'GET'}_LIST_SUCCESS`
      if (success) commit(commitName, response.data)
      if (!success) commit('pundit/GET_LIST_FAILURE')
    } catch (e) {
      commit('pundit/GET_LIST_FAILURE')
    }
  },
  async loadPundits ({ commit }, params = { page: 1, pageSize: 15 }) {
    commit('pundit/REQUEST_TOTAL_LIST')
    try {
      const response = await this.$axios.get(`pundits`, {
        page: params.page,
        pageSize: params.pageSize
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      if (success) commit('pundit/GET_TOTAL_LIST_SUCCESS', response.data.data)
      if (!success) commit('pundit/GET_TOTAL_LIST_FAILURE')
    } catch (e) {
      commit('pundit/GET_TOAL_LIST_FAILURE')
    }
  },
  async loadAuthor ({ commit }, params = { page: 1, pageSize: 15 }) {
    commit('author/REQUEST_LIST')
    try {
      const response = await this.$axios.get(`authors/${params.id}`, {
        params: {
          page: params.page || 1,
          pageSize: params.pageSize || 15
        }
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      const isFirstPage = params.page && params.page > 1
      const commitName = `author/${isFirstPage ? 'ADD' : 'GET'}_LIST_SUCCESS`
      if (success) commit(commitName, response.data)
      if (!success) commit('author/GET_LIST_FAILURE')
    } catch (e) {
      commit('author/GET_LIST_FAILURE')
    }
  },
  async loadAuthors ({ commit }, params = { page: 1, pageSize: 15 }) {
    commit('author/REQUEST_TOTAL_LIST')
    try {
      const response = await this.$axios.get(`authors`, {
        page: params.page,
        pageSize: params.pageSize
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      if (success) commit('author/GET_TOTAL_LIST_SUCCESS', response.data.data)
      if (!success) commit('author/GET_TOTAL_LIST_FAILURE')
    } catch (e) {
      commit('author/GET_TOAL_LIST_FAILURE')
    }
  },
  async loadChannel ({ commit }, params = {}) {
    commit('livechannel/REQUEST_LIST')
    try {
      const response = await this.$axios.get(`/live-channels/${params.id}`)
      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      if (success) commit(`livechannel/GET_LIST_SUCCESS`, response.data)
      if (!success) commit('livechannel/GET_LIST_FAILURE')
    } catch (e) {
      console.log(e)
      commit('livechannel/GET_LIST_FAILURE', e)
    }
  },
  async loadChannels ({ commit }, params = { page: 1, pageSize: 15 }) {
    commit('livechannel/REQUEST_TOTAL_LIST')
    try {
      const response = await this.$axios.get(`live-channels`, {
        page: params.page || 1,
        pageSize: params.pageSize || 15
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      if (success) commit('livechannel/GET_TOTAL_LIST_SUCCESS', response.data.data)
      if (!success) commit('livechannel/GET_TOTAL_LIST_FAILURE')
    } catch (e) {
      commit('livechannel/GET_TOAL_LIST_FAILURE')
    }
  },
  setInfoSocket ({ commit }, payload) {
    commit('socket/SET_INFO', payload)
  },
  async loadTag ({ commit }, params = { page: 1, pageSize: 15 }) {
    commit('tag/REQUEST_LIST')
    try {
      const response = await this.$axios.get(`tags/${params.id}`, {
        params: {
          page: params.page || 1,
          pageSize: params.pageSize || 15
        }
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)

      const isFirstPage = params.page && params.page > 1
      const commitName = `tag/${isFirstPage ? 'ADD' : 'GET'}_LIST_SUCCESS`
      if (success) commit(commitName, response.data)
      if (!success) commit('tag/GET_LIST_FAILURE')
    } catch (e) {
      commit('tag/GET_LIST_FAILURE')
    }
  },
  async loadTags ({ commit }, params = { page: 1, pageSize: 15 }) {
    commit('tag/REQUEST_TOTAL_LIST')
    try {
      const response = await this.$axios.get(`tags`, {
        page: params.page || 1,
        pageSize: params.pageSize || 50
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      if (success) commit('tag/GET_TOTAL_LIST_SUCCESS', response.data.data)
      if (!success) commit('tag/GET_TOTAL_LIST_FAILURE')
    } catch (e) {
      commit('tag/GET_TOAL_LIST_FAILURE')
    }
  },
  async loadMenu ({ commit }) {
    commit('menu/REQUEST_LIST')
    try {
      const response = await this.$axios.get(`menu`)
      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      if (success) commit('menu/GET_LIST_SUCCESS', response.data.data)
      if (!success) commit('menu/GET_LIST_FAILURE')
    } catch (e) {
      commit('menu/GET_LIST_FAILURE')
    }
  },
  async search ({ commit }, params = { page: 1, pageSize: 15 }) {
    commit('search/REQUEST_LIST')
    try {
      const response = await this.$axios.get(`search`, {
        params: {
          page: params.page || 1,
          pageSize: params.pageSize || 15,
          query: params.query || ''
        }
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)

      const isFirstPage = params.page && params.page > 1
      const commitName = `search/${isFirstPage ? 'ADD' : 'GET'}_LIST_SUCCESS`
      if (success) commit(commitName, response.data)
      if (!success) commit('search/GET_LIST_FAILURE')
    } catch (e) {
      commit('search/GET_LIST_FAILURE')
    }
  },
  async loadSettings ({ commit }) {
    commit('settings/REQUEST_LIST')
    try {
      const response = await this.$axios.get('settings', {
        params: {
          fields: 'ads_image,ads_title,ads_url,show_events,show_events_text'
        },
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      })

      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      if (success) commit('settings/GET_LIST_SUCCESS', response.data.data)
      if (!success) commit('settings/GET_LIST_FAILURE')
    } catch (e) {
      commit('settings/GET_LIST_FAILURE')
    }
  },
  async loadLongForm ({ commit }, params = {}) {
    commit('longform/REQUEST_LIST')
    try {
      const response = await this.$axios.get(`posts`, {
        params: {
          type: 'longform',
          page: params.page || 1,
          pageSize: params.pageSize || 12
        }
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)

      const isFirstPage = params.page && params.page > 1
      const commitName = `longform/${isFirstPage ? 'ADD' : 'GET'}_LIST_SUCCESS`
      if (success) commit(commitName, response.data)
      if (!success) commit('longform/GET_LIST_FAILURE')
    } catch (e) {
      commit('longform/GET_LIST_FAILURE')
    }
  },

  async loadEvents ({ commit }, params = {}) {
    commit('event/REQUEST_LIST')
    try {
      const response = await this.$axios.get(`events`, {
        params: {
          page: params.page || 1,
          pageSize: params.pageSize || 12
        }
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      const isFirstPage = params.page && params.page > 1
      const commitName = `event/${isFirstPage ? 'ADD' : 'GET'}_LIST_SUCCESS`
      if (success) commit(commitName, response.data)
      if (!success) commit('event/GET_LIST_FAILURE')
    } catch (e) {
      commit('event/GET_LIST_FAILURE')
    }
  },
  async loadVideos ({ commit }, params = {}) {
    commit('video/REQUEST_LIST')
    try {
      const response = await this.$axios.get(`videos`, {
        params: {
          page: params.page || 1,
          pageSize: params.pageSize || 12
        }
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)

      const isFirstPage = params.page && params.page > 1
      const commitName = `video/${isFirstPage ? 'ADD' : 'GET'}_LIST_SUCCESS`
      if (success) commit(commitName, response.data)
      if (!success) commit('video/GET_LIST_FAILURE')
    } catch (e) {
      commit('video/GET_LIST_FAILURE')
    }
  },
  async loadMatches ({ commit }, params = {}) {
    // console.log(params)
    commit('livescore/REQUEST_LIST')
    try {
      const response = await this.$axios.get(`matches`, {
        params: {
          page: params.page || 1,
          pageSize: params.pageSize || 15,
          end_date: moment.utc().add(7, 'hour').format('YYYY-MM-DD'),
          tournament_id: params.id || ''
        }
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)

      const isFirstPage = params.page && params.page > 1
      const commitName = `livescore/${isFirstPage ? 'ADD' : 'GET'}_LIST_SUCCESS`
      if (success) commit(commitName, response.data)
      if (!success) commit('livescore/GET_LIST_FAILURE')
    } catch (e) {
      commit('livescore/GET_LIST_FAILURE')
    }
  },
  async loadMatchEvents ({ commit }, params = {}) {
    commit('match/REQUEST_LIST')
    try {
      const response = await this.$axios.get(`matches/${params.id}/events`, {
        params: {
          id: params.id || 15
        }
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      if (success) commit(`match/GET_EVENTS_SUCCESS`, response.data)
      if (!success) commit('match/GET_LIST_FAILURE')
    } catch (e) {
      commit('match/GET_LIST_FAILURE')
    }
  },
  async loadMatchStats ({ commit }, params = {}) {
    commit('match/REQUEST_LIST')
    try {
      const response = await this.$axios.get(`matches/${params.id}/stats`, {
        params: {
          id: params.id || 15
        }
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      if (success) commit(`match/GET_STATS_SUCCESS`, response.data)
      if (!success) commit('match/GET_LIST_FAILURE')
    } catch (e) {
      commit('match/GET_LIST_FAILURE')
    }
  },
  async loadTournament ({ commit }, params = {}) {
    commit('tournament/REQUEST_LIST')
    try {
      const response = await this.$axios.get(`/tournaments/${params.id}`)
      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      if (success) commit(`tournament/GET_LIST_SUCCESS`, response.data)
      if (!success) commit('tournament/GET_LIST_FAILURE')
    } catch (e) {
      console.log(e)
      commit('tournament/GET_LIST_FAILURE', e)
    }
  },
  async loadTournamentStandings ({ commit }, params = {}) {
    commit('tournament/REQUEST_LIST')
    try {
      const response = await this.$axios.get(`/tournaments/${params.id}/standing`)
      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      if (success) commit(`tournament/GET_STANDINGS_SUCCESS`, response.data)
      if (!success) commit('tournament/GET_STANDINGS_FAILURE')
    } catch (e) {
      console.log(e)
      commit('tournament/GET_LIST_FAILURE', e)
    }
  },
  async loadTournamentFixtures ({ commit }, params = {}) {
    // console.log(params)
    commit('tournament/REQUEST_FIXTURES_LIST')
    try {
      const response = await this.$axios.get(`matches`, {
        params: {
          page: params.page || 1,
          pageSize: params.pageSize || 15,
          start_date: params.startDate || moment.utc().add(7, 'hour').format('YYYY-MM-DD'),
          end_date: params.endDate || moment.utc().add(7, 'hour').add(1, 'year').format('YYYY-MM-DD'),
          tournament_id: params.id || ''
        }
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)

      const isFirstPage = params.page && params.page > 1
      const commitName = `tournament/${isFirstPage ? 'ADD' : 'GET'}_FIXTURES_SUCCESS`
      if (success) commit(commitName, response.data)
      if (!success) commit('tournament/GET_FIXTURES_FAILURE')
    } catch (e) {
      commit('tournament/GET_FIXTURES_FAILURE')
    }
  },
  async loadTournaments ({ commit }, params = {}) {
    commit('tournament/REQUEST_ALL')
    try {
      const response = await this.$axios.get(`/tournaments`, {
        params: {
          page: 1,
          pageSize: 100 // sau thi se theo sport
        }
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      if (success) commit(`tournament/GET_ALL_SUCCESS`, response.data)
      if (!success) commit('tournament/GET_ALL_FAILURE')
    } catch (e) {
      commit('tournament/GET_ALL_FAILURE')
    }
  },
  async loadMatchResults ({ commit }, params = {}) {
    commit('matchResult/REQUEST_LIST')
    try {
      const response = await this.$axios.get(`/match-results`)
      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      if (success) commit(`matchResult/GET_LIST_SUCCESS`, response.data)
      if (!success) commit('matchResult/GET_LIST_FAILURE')
    } catch (e) {
      commit('matchResult/GET_LIST_FAILURE')
    }
  },
  async loadSchedules ({ commit }, params = {}) {
    commit('schedule/REQUEST_LIST')
    try {
      const response = await this.$axios.get('/live-channels', {
        params: {
          // start_date: '2018-01-07'
          start_date: params.startDate,
          end_date: params.endDate
        }
      })
      const success = !!response.status && response.data && Object.is(response.data.code, 0)
      if (success) commit(`schedule/GET_LIST_SUCCESS`, response.data)
      if (!success) commit('schedule/GET_LIST_FAILURE')
    } catch (e) {
      commit('schedule/GET_LIST_FAILURE')
    }
  }

}
