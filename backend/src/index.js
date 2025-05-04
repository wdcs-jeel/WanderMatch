const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
io.on('connection', (socket) => {
  console.log('a user connected');
    socket.on("send msg",(data)=>{
        //for broadcasting (io.emit)
        //emit the event from the server to the rest of the users.
        console.log('receive msg',data);
        io.emit('received msg', data);      
        
    })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});