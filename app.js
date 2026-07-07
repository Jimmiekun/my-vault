const firebaseConfig = {
  apiKey: "AIzaSyAdsYVHxvlBwgv5RaJKVAKIZy0qHmHaMpA",
  authDomain: "for-portfolio-630cf.firebaseapp.com",
  projectId: "for-portfolio-630cf",
  storageBucket: "for-portfolio-630cf.firebasestorage.app",
  messagingSenderId: "68085148173",
  appId: "1:68085148173:web:33f0968e2eba07c8268344",
  measurementId: "G-LV1GCM1PR9"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Enterprise Event Logger
const EventLogger = {
  log: (msg) => {
    const feed = document.getElementById('log-feed');
    const entry = document.createElement('div');
    entry.textContent = `> ${new Date().toLocaleTimeString()}: ${msg}`;
    feed.prepend(entry);
  }
};

// UI Handlers
document.getElementById('toggle-pass')?.addEventListener('click', function() {
  const p = document.getElementById('pass');
  p.type = p.type === 'password' ? 'text' : 'password';
  this.textContent = p.type === 'password' ? 'Show' : 'Hide';
});

auth.onAuthStateChanged(user => {
  const login = document.getElementById('login-screen');
  const app = document.getElementById('app-screen');
  
  if (user) {
    login.classList.add('hidden');
    app.classList.remove('hidden');
    EventLogger.log("Auth success: User Session Initialized");
    loadItems();
  } else {
    login.classList.remove('hidden');
    app.classList.add('hidden');
    EventLogger.log("System locked. Waiting for login.");
  }
});

document.getElementById('login-btn').addEventListener('click', async () => {
  const e = document.getElementById('email').value;
  const p = document.getElementById('pass').value;
  try {
    await auth.signInWithEmailAndPassword(e, p);
  } catch {
    await auth.createUserWithEmailAndPassword(e, p);
  }
});

document.getElementById('add-btn').addEventListener('click', async () => {
  const name = document.getElementById('itemName').value;
  const url = document.getElementById('itemUrl').value;
  if (!name || !url) return;

  await db.collection('vaults').doc(auth.currentUser.uid).collection('items').add({
    name, url, timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  EventLogger.log(`Resource added: ${name}`);
});

function loadItems() {
  db.collection('vaults').doc(auth.currentUser.uid).collection('items')
    .orderBy('timestamp', 'desc')
    .onSnapshot(snap => {
      const grid = document.getElementById('grid');
      grid.innerHTML = '';
      snap.forEach(doc => {
        const d = doc.data();
        grid.innerHTML += `
          <div class="vault-card">
            <h3 class="font-bold text-lg mb-2">${d.name}</h3>
            <a href="${d.url}" target="_blank" class="text-pink-500 font-bold text-sm">Launch →</a>
            <button onclick="deleteItem('${doc.id}')" class="text-xs ml-4 text-gray-500">Remove</button>
          </div>
        `;
      });
    });
}

window.deleteItem = (id) => {
  db.collection('vaults').doc(auth.currentUser.uid).collection('items').doc(id).delete();
  EventLogger.log("Resource deleted from sector.");
};

document.getElementById('logout-btn').addEventListener('click', () => auth.signOut());
