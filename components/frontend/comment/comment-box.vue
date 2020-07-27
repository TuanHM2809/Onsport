
<template>
  <!-- Contenedor Principal -->
  <div class="comments-container" v-infinite-scroll="fetchListComment" infinite-scroll-disabled="loading" infinite-scroll-distance="10" infinite-scroll-throttle-delay="500">
    <ul id="comments-list" class="comments-list">
      <li>
        <div class="comment-main-level">
          <div class="comment-avatar">
            <!-- <img src="/profile-placeholder.png" alt="profile placeholder"> -->
            <letter-avatar v-if="user" rounded :size="isMobile ? '40': '64'" :name="user.name" />
            <letter-avatar v-else rounded :size="isMobile ? '40': '64'" name="anomynous" />
          </div>
          <div class="comment-box">
            <div class="comment-head" v-if="replyMan">
              <div class="comment-name">
                <h6>* Trả lời: {{ replyMan.name }}</h6>
              </div>
              <i class="fa fa-times" title="Xóa" @click.prevent="replyTo(replyCommentId)"></i>
            </div>
            <div class="comment-block">
              <form @submit.prevent="handleForm">
                <textarea @keydown.enter.prevent="handleForm" v-model="message" cols="30" rows="3" placeholder="Nhập bình luận của bạn"></textarea>
              </form>
              <p>
                <small>*Enter để gửi </small>
              </p>
            </div>
          </div>
        </div>
      </li>
      <!-- Đoạn này thêm vào để tết -->
      <li v-for="comment in list" :key="comment.id">
        <div class="comment-main-level">
          <!-- Avatar -->
          <div class="comment-avatar">
            <!--  <img src="/profile-placeholder.png" alt="profile placeholder"> -->
            <letter-avatar rounded :size="isMobile ? '40': '64'" :name="comment.author.name" />

          </div>
          <!-- Contenedor del Comentario -->
          <div class="comment-box">
            <div class="comment-head">
              <h6 class="comment-name">
                <a v-if="comment.author && comment.author.name" href="#">{{ comment.author.name }}</a>
              </h6>
              <span> {{ fromNow(comment.created_at)}} </span>
              <i class="fa fa-reply" title="Trả lời" @click.prevent="replyTo(comment.id)"></i>
              <i class="fa fa-heart" @click.prevent="likeComment(comment.id)" title="Yêu thích" :class="{'liked': comment.isLike}"></i>
            </div>
            <div class="comment-content">
              {{ comment.content}}
            </div>
          </div>
        </div>
        <!-- Respuestas de los comentarios -->
        <ul v-if="comment.children" class="comments-list reply-list">
          <li v-for="child in comment.children" :key="child.id">
            <!-- Avatar -->
            <div class="comment-avatar">
              <!-- <img src="/profile-placeholder.png" alt="profile placeholder"> -->
              <letter-avatar rounded :size="isMobile ? '40': '50'" :name="child.author.name" />
            </div>
            <!-- Contenedor del Comentario -->
            <div class="comment-box">
              <div class="comment-head">
                <h6 class="comment-name">
                  <a href="#" v-if="child.author && child.author.name">{{ child.author.name}}</a>
                </h6>
                <span>{{ fromNow(child.created_at) }}</span>
                <i class="fa fa-reply" title="Trả lời" @click.prevent="replyTo(child.parent_id)"></i>
                <i class="fa fa-heart" title="Yêu thích" @click.prevent="likeComment(child.id, child.parent_id)" :class="{'liked': child.isLike}"></i>
              </div>
              <div class="comment-content">
                {{ child.content}}
              </div>
            </div>
          </li>
        </ul>
      </li>
      <!-- end Đoạn này thêm vào để tết -->
    </ul>
    <div>
      <loading style="margin: 10px auto" :status="loading" :clockwise="true" :size="40" :speed="0.5"></loading>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import LetterAvatar from '~/components/frontend/comment/letter-avatar.vue'
