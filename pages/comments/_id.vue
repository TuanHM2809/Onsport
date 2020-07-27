<template>
  <div v-if="comments" class="chat">
    <div id="chat_converse" class="chat_converse is-max">
      <div v-for="(item, index) in comments" :key="index" class="chat_msg_wrap">
        <span class="chat_msg_item chat_msg_item_admin">
          <div class="chat_avatar">
            <letter-avatar v-if="item.author.name" size="64" :name="item.author.name" round />
            <img v-else src="/profile-placeholder.png">
          </div>
          <span class="is-small-text author-name">{{ item.author.name }} &nbsp;</span>
          {{ item.content }}
        </span>
      </div>
      <div id="botOfChatConverse" style="height: 1px;"></div>
    </div>
  </div>
</template>


<script>
import LetterAvatar from '~/components/frontend/comment/letter-avatar.vue'
export default {
  name: 'comments_id',
  layout: 'blank',
  async asyncData ({app, params}) {
    try {
      const event = await app.$axios.$get(`/events/${params.id}`)
      if (event.code === 0) {
        return {
          event: event.data
        }
      }
      return {
        event: {}
      }
    } catch (e) {
      return {
        event: {}
      }
    }
  },
  validate ({ params }) {
    return (!!params.id)
  },
  data () {
    return {
      comments: []
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  },
  created () {
    this.fetchData()
  },
  mounted () {
    setInterval(() => {
      this.fetchData()
    }, 3000)
    // window.LetterAvatar = LetterAvatar
    // document.addEventListener('DOMContentLoaded', function (event) {
    //   window.LetterAvatar(window, document, '', 32).transform()
    // })
  },
  beforeDestroy () {},
  methods: {
    async fetchData () {
      try {
        const data = await this.$axios.$get(`comments/event/${this.event.id}/list`, {
          params: {
            page: 1,
            pageSize: 5
          },
          progress: false
        })
        if (data.code === 0) {
          this.comments = data.data.comments
        } else {
          this.comments = []
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  watch: {
  },
  components: {
    LetterAvatar
  }
}
</script>

<style scoped>
.chat {
  width: 100%;
  font-size: 12px;
  line-height: 22px;
  font-family: "Roboto";
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  font-smoothing: antialiased;
  box-shadow: 0 1.5px 4px rgba(0, 0, 0, 0.24), 0 1.5px 6px rgba(0, 0, 0, 0.12);
  border-radius: 0px;
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.is-small-text {
  font-size: 100%;
  font-weight: 700;
  line-height: 1.21429;
}
.author-name.is-small-text {
  font-size: 100%;
  color: rgba(17, 17, 17, 0.6);
}

.chat_option.is-dropped > ul {
  display: block;
}

.chat_field {
  position: relative;
  margin: 5px 0 5px 0;
  width: 50%;
  font-family: "Roboto";
  font-size: 16px;
  line-height: 30px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  -webkit-font-smoothing: antialiased;
  font-smoothing: antialiased;
  border: none;
  outline: none;
  /*background: #eceff1;*/
  display: inline-block;
}

.chat_field.chat_message {
  height: 30px;
  background: inherit;
  resize: none;
}

.chat_converse {
  position: relative;
  background: inherit;
  /*margin: 6px 0 0 0;*/
  /*max-height: 356px;*/
  min-height: 0;
  font-size: 28px;
  line-height: 1.333;
  overflow-y: auto;
  width: 100%;
  float: right;
  font-weight: 700;
}

.scroll-to-bottom.show_arrow {
  opacity: 1;
}

.chat .scroll-to-bottom i.fa {
  width: 64px;
  height: 64px;
  font-size: 32px;
  line-height: 64px;
  color: #fff;
}

.chat_list {
  opacity: 0;
  visibility: hidden;
  height: 0;
}

.chat_list .chat_list_item {
  opacity: 0;
  visibility: hidden;
}
.chat .chat_converse .chat_msg_wrap {
  overflow-y: auto;
}

.chat .chat_converse .chat_msg_item {
  position: relative;
  margin: 22px 10px 22px 0;
  padding: 4px 0px;
  max-width: 90%;
  display: block;
  word-wrap: break-word;
  /*box-shadow: 0 4px 8px rgba(0, 0, 0, 0.28); */
  border-radius: 3px;
  -webkit-animation: zoomIn 0.5s cubic-bezier(0.42, 0, 0.58, 1);
  -moz-animation: zoomIn 0.5s cubic-bezier(0.42, 0, 0.58, 1);
  -o-animation: zoomIn 0.5s cubic-bezier(0.42, 0, 0.58, 1);
  animation: zoomIn 0.5s cubic-bezier(0.42, 0, 0.58, 1);
  clear: both;
  z-index: 999;
}

.chat .chat_converse .chat_msg_item .chat_avatar {
  position: absolute;
  top: 0;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);
}

.chat .chat_converse .chat_msg_item.chat_msg_item_admin .chat_avatar {
  left: -76px;
  background: rgba(255, 255, 255, 0.6);
}

.chat .chat_converse .chat_msg_item.chat_msg_item_user .chat_avatar {
  right: -76px;
  background: rgba(0, 0, 0, 0.6);
}

.chat .chat_converse .chat_msg_item .chat_avatar {
  width: 64px;
  height: 64px;
  text-align: center;
  overflow: hidden;
  border-radius: 50%;
}

.chat .chat_converse .chat_msg_item .chat_avatar > i {
  font-size: 45px;
  line-height: 64px;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

.chat .chat_converse .chat_msg_item_admin .chat_avatar > img {
  width: inherit;
  height: inherit;
  border-radius: 50%;
}

.chat .chat_converse .chat_msg_item_user .chat_avatar > img {
  width: inherit;
  height: inherit;
  border-radius: 50%;
}

.chat .chat_converse .chat_msg_item.chat_msg_item_admin {
  margin-left: 90px;
  float: left;
  /*background: rgba(255, 255, 255, 0.4);
  color: #263238; */
}

.chat .chat_converse .chat_msg_item.chat_msg_item_user {
  margin-right: 90px;
  float: right;
  /* background: rgba(0, 0, 0, 0.4);
  color: #eceff1; */
}

.chat .chat_converse .chat_msg_item.chat_msg_item_user .is-small-text {
  color: #fceff1;
}

.chat .chat_converse .chat_msg_item.chat_msg_item_admin:before {
  content: "";
  position: absolute;
  top: 15px;
  left: -12px;
  z-index: 998;
  border: 6px solid transparent;
  border-right-color: rgba(255, 255, 255, 0.4);
}

.chat_msg_item.chat_msg_item_user:before {
  content: "";
  position: absolute;
  top: 15px;
  right: -12px;
  z-index: 998;
  border: 6px solid transparent;
  border-left-color: rgba(0, 0, 0, 0.4);
}

strong.chat_time {
  padding: 0 1px 1px 0;
  font-weight: 500;
  font-size: 8px;
  display: block;
}
</style>

