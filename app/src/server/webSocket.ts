// import { type WebSocketDefinition, type WaspSocketData } from 'wasp/server/webSocket'

// export const webSocketFn: WebSocketFn = (io, context) => {
//   io.on('connection', (socket) => {
//     // Handle socket connections and events here
//   })
// }

// // Typing our WebSocket function with the events and payloads
// type WebSocketFn = WebSocketDefinition<
//   ClientToServerEvents, 
//   ServerToClientEvents,
//   InterServerEvents,
//   SocketData
// >

// interface ServerToClientEvents {
//   // Define server-to-client events here
// }

// interface ClientToServerEvents {
//   // Define client-to-server events here  
// }

// interface InterServerEvents {
//   // Define inter-server events here
// }

// interface SocketData extends WaspSocketData {}