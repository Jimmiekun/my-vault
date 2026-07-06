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

document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  document.getElementById('p-layer1').style.transform = `translate(${x * 30}px, ${y * 30}px)`;
  document.getElementById('p-layer2').style.transform = `translate(${x * -40}px, ${y * -40}px)`;
});

const loginScreen = document.getElementById('login-screen');
const appScreen = document.getElementById('app-screen');
const emailInput = document.getElementById('email');
const passInput = document.getElementById('pass');
let currentUser = null;

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    loginScreen.classList.add('hidden');
    appScreen.classList.remove('hidden');
    loadItems();
  } else {
    currentUser = null;
    loginScreen.classList.remove('hidden');
    appScreen.classList.add('hidden');
  }
});

function triggerShake(element) {
  element.classList.add('error-shake');
  setTimeout(() => element.classList.remove('error-shake'), 400);
}

document.getElementById('toggle-pass').addEventListener('click', function() {
  if (passInput.type === 'password') {
    passInput.type = 'text';
    this.textContent = 'Hide';
  } else {
    passInput.type = 'password';
    this.textContent = 'Show';
  }
});

document.getElementById('login-btn').addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();
  
  if (!email) triggerShake(emailInput);
  if (!pass) triggerShake(passInput);
  if (!email || !pass) return;
  
  try {
    await auth.signInWithEmailAndPassword(email, pass);
  } catch (error) {
    try {
      await auth.createUserWithEmailAndPassword(email, pass);
    } catch (regError) {
      triggerShake(emailInput);
      triggerShake(passInput);
      console.error("Vault Access Error:", regError.message);
    }
  }
});

document.getElementById('logout-btn').addEventListener('click', () => auth.signOut());

document.getElementById('add-btn').addEventListener('click', async () => {
  const name = document.getElementById('itemName').value.trim();
  let url = document.getElementById('itemUrl').value.trim();
  if (!name || !url) return;
  
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  await db.collection('vaults').doc(currentUser.uid).collection('items').add({
    name, url, timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  
  document.getElementById('itemName').value = '';
  document.getElementById('itemUrl').value = '';
});

function loadItems() {
  db.collection('vaults').doc(currentUser.uid).collection('items')
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      const grid = document.getElementById('grid');
      grid.innerHTML = '';
      
      snapshot.forEach(doc => {
        const data = doc.data();
        grid.innerHTML += `
          <div class="item-card bg-gray-800 bg-opacity-70 p-6 rounded-xl border border-gray-700 flex flex-col h-full">
            <h3 class="font-bold text-lg mb-3 text-gray-100 line-clamp-2 leading-tight">${data.name}</h3>
            <div class="mt-auto flex items-center justify-between pt-4 border-t border-gray-700">
              <a href="${data.url}" target="_blank" class="text-pink-500 hover:text-pink-400 font-semibold text-sm transition">Launch →</a>
              <button onclick="deleteItem('${doc.id}')" class="text-xs font-medium text-gray-500 hover:text-red-400 transition">Remove</button>
            </div>
          </div>
        `;
      });
    });
}

window.deleteItem = async (id) => {
  await db.collection('vaults').doc(currentUser.uid).collection('items').doc(id).delete();
};
