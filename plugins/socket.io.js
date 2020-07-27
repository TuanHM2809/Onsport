import io from 'socket.io-client'
const socket = io.connect(process.env.wsUrl)
export default socket
