const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const placeRoutes = require('./routes/place');
const typeDefs = require('./graphQl/schema');
const resolvers = require('./graphQl/resolver');

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/sync',placeRoutes);
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Setup GraphQL with Apollo Server
async function startApolloServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' }); // GraphQL endpoint at /graphql

  // Start HTTP server
  const PORT = process.env.PORT || 3000;
  server.listen(3000, () => {
    console.log(`🚀 HTTP server listening on http://localhost:3000`);
    console.log(`📡 GraphQL endpoint ready at http://localhost:3000${apolloServer.graphqlPath}`);
  });
}

startApolloServer();

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
