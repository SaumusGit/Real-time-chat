const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-admin-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-project-id>.firebaseio.com",
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

io.on('connection', (socket) => {
    console.log('New client connected');
  
    // Listen for new messages from clients
    socket.on('sendMessage', async (data) => {
      const { message, userId } = data;
  
      // Save the message to Firestore
      const db = admin.firestore();
      await db.collection('messages').add({
        userId,
        message,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
  
      // Broadcast the message to all clients
      io.emit('receiveMessage', data);
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });