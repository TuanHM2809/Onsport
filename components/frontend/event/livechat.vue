<!--<template>
  <div class="chat is-visible" :class="{hideChat: hideChat}">
    <div v-bind:data-href="'http://onsports.vn/'+this.$route.fullPath" class="fb-comments" data-width="100%" data-numposts="2"></div>
  </div>
</template>
-->
<template>
  <div class="chat is-visible" :class="{hideChat: hideChat}">
    <div class="chat_header">
      <span id="chat_head">Trò chuyện trực tiếp</span>
      <div class="chat_loader" :class="{'is-loading' : beat}"></div>
      <div class="chat_option" :class="{'is-dropped': showOption}" @click="showOption = !showOption">
        <i class="fa fa-ellipsis-v"></i>
        <ul>
          <li class=" option_item" @click.prevent="toggleChat">
            <span>{{hideChat ? 'Hiện' : 'Ẩn'}} cuộc trò chuyện</span>
          </li>
        </ul>
      </div>

    </div>
    <div v-show="!hideChat" id="chat_converse" class="chat_converse is-max" v-chat-scroll="{always: false, smooth: true}">
      <div v-for="(item, index) in messages" :key="index" class="chat_msg_wrap">
        <span class="chat_msg_item chat_msg_item_admin">
          <div class="chat_avatar">
            <letter-avatar v-if="item.author.name" size="28" :name="item.author.name" round />
            <img v-else src="/profile-placeholder.png">
          </div>
          <span class="is-small-text author-name">{{ item.author.name }}: &nbsp;</span>
          {{ item.content }}
        </span>
      </div>
      <div id="botOfChatConverse" style="height: 1px;"></div>
    </div>
    <div v-show="!hideChat" class="fab_field top_field">
      <a class="short_hand ripple" @click.prevent="shorthandSend('👋👋👋')">
        👋👋👋
      </a>
      <a class="short_hand ripple" @click.prevent="shorthandSend('👍')">
        👍
      </a>
      <a class="short_hand ripple" @click.prevent="shorthandSend('👎')">
        👎
      </a>
      <a class="short_hand ripple" @click.prevent="shorthandSend('❤️❤️❤️')">
        ❤️❤️❤️
      </a>
    </div>
    <div v-show="!hideChat" class="fab_field">
      <a id="fab_emoji" class="fab ripple" @click.prevent="showEmoji = !showEmoji">
        <i :class="`fa ${showEmoji? 'fa-keyboard-o': 'fa-smile-o'}`"></i>
      </a>
      <input @input="replaceEmoji" ref="messageField" id="chatSend" v-model="message" name="chat_message" placeholder="Hãy nói gì đó..." class="chat_field chat_message" @keyup.enter="sendMessage" @keydown.esc="showEmoji = false" />
      <a id="fab_send" class="fab ripple" @click.prevent="sendMessage">
        <i class="fa fa-send"></i>
      </a>
    </div>
    <div class="emoji-box" v-show="showEmoji">
      <picker :showPreview="false" :showCategories="false" emoji='flag-vn' title="ON Sports" :emoji-size="emojiSize" :per-line="perLine" :skin="skin" :native="native" :set="activeSet" :auto-focus="autoFocus" :include="categories" :exclude="exclude" @select="addEmoji">
      </picker>
    </div>
  </div>
</template>


<script>
import LetterAvatar from '~/components/frontend/comment/letter-avatar.vue'
import io from 'socket.io-client'
import moment from 'moment'
//import from 'lodash'

