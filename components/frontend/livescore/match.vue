<template>
  <li>
    <div class="bet-match">
      <!-- <div class="bet-right-img">
                <img :src="item.poster_url" alt="" width="220" height="105">
                <b class="opacity-b"></b>
            </div> -->

      <div class="bet-match-body bet-match-middle bet-list-body is-flex-widescreen">
        <div class="match-info-wrap">
          <div class="phet p-l-10" style="flex:1; ">
            <strong style="font-weight: 700" v-if="item.status === `Final`"> FT </strong>
            <strong style="font-weight: 700" v-if="item.status === `Pre-Game`"> {{formatTime(item)}} </strong>
            <strong style="font-weight: 700" v-if="item.status === `In-Progress`"> Live </strong>
          </div>
          <div class="spinach-item-team " v-if="item.home">
            <div class="spinach-item-data ">
              <p class="spinach-item-name ">
                <span class="ellipsis-nghia spinach-name-length" :title="item.home.name">{{ !isMobile? item.home.name: item.home.abbreviation }}</span>
              </p>
            </div>
            <div class="spinach-item-img pull-right" v-if="item.home ">
              <img width="32" height="32" :src="buildSrc(item.home.thumbnail) || '/logo-team.png'" :alt="item.home.name">
            </div>
          </div>
          <div class="spinach-item-center" :style="{flex: isMobile ? 8 : 4}" v-if="item.status === `Final` || item.status === `In-Progress`">
            <nuxt-link :to="handleLink({item_type: 'match',id: item.id})">
              <p class="spinach-item-score">{{ item.home.score }} : {{ item.away.score }}</p>
            </nuxt-link>
          </div>
          <div class="spinach-item-center" :style="{flex: isMobile ? 8 : 4}" v-if="item.status === `Pre-Game`">
            <p class="spinach-item-score">vs</p>
          </div>
          <div class="spinach-item-team " v-if="item.away">
            <div class="spinach-item-img pull-left" v-if="item.away">
              <img width="32" height="32" :src="buildSrc(item.away.thumbnail) || '/logo-team.png'" :alt="item.away.name">
              <i class="spinach-status-lose"></i>
            </div>
            <div class="spinach-item-data ">
              <p class="spinach-item-name">
                <span class="ellipsis-nghia spinach-name-length" :title="item.away.name">{{ !isMobile? item.away.name: item.away.abbreviation }}</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>

  </li>
</template>

<style>
</style>

<script>
    import moment from 'moment'

    export default {
      data () {
        return {
        }
      },
      props: {
        item: Object,
        required: true,
        history: {
          type: Boolean,
          default: false
        }
      },
      computed: {
        isMobile () {
          return this.$store.state.size.isMobile
        }
      },
      methods: {
        formatTime (item) {
          return moment(item.start_at).utc().add(7, 'hour').format('HH:mm')
        },
        isComming (item) {
        //   return item.allow_bet === 0 && moment(item.match_start).isSameOrAfter(moment())
        },
        sportLink (item) {
          return {
            name: 'Sport',
            params: {
              id: item.id
            }
          }
        },
        matchLink (item) {
          return {
            name: 'Match',
            params: {
              id: item.id
            }
          }
        },
        testHttpLink (link) {
          const pattern = new RegExp('^(http|https)')
          return pattern.test(link)
        },
        buildSrc (src) {
          if (src) {
            return this.testHttpLink(src) ? `${src}` : `http://static.onsports.vn/${src}`
          } else {
            return false
          }
        }
      },
      components: {},
      mounted () {
        // console.log(moment('2017-10-21T14:00:00.000Z').isSameOrAfter(moment()))
      }
    }
</script>
