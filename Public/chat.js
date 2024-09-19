// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
  };
  firebase.initializeApp(firebaseConfig);
  
  // Initialize Firestore and Authentication
  const auth = firebase.auth();
  const db = firebase.firestore();
  const socket = io();
  
  function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    const userId = auth.currentUser.uid;
  
    // Send message via Socket.io
    socket.emit('sendMessage', { message, userId });
    messageInput.value = '';
  }
  
  socket.on('receiveMessage', (data) => {
    const messagesContainer = document.getElementById('messages');
    const newMessage = document.createElement('div');
    newMessage.textContent = `${data.userId}: ${data.message}`;
    messagesContainer.appendChild(newMessage);
  });
  
  // Fetch existing messages from Firestore
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const snapshot = await db.collection('messages').orderBy('timestamp').get();
      snapshot.forEach((doc) => {
        const message = doc.data();
        const messagesContainer = document.getElementById('messages');
        const newMessage = document.createElement('div');
        newMessage.textContent = `${message.userId}: ${message.message}`;
        messagesContainer.appendChild(newMessage);
      });
    }
  });