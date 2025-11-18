// State
const currentUserApp = checkAuth(); // Rename to avoid conflict if declared elsewhere, though let/const are block scoped
const collectionKey = currentUserApp ? `labubu_collection_${currentUserApp.username}` : 'myLabubuCollection';
const wishlistKey = currentUserApp ? `labubu_wishlist_${currentUserApp.username}` : 'myLabubuWishlist';

let state = {
    view: 'browse', // 'browse', 'collection', 'wishlist'
    myCollection: JSON.parse(localStorage.getItem(collectionKey)) || [],
    myWishlist: JSON.parse(localStorage.getItem(wishlistKey)) || [],
    searchQuery: '',
    filterSeries: 'all'
};

// DOM Elements
const appContent = document.getElementById('app-content');
const navBrowse = document.getElementById('nav-browse');
const navCollection = document.getElementById('nav-collection');
const navWishlist = document.getElementById('nav-wishlist');
const mobileNavBrowse = document.getElementById('mobile-nav-browse');
const mobileNavCollection = document.getElementById('mobile-nav-collection');
const mobileNavWishlist = document.getElementById('mobile-nav-wishlist');

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

    // Reset all
    [navBrowse, navCollection, navWishlist].forEach(el => {
        if(el) el.className = `px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${inactiveClass}`;
    });
    [mobileNavBrowse, mobileNavCollection, mobileNavWishlist].forEach(el => {
        if(el) el.className = `flex flex-col items-center hover:text-indigo-600 dark:hover:text-indigo-400 ${mobileInactiveClass}`;
    });

    // Set active
    if (state.view === 'browse') {
        navBrowse.className = `px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeClass}`;
        mobileNavBrowse.className = `flex flex-col items-center ${mobileActiveClass}`;
    } else if (state.view === 'collection') {
        navCollection.className = `px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeClass}`;
        mobileNavCollection.className = `flex flex-col items-center ${mobileActiveClass}`;
    } else if (state.view === 'wishlist') {
        navWishlist.className = `px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeClass}`;
        mobileNavWishlist.className = `flex flex-col items-center ${mobileActiveClass}`;
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

// Wishlist Logic
function toggleWishlist(id) {
    const index = state.myWishlist.indexOf(id);
    if (index === -1) {
        state.myWishlist.push(id);
    } else {
        state.myWishlist.splice(index, 1);
    }
    localStorage.setItem(wishlistKey, JSON.stringify(state.myWishlist));
    render();
}

function isInWishlist(id) {
    return state.myWishlist.includes(id);
}

// Search & Filter Logic
function handleSearch(e) {
    state.searchQuery = e.target.value.toLowerCase();
    render();
    // Restore focus to input
    const input = document.getElementById('search-input');
    if(input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    }
}

function handleFilter(e) {
    state.filterSeries = e.target.value;
    render();
}

// Rendering
function renderCard(item, viewMode = 'browse') {
    const inCollection = isInCollection(item.id);
    const inWishlist = isInWishlist(item.id);
    
    // Filter logic for collection/wishlist views
    if (viewMode === 'collection' && !inCollection) return '';
    if (viewMode === 'wishlist' && !inWishlist) return '';

    const btnClass = inCollection 
        ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40" 
        : "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600";
    
    const btnText = inCollection ? "Remove" : "Add to Collection";

    // Placeholder image logic for demo
    const bgColor = item.rarity === 'Secret' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-slate-100 dark:bg-slate-700/50';
    const rarityBadge = item.rarity === 'Secret' 
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200' 
        : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';

    const heartClass = inWishlist ? "text-red-500 fill-current" : "text-slate-400 hover:text-red-500";

    return `
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full group relative">
            <button onclick="toggleWishlist(${item.id})" class="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm transition-colors ${heartClass}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
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
    // Get unique series for filter
    const seriesList = [...new Set(labubuData.map(item => item.series))];
    
    // Filter data
    const filteredData = labubuData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(state.searchQuery) || 
                              item.series.toLowerCase().includes(state.searchQuery);
        const matchesFilter = state.filterSeries === 'all' || item.series === state.filterSeries;
        return matchesSearch && matchesFilter;
    });

    const grid = filteredData.map(item => renderCard(item, 'browse')).join('');
    
    return `
        <div class="mb-8">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">All Labubus</h2>
                    <p class="text-slate-600 dark:text-slate-400 mt-2">Browse and add to your collection</p>
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative">
                        <input type="text" id="search-input" placeholder="Search..." value="${state.searchQuery}" oninput="handleSearch(event)"
                            class="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors">
                        <svg class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <select onchange="handleFilter(event)" class="w-full sm:w-48 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors">
                        <option value="all" ${state.filterSeries === 'all' ? 'selected' : ''}>All Series</option>
                        ${seriesList.map(series => `<option value="${series}" ${state.filterSeries === series ? 'selected' : ''}>${series}</option>`).join('')}
                    </select>
                </div>
            </div>
        </div>
        ${filteredData.length > 0 
            ? `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">${grid}</div>`
            : `<div class="text-center py-20 text-slate-500 dark:text-slate-400">No Labubus found matching your criteria.</div>`
        }
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

    // Stats
    const totalItems = labubuData.length;
    const collectedCount = collectionItems.length;
    const percentage = Math.round((collectedCount / totalItems) * 100);
    const uniqueSeries = [...new Set(collectionItems.map(i => i.series))].length;

    const grid = collectionItems.map(item => renderCard(item, 'collection')).join('');
    
    return `
        <div class="mb-8">
            <h2 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">My Collection</h2>
            
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Collected</div>
                    <div class="mt-2 flex items-baseline">
                        <span class="text-3xl font-bold text-slate-900 dark:text-white">${collectedCount}</span>
                        <span class="ml-2 text-sm font-medium text-slate-500 dark:text-slate-400">/ ${totalItems}</span>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div class="text-sm font-medium text-slate-500 dark:text-slate-400">Completion</div>
                    <div class="mt-2 flex items-baseline">
                        <span class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">${percentage}%</span>
                    </div>
                    <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-3">
                        <div class="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div class="text-sm font-medium text-slate-500 dark:text-slate-400">Series Active</div>
                    <div class="mt-2 flex items-baseline">
                        <span class="text-3xl font-bold text-slate-900 dark:text-white">${uniqueSeries}</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                ${grid}
            </div>
        </div>
    `;
}

function renderWishlist() {
    const wishlistItems = labubuData.filter(item => isInWishlist(item.id));
    
    if (wishlistItems.length === 0) {
        return `
            <div class="text-center py-24">
                <div class="text-7xl mb-6 opacity-50">✨</div>
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your Wishlist is empty</h2>
                <p class="text-slate-600 dark:text-slate-400 mb-8">Find items you love and tap the heart icon!</p>
                <button onclick="navigateTo('browse')" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors">
                    Browse Items
                </button>
            </div>
        `;
    }

    const grid = wishlistItems.map(item => renderCard(item, 'wishlist')).join('');
    
    return `
        <div class="mb-8">
            <h2 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">My Wishlist</h2>
            <p class="text-slate-600 dark:text-slate-400 mt-2">${wishlistItems.length} items you're hunting for</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            ${grid}
        </div>
    `;
}

function render() {
    if (state.view === 'browse') {
        appContent.innerHTML = renderBrowse();
    } else if (state.view === 'collection') {
        appContent.innerHTML = renderCollection();
    } else if (state.view === 'wishlist') {
        appContent.innerHTML = renderWishlist();
    }
}

// Event Listeners
navBrowse.addEventListener('click', () => navigateTo('browse'));
navCollection.addEventListener('click', () => navigateTo('collection'));
navWishlist.addEventListener('click', () => navigateTo('wishlist'));
mobileNavBrowse.addEventListener('click', () => navigateTo('browse'));
mobileNavCollection.addEventListener('click', () => navigateTo('collection'));
mobileNavWishlist.addEventListener('click', () => navigateTo('wishlist'));

// Initial Render
render();
updateActiveNav();
