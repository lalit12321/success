const  send = require('process');

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "https://success-xi.vercel.app",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New client connected' + socket.id);

    socket.on('send-location', (data) => {
      //console.log('Received location:', data);
        io.emit('receive-location', { id: socket.id, ...data });
      });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        io.emit('user-disconnect', socket.id);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
/*export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Vercel!' });
}*/