export default {
  data () {
    return {
      nextPage: 1,
      pageSize: 12,
      message: '',
      list: [],
      totalComment: 0,
      replyCommentId: null,
      loading: false,
      pageLeft: 1
    }
  },
  props: {
    itemType: {
      type: String,
      required: true
    },
    itemId: {
      required: true
    }
  },
  computed: {
    showLoadMore () {
      return this.list.length < this.totalComment
    },
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    user () {
      return this.$store.getters.user
    },
    isMobile () {
      return this.$store.state.size.isMobile
    },
    replyMan () {
      if (this.replyCommentId && this.list.length) {
        return _.find(this.list, comment => (comment.id === this.replyCommentId)).author
      } else {
        return null
      }
    }
  },
  methods: {
    fromNow (time) {
      return moment(time).fromNow()
    },
    replyTo (replyId) {
      if (this.replyCommentId === replyId) {
        this.replyCommentId = null
      } else {
        this.replyCommentId = replyId
      }
    },
    async fetchListComment () {
      try {
        if (this.pageLeft > 0) {
          this.loading = true
          const data = await this.$axios.$get(`comments/${this.itemType}/${this.itemId}/list`, {
            params: {
              page: this.nextPage,
              pageSize: this.pageSize
            }
          }
          )
          this.loading = false
          if (data.code === 0) {
            this.list.push(...data.data.comments)
            this.totalComment = data.data.totalComment // update total Comment
            this.nextPage = this.nextPage + 1 // add next page
            this.pageLeft = data.data.pagination.pageLeft // update page left
          } else {
            this.pageLeft = 0
            this.$toast.error(data.message, {
              duration: 2000
            })
          }
        }
      } catch (e) {
        this.pageLeft = 0
        this.loading = false
        this.$toast.error(e, {
          duration: 2000
        })
      }
    },
    loginRequire () {
      this.$toast.show(' Bạn cần phải đăng nhập để sử dụng tính năng này', {
        duration: 2000,
        action: [
          {
            text: 'Đăng nhập',
            // router navigation
            onClick: (e, toastObject) => {
              this.login()
            }
          },
          {
            text: 'Cancel',
            onClick: (e, toastObject) => {
              toastObject.goAway(0)
            }
          }
        ]
      })
    },
    async likeComment (commentId, parentId = null) {
      // console.log(parentId)
      if (this.$store.getters.isAuthenticated) {
        try {
          let data = await this.$axios.$post(`/comments/${commentId}/like`)
          if (data.code === 0) { // replace comment in array
            if (parentId === null) {
              const newData = data.data
              this.list = _.map(this.list, comment => {
                if (comment.id === newData.id) {
                  return Object.assign(comment, newData)
                } else {
                  return comment
                }
              })
            } else {
              const newData = data.data

              let parent = _.find(this.list, comment => (comment.id === parentId))
              parent.children = _.map(parent.children, child => {
                if (child.id === newData.id) {
                  return Object.assign(child, newData)
                } else {
                  return child
                }
              })
              this.list[_.findIndex(comment => (comment.id === parentId))] = parent
            }
          } else {
            this.$toast.error(data.message)
          }
        } catch (e) {
          this.$toast.error(e)
        }
      } else {
        this.loginRequire()
      }
    },
    async handleForm (e) {
      if (this.$store.getters.isAuthenticated) { // da dang nhap
        try {
          if (this.message) { // co du lieu
            let data = await this.$axios.$post(`/comments/${this.itemType}/${this.itemId}/create`, {
              content: this.message,
              parent_id: this.replyCommentId
            })

            if (data.code === 0) { // thanh cong
              if (this.replyCommentId) { // neu la reply 1 ai no
                let parent = _.find(this.list, comment => (comment.id === this.replyCommentId))
                if (parent.children === undefined) {
                  parent.children = []
                }
                parent.children.unshift(data.data) // them vao dau cua con
                this.list[_.findIndex(this.list, comment => (comment.id === this.replyCommentId))] = parent // thay the con
                this.message = ''
                this.replyCommentId = null // xoa coco
              } else { // con neu khong thi
                this.list.unshift(data.data)
                this.message = ''
              }
            } else { // that bai
              this.$toast.error(data.message, {
                duration: 2000
              })
            }
          }
        } catch (e) {
          this.$toast.error(e)
        }
      } else {
        this.loginRequire()
      }
    },
    resetInitState () {
      this.list = [] // reset ve ban dau
      this.nextPage = 1
      this.pageSize = 12
      this.pageLeft = 1
    }
  },
  watch: {
    async isAuthenticated (auth, oldAuth) {
      this.resetInitState()
      await this.fetchListComment()
    }
  },
  created () {
    // this.fetchListComment()
  },
  mounted () {
  },
  components: {
    LetterAvatar
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

a {
  color: #03658c;
  text-decoration: none;
}

ul {
  list-style-type: none;
}

/** ====================
 * Lista de Comentarios
 =======================*/
.comments-container {
  margin: 15px auto 15px;
  width: 100%;
}

.comments-container h1 {
  font-size: 36px;
  color: #283035;
  font-weight: 400;
}

.comments-container h1 a {
  font-size: 18px;
  font-weight: 700;
}

.comments-list {
  margin-top: 30px;
  position: relative;
}

/**
 * Lineas / Detalles
 -----------------------*/
/*.comments-list:before {
  content: "";
  width: 2px;
  height: 100%;
  background: #c7cacb;
  position: absolute;
  left: 32px;
  top: 0;
}

.comments-list:after {
  content: "";
  position: absolute;
  background: #c7cacb;
  bottom: 0;
  left: 27px;
  width: 7px;
  height: 7px;
  border: 3px solid #dee1e3;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}
 
.reply-list:before,
.reply-list:after {
  display: none;
}
.reply-list li:before {
  content: "";
  width: 60px;
  height: 2px;
  background: #c7cacb;
  position: absolute;
  top: 25px;
  left: -55px;
}
*/
.comment-block {
  padding: 12px;
  background-color: #fff;
  display: block;
  border-radius: 0.1875rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.comment-block textarea {
  width: 100%;
  resize: none;
  border: none;
  outline: none;
}
.comment-block p {
  text-align: right;
  color: #ccc;
}
.comment-block p small {
  cursor: pointer;
  transition: all 0.2 linear;
}
.comment-block p:hover small {
  color: #283035;
}
.comments-list li {
  margin-bottom: 15px;
  display: block;
  position: relative;
}

.comments-list li:after {
  content: "";
  display: block;
  clear: both;
  height: 0;
  width: 0;
}

.reply-list {
  padding-left: 88px;
  clear: both;
  margin-top: 15px;
}
/**
 * Avatar
 ---------------------------*/
.comments-list .comment-avatar {
  width: 65px;
  z-index: 20;
  overflow: hidden;
  display: table-cell;
  vertical-align: top;
  overflow: hidden;
}

.comments-list .comment-avatar img {
  width: 100%;
  height: 100%;
}

.reply-list .comment-avatar {
  width: 50px;
  height: 50px;
}
.comment-main-level {
  display: table;
  width: 100%;
}
.comment-main-level:after {
  content: "";
  width: 0;
  height: 0;
  display: block;
  clear: both;
}
/**
 * Caja del Comentario
 ---------------------------*/
.comments-list .comment-box {
  position: relative;
  display: table-cell;
  vertical-align: top;
  padding-left: 15px;
}

.comments-list .comment-box:before,
.comments-list .comment-box:after {
  content: "";
  height: 0;
  width: 0;
  position: absolute;
  display: block;
  border-width: 10px 12px 10px 0;
  border-style: solid;
  border-color: transparent #fcfcfc;
  top: 8px;
  left: 4px;
}

.comments-list .comment-box:before {
  border-width: 11px 13px 11px 0;
  border-color: transparent rgba(0, 0, 0, 0.05);
  left: 3px;
}

.reply-list .comment-box {
  width: 545px;
}
.comment-box .comment-head {
  background: #fcfcfc;
  padding: 10px 12px;
  border-bottom: 1px solid #e5e5e5;
  overflow: hidden;
  border-radius: 4px 4px 0 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.comment-box .comment-head i {
  float: right;
  margin-left: 14px;
  position: relative;
  top: 2px;
  color: #a6a6a6;
  cursor: pointer;
  transition: color 0.3s ease;
}

.comment-box .comment-head i:hover {
  color: #4545a2;
}
.comment-box .comment-head i.liked {
  color: #4545a2;
}
.comment-box .comment-head i.liked:hover {
  color: #a6a6a6;
}
.comment-box .comment-name {
  color: #283035;
  font-size: 14px;
  font-weight: 700;
  float: left;
  margin-right: 10px;
}

.comment-box .comment-name a {
  color: #283035;
}

.comment-box .comment-head span {
  float: left;
  color: #999;
  font-size: 13px;
  position: relative;
  top: 1px;
}

.comment-box .comment-content {
  background: #fff;
  padding: 12px;
  font-size: 15px;
  color: #595959;
  display: block;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.comment-box .comment-name.by-author,
.comment-box .comment-name.by-author a {
  color: #03658c;
}
.comment-box .comment-name.by-author:after {
  content: "autor";
  background: #03658c;
  color: #fff;
  font-size: 12px;
  padding: 3px 5px;
  font-weight: 700;
  margin-left: 10px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
}

/** =====================
 * Responsive
 ========================*/

@media only screen and (max-width: 768px) {
  .comments-container {
    /* width: 510px; */
    width: 100%;
  }
  .comments-list .comment-avatar {
    width: 42px;
    height: 42px;
  }

  .comments-list .comment-box {
    width: 420px;
    width: calc(100% - 60px);
  }
  .reply-list {
    padding-left: 60px;
    clear: both;
    margin-top: 15px;
  }

  .reply-list .comment-box {
    width: 350px;
    width: calc(100% - 60px);
  }
}
</style>
