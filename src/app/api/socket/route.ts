// import { Server } from "socket.io"
// import type { NextApiRequest } from "next"
// import type { NextApiResponse, ServerResponse } from "next"

// interface DrawingPoint {
//   x: number
//   y: number
//   color?: string
//   size?: number
//   tool?: "pen" | "eraser"
// }

// interface ServerToClientEvents {
//   users: (users: { id: string; name: string; color: string }[]) => void
//   draw: (data: { points: DrawingPoint[]; tool: "pen" | "eraser" }) => void
//   clear: () => void
// }

// interface ClientToServerEvents {
//   startDrawing: (point: DrawingPoint) => void
//   draw: (point: DrawingPoint) => void
//   endDrawing: (data: { points: DrawingPoint[]; tool: "pen" | "eraser" }) => void
//   clear: () => void
// }

// interface InterServerEvents {
//   ping: () => void
// }

// interface SocketData {
//   name: string
//   age: number
//   currentDrawing?: DrawingPoint[]
// }

// // Store active rooms and their users
// const rooms = new Map<string, Map<string, { name: string; color: string }>>()

// // Generate a random color for new users
// function getRandomColor() {
//   const colors = [
//     "#F44336",
//     "#E91E63",
//     "#9C27B0",
//     "#673AB7",
//     "#3F51B5",
//     "#2196F3",
//     "#03A9F4",
//     "#00BCD4",
//     "#009688",
//     "#4CAF50",
//     "#8BC34A",
//     "#CDDC39",
//     "#FFC107",
//     "#FF9800",
//     "#FF5722",
//   ]
//   return colors[Math.floor(Math.random() * colors.length)]
// }

// type ServerWithSocket = ServerResponse & {
//   socket: {
//     server: {
//       io: Server
//     }
//   }
// }

// export default function handler(req: NextApiRequest, res: NextApiResponse & { socket: ServerWithSocket }) {
//   if (res.socket?.server.io) {
//     console.log("Socket is already running")
//     res.end()
//     return
//   }

//   const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(res.socket?.server)

//   if (res.socket) {
//     res.socket.server.io = io
//   }

//   io.on("connection", (socket) => {
//     const { roomId } = socket.handshake.query
//     const socketId = socket.id

//     if (!roomId || typeof roomId !== "string") {
//       socket.disconnect()
//       return
//     }

//     // Join the room
//     socket.join(roomId)

//     // Initialize room if it doesn't exist
//     if (!rooms.has(roomId)) {
//       rooms.set(roomId, new Map())
//     }

//     // Add user to room
//     const roomUsers = rooms.get(roomId)!
//     roomUsers.set(socketId, {
//       name: `User ${roomUsers.size + 1}`,
//       color: getRandomColor(),
//     })

//     // Broadcast updated user list
//     const users = Array.from(roomUsers.entries()).map(([id, user]) => ({
//       id,
//       name: user.name,
//       color: user.color,
//     }))

//     io.to(roomId).emit("users", users)

//     // Handle drawing events
//     socket.on("startDrawing", (point) => {
//       // Store the first point
//       socket.data.currentDrawing = [point]
//     })

//     socket.on("draw", (point) => {
//       if (!socket.data.currentDrawing) {
//         socket.data.currentDrawing = []
//       }

//       // Add point to current drawing
//       socket.data.currentDrawing.push(point)

//       // Broadcast to other users in the room
//       socket.to(roomId).emit("draw", {
//         points: [socket.data.currentDrawing[socket.data.currentDrawing.length - 2] || point, point],
//         tool: point.tool || "pen",
//       })
//     })

//     socket.on("endDrawing", (data) => {
//       // Broadcast complete drawing to other users
//       socket.to(roomId).emit("draw", data)

//       // Clear current drawing
//       socket.data.currentDrawing = undefined
//     })

//     socket.on("clear", () => {
//       // Broadcast clear command to all users in the room
//       io.to(roomId).emit("clear")
//     })

