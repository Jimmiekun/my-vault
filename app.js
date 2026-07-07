// 1. Enterprise Firebase Configurations Platform
const firebaseConfig = {
  apiKey: "AIzaSyAdsYVHxvlBwgv5RaJKVAKIZy0qHmHaMpA",
  authDomain: "for-portfolio-630cf.firebaseapp.com",
  projectId: "for-portfolio-630cf",
  storageBucket: "for-portfolio-630cf.firebasestorage.app",
  messagingSenderId: "68085148173",
  appId: "1:68085148173:web:825e9456cec1a2c8268344", // Fixed: Matches your live console App ID exactly
  measurementId: "G-LV1GCM1PR9"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 2. Enterprise Real-time Event Logger 
const EventLogger = {
  log: (msg) => {
    const feed = document.getElementById('log-feed');
    if (!feed) return; // Guard clause against missing DOM nodes
    const entry = document.createElement('div');
    entry.textContent = `> ${new Date().toLocaleTimeString()}: ${msg}`;
    feed.prepend(entry);
  }
};

// 3. Dynamic Repository Extension Categorization Engine
function getFileMeta(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  const fileTypes = {
    js:   { tag: 'JS FILE',    color: 'text-yellow-400' },
    ts:   { tag: 'TS CODE',    color: 'text-blue-400' },
    py:   { tag: 'PYTHON',     color: 'text-teal-400' },
    json: { tag: 'METADATA',   color: 'text-emerald-400' },
    md:   { tag: 'MARKDOWN',   color: 'text-purple-400' },
    yaml: { tag: 'CONFIG',     color: 'text-orange-400' },
    html: { tag: 'HTML NODE',  color: 'text-red-400' },
    css:  { tag: 'STYLES',     color: 'text-pink-400' }
  };
  return fileTypes[extension] || { tag: 'RESOURCE', color: 'text-gray-400' };
}

// 4. Interactive Interface Component Events
document.getElementById('toggle-pass')?.addEventListener('click', function() {
  const p = document.getElementById('pass');
  if (!p) return;
  p.type = p.type === 'password' ? 'text' : 'password';
  this.textContent = p.type === 'password' ? 'Show' : 'Hide';
});

// 5. Reactive Authentication Orchestrator
auth.onAuthStateChanged(user => {
  const login = document.getElementById('login-screen');
  const app = document.getElementById('app-screen');
  
  if (user) {
    if (login) login.classList.add('hidden');
    if (app) app.classList.remove('hidden');
    EventLogger.log("Auth success: User Session Initialized");
    loadItems();
  } else {
    if (login) login.classList.remove('hidden');
    if (app) app.classList.add('hidden');
    
    // Clear display blocks upon explicit security exit
    const grid = document.getElementById('grid');
    const fileTree = document.getElementById('file-tree');
    if (grid) grid.innerHTML = '';
    if (fileTree) fileTree.innerHTML = '';
    
    EventLogger.log("System locked. Waiting for identity tokens.");
  }
});

document.getElementById('login-btn')?.addEventListener('click', async () => {
  const e = document.getElementById('email')?.value.trim();
  const p = document.getElementById('pass')?.value.trim();
  if (!e || !p) return;

  try {
    await auth.signInWithEmailAndPassword(e, p);
  } catch (error) {
    EventLogger.log(`Sign-in fallback routing deployed: ${error.code}`);
    try {
      await auth.createUserWithEmailAndPassword(e, p);
    } catch (createError) {
      EventLogger.log(`Instantiation execution failed: ${createError.message}`);
    }
  }
});

// 6. Secure Database Writing Link (Save to Cloud)
document.getElementById('add-btn')?.addEventListener('click', async () => {
  const nameInput = document.getElementById('itemName');
  const urlInput = document.getElementById('itemUrl');
  if (!nameInput || !urlInput) return;

  const name = nameInput.value.trim();
  let url = urlInput.value.trim();
  if (!name || !url) return;

  // Auto-appends standard transport schemas securely
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  try {
    await db.collection('vaults').doc(auth.currentUser.uid).collection('items').add({
      name, url, timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    EventLogger.log(`Resource completely linked to backend storage: ${name}`);
    nameInput.value = '';
    urlInput.value = '';
  } catch (error) {
    EventLogger.log(`Ingestion failure to sector mapping: ${error.message}`);
  }
});

// 7. Interactive Cloud Streams Ingestion (Load & Render)
function loadItems() {
  if (!auth.currentUser) return;

  db.collection('vaults').doc(auth.currentUser.uid).collection('items')
    .orderBy('timestamp', 'desc')
    .onSnapshot(snap => {
      const grid = document.getElementById('grid');
      const fileTree = document.getElementById('file-tree');
      
      if (grid) grid.innerHTML = '';
      if (fileTree) fileTree.innerHTML = '';

      if (snap.empty) {
        if (grid) grid.innerHTML = `<div class="col-span-full border border-dashed border-gray-800 p-8 rounded-xl text-center text-gray-500 font-mono text-xs">No active nodes stored.</div>`;
        if (fileTree) fileTree.innerHTML = `<div class="text-gray-600 italic py-2 text-center text-xs">Directory empty</div>`;
        return;
      }

      snap.forEach(doc => {
        const d = doc.data();
        const meta = getFileMeta(d.name);
        
        // Render Active Dashboard Nodes matching your premium layout
        if (grid) {
          grid.innerHTML += `
            <div class="item-card p-6 rounded-xl flex flex-col justify-between h-44 transition">
              <div>
                <div class="mb-2">
                  <span class="text-[9px] font-mono tracking-widest px-2 py-0.5 rounded bg-black/60 font-bold ${meta.color}">${meta.tag}</span>
                </div>
                <h3 class="font-mono font-bold text-base text-gray-100 line-clamp-2 leading-snug">${d.name}</h3>
              </div>
              <div class="flex items-center justify-between pt-4 border-t border-gray-800/40">
                <a href="${d.url}" target="_blank" class="text-pink-500 hover:text-pink-400 font-bold font-mono text-xs tracking-wider transition">LAUNCH &rarr;</a>
                <button onclick="deleteItem('${doc.id}')" class="text-xs font-mono text-gray-500 hover:text-red-400 transition">REMOVE</button>
              </div>
            </div>
          `;
        }

        // Render Left-Sidebar Dynamic Directory Listing
        if (fileTree) {
          fileTree.innerHTML += `
            <div class="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-800/30 text-gray-400 cursor-pointer transition truncate">
              <span class="${meta.color} font-bold select-none">&bull;</span>
              <span class="truncate hover:text-white" title="${d.name}">${d.name}</span>
            </div>
          `;
        }
      });
    }, error => {
      EventLogger.log(`Real-time thread interrupted: ${error.message}`);
    });
}

// 8. Secure Asset Purging Actions
window.deleteItem = async (id) => {
  if (!auth.currentUser) return;
  try {
    await db.collection('vaults').doc(auth.currentUser.uid).collection('items').doc(id).delete();
    EventLogger.log("Sector storage payload dropped successfully.");
  } catch (error) {
    EventLogger.log(`Eviction execution pipeline failure: ${error.message}`);
  }
};

document.getElementById('logout-btn')?.addEventListener('click', () => auth.signOut());