const mapEmoji = {
  '<3': '\u2764\uFE0F',
  '</3': '\uD83D\uDC94',
  ':D': '\uD83D\uDE00',
  ':)': '\uD83D\uDE03',
  ';)': '\uD83D\uDE09',
  ':(': '\uD83D\uDE12',
  ':p': '\uD83D\uDE1B',
  ';p': '\uD83D\uDE1C',
  ":'(": '\uD83D\uDE22'
}
export default {
  data () {
    return {
      messages: [],
      socket: null,
      showOption: false,
      beat: true,
      message: '',
      room: null,
      hideChat: false,
      showEmoji: false,
      emojiSize: 24,
      perLine: 9,
      skin: 1,
      native: true,
      activeSet: 'messenger',
      currentEmoji: {
        id: '+1'
      },

      autoFocus: false,
      include: [],
      exclude: [],
      categories: [
        'recent',
        'people'
        // 'nature',
        // 'foods',
        // 'activity',
        // 'places',
        // 'objects',
        // 'symbols',
        // 'flags'
      ]
    }
  },
  props: {
    type: {
      type: String,
      default: 'event'
    },
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  },
  created () {
    // this.fetchData()
  },
  mounted () {
    if (this.isAuthenticated) {
      this.initSocket()
    }
    window.FB.XFBML.parse();
  },
  methods: {
    sendMessage: function () {
      if (!this.isAuthenticated) return
      if (this.message) {
        const now = +moment()
        this.socket.emit('newMessage', {
          roomId: this.room.id,
          message: {
            content: this.message,
            createdDate: now
          }
        })
        this.messages.push({
          content: this.message,
          createdDate: now,
          author: {
            name: this.$store.getters.user.name,
            picture: this.$store.getters.user.avatar
          }
        })
        this.message = ''
      }
    },
    escapeSpecialChars (regex) {
      return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1')
    },
    replaceEmoji (e) {
      for (let i in mapEmoji) {
        let regex = new RegExp(this.escapeSpecialChars(i), 'gim')
        this.message = e.target.value = e.target.value.replace(regex, mapEmoji[i])
      }
    },
    toggleChat () {
      this.hideChat = !this.hideChat
      this.showEmoji = false
      this.$emit('hideChat', this.hideChat)
    },
    addEmoji (emoji) {
      this.currentEmoji = emoji
      this.message += emoji.native
      this.$refs.messageField.focus()
    },
    shorthandSend (nativeCode) {
      if (!this.isAuthenticated) return
      const now = +moment()
      this.socket.emit('newMessage', {
        roomId: this.room.id,
        message: {
          content: nativeCode,
          createdDate: now
        }
      })

      this.messages.push({
        content: nativeCode,
        createdDate: now,
        author: {
          name: this.$store.getters.user.name,
          picture: this.$store.getters.user.avatar
        }
      })
    },
    initSocket () {
      if (this.socket !== null) {
        return false
      }
      this.socket = io.connect(`${process.env.socketHost}/chatroom`, {
        transports: ['websocket'],
        forceNew: false
      })

      this.socket.on('connect', () => {
        this.socket.emit('auth', {
          token: this.$store.state.token
        })
      })
      this.socket.on('authResult', data => {
        if (data.code === 0) {
          this.socket.emit('join', `onsports_${this.type}_${this.id}`)
        }
      })
      this.socket.on('joinResult', (data) => {
        if (data.code === 0) {
          this.room = data.room
          this.socket.emit('getHistory', {
            size: 10,
            id: data.room.id
          })
        }
      })
      this.socket.on('addMessage', data => {
        console.log('pushdata', data)
        this.messages.push(data)
      })
      this.socket.on('getHistoryResult', data => {
        this.messages = data.messages
      })
      this.socket.on('messageResult', data => {
        if (data.code == -10) {
          // you type too fast
          this.$toast.error(data.message)
        }
      })
    }
  },
  watch: {
    isAuthenticated (newValue) {
      if (newValue) { // neu dang nhap thi init socket
        this.initSocket()
      } else { // neu dang xuat
        if (this.socket) {
          this.socket.disconnect()
          this.socket = null
        }
      }
    }
  },
  beforeDestroy () {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
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
  border-radius: 0px;
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  border: 1px solid rgba(222, 222, 222, 1);
}

.chat > div:not(.show_converse) {
  display: none;
}

.chat_header {
  padding: 10px;
  font-size: 16px;
  font-family: "Roboto";
  font-weight: 700;
  background-color: rgba(222, 222, 222, 1);
}

.chat_header .span {
  float: right;
}

.chat_loader {
  display: none;
  float: right;
  background: rgba(0, 0, 0, 0);
  height: 8px;
  width: 8px;
  margin: 5px 10px 0 0;
  border-radius: 50%;
  border: solid 2px #263238;
}

.chat.is-visible {
  opacity: 1;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.chat.is-visible.hideChat {
  height: 44px;
}

.chat.is-visible > div:not(.show_converse) {
  display: block;
  opacity: 1;
}
.chat.is-visible > div.fab_field:not(.show_converse) {
  display: flex;
  opacity: 1;
  padding-bottom: 10px;
}

.chat_option {
  float: left;
  font-size: 1.5em;
  list-style: none;
  position: relative;
  width: 20px;
  height: 100%;
  cursor: pointer;
  text-align: relative;
  margin-right: 10px;
}

.chat_option ul {
  display: none;
  position: absolute;
  list-style: none;
  top: -10px;
  left: 100%;
  background: #eceff1;
  border-radius: 5px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.16), 0 6px 12px rgba(0, 0, 0, 0.32);
  padding: 0;
  z-index: 29;
  width: auto;
  min-width: 200px;
}

.chat_option ul li {
  float: none;
  position: relative;
}

.option_item {
  display: block;
  width: 100%;
  margin: 4px 10px;
  box-sizing: content-box;
  float: left;
  font-size: 12px;
}

.chat_option.is-dropped > ul {
  display: block;
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
  margin: 7px 0 7px 0;
  width: 100%;
  font-family: "Roboto";
  font-size: 16px;
  line-height: 30px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  -webkit-font-smoothing: antialiased;
  border: none;
  outline: none;
  /*background: #eceff1;*/
  border-radius: 8px;
  padding-left: 5px;
  background-color: #fff;
  display: inline-block;
}

.chat_field.chat_message {
  height: 30px;
  resize: none;
}

.chat_converse {
  position: relative;
  background: inherit;
  /*margin: 6px 0 0 0;*/
  /*max-height: 356px;*/
  min-height: 0;
  height: 100%;
  font-size: 14px;
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
  width: 28px;
  height: 28px;
  font-size: 16px;
  line-height: 28px;
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
  margin: 5px 10px;
  padding: 5px 0px;
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
  z-index: 28;
}

.chat .chat_converse .chat_msg_item .chat_avatar {
  position: absolute;
  top: 0;
  /* box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28); */
}

.chat .chat_converse .chat_msg_item.chat_msg_item_admin .chat_avatar {
  left: -43px;
  background: rgba(255, 255, 255, 0.6);
}

.chat .chat_converse .chat_msg_item.chat_msg_item_user .chat_avatar {
  right: -43px;
  background: rgba(0, 0, 0, 0.6);
}

.chat .chat_converse .chat_msg_item .chat_avatar {
  width: 28px;
  height: 28px;
  text-align: center;
  overflow: hidden;
  border-radius: 50%;
  line-height: 1;
}

.chat .chat_converse .chat_msg_item .chat_avatar > i {
  font-size: 16px;
  line-height: 28px;
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
  margin-left: 54px;
  float: left;
  /*background: rgba(255, 255, 255, 0.4);
  color: #263238; */
}

.chat .chat_converse .chat_msg_item.chat_msg_item_user {
  margin-right: 54px;
  float: right;
  /* background: rgba(0, 0, 0, 0.4);
  color: #eceff1; */
}

.chat .chat_converse .chat_msg_item.chat_msg_item_user .is-small-text {
  color: #fceff1;
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

.fab_field.top_field {
  justify-content: flex-start;
  padding: 7px;
  padding-bottom: 0;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: hidden;
}

.fab_field {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  color: #000;
  background-color: rgba(222, 222, 222, 1);
  padding: 7px 0;
  /* box-shadow: 0 0 6px rgba(0, 0, 0, 0.16), 0 6px 12px rgba(0, 0, 0, 0.32); */
}
.fab_field a {
  display: inline-block;
  text-align: center;
}

.fab_field.show_converse {
  padding: 0px 15px;
  background: inherit;
  cursor: pointer;
  font-weight: 700;
  line-height: 2.8;
  box-shadow: none;
}
.fab_field.show_converse p {
  border-top: 1px solid #ccc;
}
.fab_field.show_converse p.no_border {
  border: none;
}

.fab_field.show_converse p:hover {
  color: #000;
}

#fab_icon {
  float: left;
  background: rgba(0, 0, 0, 0);
  border-radius: 50%;
  position: relative;
}

.fab_field .fab {
  width: 35px;
  height: 30px;
  box-shadow: none;
  margin: 7px;
}

.fab_field .fab > i {
  font-size: 1.6em;
  line-height: 30px;
  color: #263238;
}
.short_hand {
  background-color: #eee;
  color: #000;
  border-radius: 17.5px;
  display: block;
  height: 28px;
  line-height: 28px;
  padding: 0 10px;
  margin: 10px;
  margin-left: 0;
  cursor: pointer;
}
.short_hand:hover {
  background-color: #fff;
}

.ripple {
  position: relative;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
}

.ripple:after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #000 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform 0.5s, opacity 1s;
}

.ripple:active:after {
  transform: scale(0, 0);
  opacity: 0.2;
  transition: 0s;
}

.emoji-box {
  position: absolute;
  z-index: 10;
  left: 0;
  top: 100%;
  box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
  background: white;
  max-height: 300px;
  overflow-y: auto;
}

@keyframes ripple {
  /*scale the element to 250% to safely cover the entire link and fade it out*/
  100% {
    opacity: 0;
    -moz-transform: scale(5);
    -ms-transform: scale(5);
    webkit-transform: scale(5);
    transform: scale(5);
  }
}
</style>

