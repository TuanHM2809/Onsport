export default function ({ store, $axios, redirect }) {
  // console.log(redirect)

  $axios.onRequest(config => {
    if (store.state.token) {
      $axios.setToken(store.state.token, 'Bearer')
    }
  })

  $axios.onResponse(response => {
    if (store.state.token) {
      $axios.setToken(store.state.token, 'Bearer')
    }
  })

  // $axios.onError(error => {
  //   const code = parseInt(error.response && error.response.status)
  //   // console.log(code)
  //   if (code === 400) {
  //     redirect('/400')
  //   }
  // })
}
