// State
const currentUserApp = checkAuth(); // Rename to avoid conflict if declared elsewhere, though let/const are block scoped
const collectionKey = currentUserApp ? `labubu_collection_${currentUserApp.username}` : 'myLabubuCollection';

let state = {
    view: 'browse', // 'browse' or 'collection'
    myCollection: JSON.parse(localStorage.getItem(collectionKey)) || []
};

// DOM Elements
const appContent = document.getElementById('app-content');
const navBrowse = document.getElementById('nav-browse');
const navCollection = document.getElementById('nav-collection');
const mobileNavBrowse = document.getElementById('mobile-nav-browse');
const mobileNavCollection = document.getElementById('mobile-nav-collection');

// Navigation Logic
function navigateTo(view) {
    state.view = view;
    render();
    updateActiveNav();
}

function updateActiveNav() {
    const activeClass = 'text-indigo-600 dark:text-indigo-400';
    const inactiveClass = 'text-slate-600 dark:text-slate-400';
    const mobileActiveClass = 'text-indigo-600 dark:text-indigo-400';
    const mobileInactiveClass = 'text-slate-600 dark:text-slate-400';

    if (state.view === 'browse') {
        navBrowse.className = `px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeClass}`;
        navCollection.className = `px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${inactiveClass}`;

        mobileNavBrowse.className = `flex flex-col items-center ${mobileActiveClass}`;
        mobileNavCollection.className = `flex flex-col items-center hover:text-indigo-600 dark:hover:text-indigo-400 ${mobileInactiveClass}`;
    } else {
        navCollection.className = `px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeClass}`;
        navBrowse.className = `px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${inactiveClass}`;

        mobileNavCollection.className = `flex flex-col items-center ${mobileActiveClass}`;
        mobileNavBrowse.className = `flex flex-col items-center hover:text-indigo-600 dark:hover:text-indigo-400 ${mobileInactiveClass}`;
    }
}

// Collection Logic
function toggleCollection(id) {
    const index = state.myCollection.indexOf(id);
    if (index === -1) {
        state.myCollection.push(id);
    } else {
        state.myCollection.splice(index, 1);
    }
    localStorage.setItem(collectionKey, JSON.stringify(state.myCollection));
    render();
}

function isInCollection(id) {
    return state.myCollection.includes(id);
}

// Rendering
function renderCard(item, isCollectionMode = false) {
    const inCollection = isInCollection(item.id);
    
    // If we are in collection mode and the item is not in collection, don't render (unless we want to show what's missing, but prompt says "what the user has")
    if (isCollectionMode && !inCollection) return '';

    const btnClass = inCollection 
        ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40" 
        : "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600";
    
    const btnText = inCollection ? "Remove" : "Add to Collection";

    // Placeholder image logic for demo
    const bgColor = item.rarity === 'Secret' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-slate-100 dark:bg-slate-700/50';
    const rarityBadge = item.rarity === 'Secret' 
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200' 
        : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';

    return `
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full group">
            <div class="h-48 ${bgColor} flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                <span class="text-5xl transform group-hover:scale-110 transition-transform duration-300">🧸</span>
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <div class="flex justify-between items-start gap-2 mb-3">
                    <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white leading-tight" title="${item.name}">${item.name}</h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">${item.series}</p>
                    </div>
                    <span class="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${rarityBadge}">
                        ${item.rarity}
                    </span>
                </div>
                <div class="mt-auto pt-4">
                    <button onclick="toggleCollection(${item.id})" class="w-full flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-lg ${btnClass} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800">
                        ${btnText}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderBrowse() {
    const grid = labubuData.map(item => renderCard(item)).join('');
    return `
        <div class="mb-8">
            <h2 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">All Labubus</h2>
            <p class="text-slate-600 dark:text-slate-400 mt-2">Browse and add to your collection</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            ${grid}
        </div>
    `;
}

function renderCollection() {
    const collectionItems = labubuData.filter(item => isInCollection(item.id));
    
    if (collectionItems.length === 0) {
        return `
            <div class="text-center py-24">
                <div class="text-7xl mb-6 opacity-50">😢</div>
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Labubus yet</h2>
                <p class="text-slate-600 dark:text-slate-400 mb-8">Go to the browse section to add some!</p>
                <button onclick="navigateTo('browse')" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors">
                    Start Collecting
                </button>
            </div>
        `;
    }

    const grid = collectionItems.map(item => renderCard(item, true)).join('');
    
    return `
        <div class="mb-8 flex justify-between items-center">
            <div>
                <h2 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">My Collection</h2>
                <p class="text-slate-600 dark:text-slate-400 mt-2">${collectionItems.length} items collected</p>
            </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            ${grid}
        </div>
    `;
}

function render() {
    if (state.view === 'browse') {
        appContent.innerHTML = renderBrowse();
    } else {
        appContent.innerHTML = renderCollection();
    }
}

// Event Listeners
navBrowse.addEventListener('click', () => navigateTo('browse'));
navCollection.addEventListener('click', () => navigateTo('collection'));
mobileNavBrowse.addEventListener('click', () => navigateTo('browse'));
mobileNavCollection.addEventListener('click', () => navigateTo('collection'));

// Initial Render
render();
updateActiveNav();
