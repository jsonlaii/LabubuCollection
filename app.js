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
    const activeClass = 'text-indigo-600';
    const inactiveClass = 'text-gray-700';
    const mobileActiveClass = 'text-indigo-600';
    const mobileInactiveClass = 'text-gray-600';

    if (state.view === 'browse') {
        navBrowse.classList.add('text-indigo-600');
        navBrowse.classList.remove('text-gray-700');
        navCollection.classList.remove('text-indigo-600');
        navCollection.classList.add('text-gray-700');

        mobileNavBrowse.classList.add('text-indigo-600');
        mobileNavBrowse.classList.remove('text-gray-600');
        mobileNavCollection.classList.remove('text-indigo-600');
        mobileNavCollection.classList.add('text-gray-600');
    } else {
        navCollection.classList.add('text-indigo-600');
        navCollection.classList.remove('text-gray-700');
        navBrowse.classList.remove('text-indigo-600');
        navBrowse.classList.add('text-gray-700');

        mobileNavCollection.classList.add('text-indigo-600');
        mobileNavCollection.classList.remove('text-gray-600');
        mobileNavBrowse.classList.remove('text-indigo-600');
        mobileNavBrowse.classList.add('text-gray-600');
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
        ? "bg-red-100 text-red-600 hover:bg-red-200" 
        : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200";
    
    const btnText = inCollection ? "Remove" : "Add to Collection";

    // Placeholder image logic for demo
    const bgColor = item.rarity === 'Secret' ? 'bg-yellow-100' : 'bg-gray-200';

    return `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            <div class="h-48 ${bgColor} flex items-center justify-center flex-shrink-0">
                <span class="text-4xl">🧸</span>
            </div>
            <div class="p-4 flex flex-col flex-grow">
                <div class="flex justify-between items-start gap-2 mb-2">
                    <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-semibold text-gray-900 leading-tight" title="${item.name}">${item.name}</h3>
                        <p class="text-sm text-gray-500 mt-1">${item.series}</p>
                    </div>
                    <span class="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.rarity === 'Secret' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}">
                        ${item.rarity}
                    </span>
                </div>
                <div class="mt-auto pt-4">
                    <button onclick="toggleCollection(${item.id})" class="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${btnClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900">All Labubus</h2>
            <p class="text-gray-600">Browse and add to your collection</p>
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
            <div class="text-center py-20">
                <div class="text-6xl mb-4">😢</div>
                <h2 class="text-2xl font-bold text-gray-900">No Labubus yet</h2>
                <p class="text-gray-600 mb-8">Go to the browse section to add some!</p>
                <button onclick="navigateTo('browse')" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    Start Collecting
                </button>
            </div>
        `;
    }

    const grid = collectionItems.map(item => renderCard(item, true)).join('');
    
    return `
        <div class="mb-6 flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">My Collection</h2>
                <p class="text-gray-600">${collectionItems.length} items collected</p>
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