//     // Handle disconnection
//     socket.on("disconnect", () => {
//       if (rooms.has(roomId)) {
//         const roomUsers = rooms.get(roomId)!
//         roomUsers.delete(socketId)

//         // Remove room if empty
//         if (roomUsers.size === 0) {
//           rooms.delete(roomId)
//         } else {
//           // Broadcast updated user list
//           const users = Array.from(roomUsers.entries()).map(([id, user]) => ({
//             id,
//             name: user.name,
//             color: user.color,
//           }))

//           io.to(roomId).emit("users", users)
//         }
//       }
//     })
//   })

//   console.log("Socket.io server started")
//   res.end()
// }



import { Server } from "socket.io"
import type { NextApiRequest, NextApiResponse } from "next"

interface DrawingPoint {
  x: number
  y: number
  color?: string
  size?: number
  tool?: "pen" | "eraser"
}

interface ServerToClientEvents {
  users: (users: { id: string; name: string; color: string }[]) => void
  draw: (data: { points: DrawingPoint[]; tool: "pen" | "eraser" }) => void
  clear: () => void
}

interface ClientToServerEvents {
  startDrawing: (point: DrawingPoint) => void
  draw: (point: DrawingPoint) => void
  endDrawing: (data: { points: DrawingPoint[]; tool: "pen" | "eraser" }) => void
  clear: () => void
}

interface InterServerEvents {
  ping: () => void
}

interface SocketData {
  name: string
  age: number
  currentDrawing?: DrawingPoint[]
}

// Store active rooms and their users
const rooms = new Map<string, Map<string, { name: string; color: string }>>()

// Generate a random color for new users
function getRandomColor() {
  const colors = [
    "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5",
    "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50",
    "#8BC34A", "#CDDC39", "#FFC107", "#FF9800", "#FF5722"
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

type ServerWithSocket = {
  io?: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket) {
    console.log("Socket server is not available")
    res.end()
    return
  }

  const server = res.socket as unknown as ServerWithSocket

  if (server.io) {
    console.log("Socket is already running")
    res.end()
    return
  }

  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>((res.socket as any).server)
  server.io = io

  io.on("connection", (socket) => {
    const rawRoomId = socket.handshake.query.roomId
    const roomId = Array.isArray(rawRoomId) ? rawRoomId[0] : rawRoomId

    if (!roomId || typeof roomId !== "string") {
      socket.disconnect()
      return
    }

    const socketId = socket.id
    socket.join(roomId)

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map())
    }

    const roomUsers = rooms.get(roomId)!
    roomUsers.set(socketId, {
      name: `User ${roomUsers.size + 1}`,
      color: getRandomColor(),
    })

    // Broadcast updated user list
    const users = Array.from(roomUsers.entries()).map(([id, user]) => ({
      id,
      name: user.name,
      color: user.color,
    }))

    io.to(roomId).emit("users", users)

    // Handle drawing events
    socket.on("startDrawing", (point) => {
      socket.data.currentDrawing = [point]
    })

    socket.on("draw", (point) => {
      if (!socket.data.currentDrawing) {
        socket.data.currentDrawing = []
      }

      socket.data.currentDrawing.push(point)

      socket.to(roomId).emit("draw", {
        points: [socket.data.currentDrawing[socket.data.currentDrawing.length - 2] || point, point],
        tool: point.tool || "pen",
      })
    })

    socket.on("endDrawing", (data) => {
      socket.to(roomId).emit("draw", data)
      socket.data.currentDrawing = undefined
    })

    socket.on("clear", () => {
      io.to(roomId).emit("clear")
    })

    socket.on("disconnect", () => {
      if (rooms.has(roomId)) {
        const roomUsers = rooms.get(roomId)!
        roomUsers.delete(socketId)

        if (roomUsers.size === 0) {
          rooms.delete(roomId)
        } else {
          const users = Array.from(roomUsers.entries()).map(([id, user]) => ({
            id,
            name: user.name,
            color: user.color,
          }))

          io.to(roomId).emit("users", users)
        }
      }
    })
  })

  console.log("Socket.io server started")
  res.end()
}
