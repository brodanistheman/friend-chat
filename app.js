// Your exact Firebase configuration pre-filled from your screenshot
const firebaseConfig = {
  apiKey: "AIzaSyANBev0K1e06T5aHBC5EKXaswbMwELSkkQ",
  authDomain: "test-912a8.firebaseapp.com",
  databaseURL: "https://test-912a8-default-rtdb.firebaseio.com",
  projectId: "test-912a8",
  storageBucket: "test-912a8.firebasestorage.app",
  messagingSenderId: "990322948527",
  appId: "1:990322948527:web:025a19c36a1e8ce7cad75a",
  measurementId: "G-70LTDPV6HZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let currentUsername = "";

// DOM Elements
const usernameScreen = document.getElementById('username-screen');
const chatScreen = document.getElementById('chat-screen');
const usernameInput = document.getElementById('username-input');
const joinBtn = document.getElementById('join-btn');
const userBadge = document.getElementById('user-badge');
const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');

// User joins chat
joinBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username !== "") {
    currentUsername = username;
    userBadge.textContent = `@${currentUsername}`;
    usernameScreen.style.display = 'none';
    chatScreen.style.display = 'block';
    
    // Start listening for messages once logged in
    listenForMessages();
  }
});

// Allow pressing "Enter" on the username field
usernameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') joinBtn.click();
});

// Send message to Firebase
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  
  if (text !== "") {
    db.ref('messages').push({
      username: currentUsername,
      text: text,
      timestamp: Date.now()
    });
    messageInput.value = "";
  }
});

// Listen for live updates and load saved message history
function listenForMessages() {
  db.ref('messages').on('child_added', (snapshot) => {
    const message = snapshot.val();
    displayMessage(message);
  });
}

function displayMessage(msg) {
  const msgElement = document.createElement('div');
  msgElement.classList.add('msg');
  
  msgElement.innerHTML = `
    <div class="msg-author">${escapeHTML(msg.username)}</div>
    <div class="msg-text">${escapeHTML(msg.text)}</div>
  `;
  
  chatBox.appendChild(msgElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to newest message
}

// Helper function to prevent HTML/script injection
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}