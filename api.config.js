const isProdMode = Object.is(process.env.NODE_ENV, 'production')
export default {
  cdnUrl: 'https://micros.onsports.vn/resize',
  baseUrl: isProdMode ? 'https://api.onsports.vn' : 'http://localhost:8000',
  socketHost: isProdMode ? 'https://onsports.vn' : 'https://test-api.vtvplay.vn',
  ssoServer: process.env.SSO_SERVER,
  ssoClientId: process.env.SSO_CLIENT_WEB
}
