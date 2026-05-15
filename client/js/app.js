const API_URL = 'http://localhost:6000/api';

// State Management
let user = JSON.parse(localStorage.getItem('stakers_user')) || null;
let token = localStorage.getItem('stakers_token') || null;
let betSlip = [];

// DOM Elements
const matchGrid = document.getElementById('matchGrid');
const authBtns = document.getElementById('authBtns');
const userProfile = document.getElementById('userProfile');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const depositModal = document.getElementById('depositModal');
const matchModal = document.getElementById('matchModal');
const betCount = document.getElementById('betCount');
const sidebar = document.getElementById('sidebar');
const betItemsContainer = document.getElementById('betItemsContainer');
const slipTotalOdds = document.getElementById('slipTotalOdds');
const potentialPayout = document.getElementById('potentialPayout');
const stakeInput = document.getElementById('stakeInput');
const mainContent = document.getElementById('mainContent');
const adminLink = document.getElementById('adminLink');

// Initialize
async function init() {
    updateAuthUI();
    fetchMatches();
    setupEventListeners();
    updateSlipUI();
}

// Fetch Matches
async function fetchMatches() {
    if (!matchGrid) return;
    
    if (!user) {
        matchGrid.innerHTML = `
            <div class="glass" style="text-align: center; grid-column: 1 / -1; padding: 60px; border: 2px dashed var(--glass-border);">
                <i class="fas fa-lock fa-3x" style="color: var(--primary); margin-bottom: 20px;"></i>
                <h3 style="margin-bottom: 10px;">LOCKED ARENA</h3>
                <p style="color: var(--text-muted); margin-bottom: 30px;">Only registered legends can view the stakes. Join the hub to see the odds!</p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button class="btn btn-primary" onclick="openLogin()">Enter Hub</button>
                    <button class="btn btn-outline" onclick="openRegister()">Create Identity</button>
                </div>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(`${API_URL}/matches`);
        const matches = await response.json();
        renderMatches(matches);
    } catch (error) {
        console.error('Error fetching matches:', error);
    }
}

// Render Matches
function renderMatches(matches) {
    matchGrid.innerHTML = '';

    if (matches.length === 0) {
        matchGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No active markets at the moment. Check back soon!</p>';
        return;
    }

    matches.forEach(match => {
        const matchDate = new Date(match.date);
        const isLive = match.status === 'live';
        const isFinished = match.status === 'finished';
        
        if (isFinished) return; 

        const card = document.createElement('div');
        card.className = 'match-card glass';
        card.innerHTML = `
            <div class="match-top">
                <div class="match-league">
                    <i class="fas ${match.leagueIcon || 'fa-futbol'}"></i> ${match.league}
                </div>
                <div class="${isLive ? 'status-live' : ''}">
                    ${isLive ? '● LIVE' : matchDate.toLocaleString([], {weekday: 'short', hour: '2-digit', minute:'2-digit'})}
                </div>
            </div>
            <div class="match-teams">
                <div class="team">
                    <div class="team-logo"><i class="fas ${match.team1.icon || 'fa-shield'}"></i></div>
                    <div class="team-name">${match.team1.name}</div>
                </div>
                <div class="vs-badge">VS</div>
                <div class="team">
                    <div class="team-logo"><i class="fas ${match.team2.icon || 'fa-shield'}"></i></div>
                    <div class="team-name">${match.team2.name}</div>
                </div>
            </div>
            <div class="odds-row">
                <div class="odd-btn ${getSelectedClass(match._id, '1')}" onclick="addToBetSlip('${match._id}', '1', ${match.odds.team1}, '${match.team1.name} vs ${match.team2.name}')">
                    <span class="odd-val">${match.odds.team1.toFixed(2)}</span>
                    <span class="odd-label">1</span>
                </div>
                <div class="odd-btn ${getSelectedClass(match._id, 'X')}" onclick="addToBetSlip('${match._id}', 'X', ${match.odds.draw}, '${match.team1.name} vs ${match.team2.name}')">
                    <span class="odd-val">${match.odds.draw.toFixed(2)}</span>
                    <span class="odd-label">X</span>
                </div>
                <div class="odd-btn ${getSelectedClass(match._id, '2')}" onclick="addToBetSlip('${match._id}', '2', ${match.odds.team2}, '${match.team1.name} vs ${match.team2.name}')">
                    <span class="odd-val">${match.odds.team2.toFixed(2)}</span>
                    <span class="odd-label">2</span>
                </div>
            </div>
        `;
        matchGrid.appendChild(card);
    });
}

function getSelectedClass(matchId, selection) {
    const item = betSlip.find(i => i.matchId === matchId);
    return (item && item.selection === selection) ? 'active' : '';
}

// Auth UI
function updateAuthUI() {
    if (user) {
        authBtns.style.display = 'none';
        userProfile.style.display = 'flex';
        userProfile.querySelector('.username').textContent = user.username;
        userProfile.querySelector('.balance').innerHTML = `KES ${user.balance.toFixed(2)} <i class="fas fa-plus-circle"></i>`;
        
        if (user.role === 'admin') {
            adminLink.style.display = 'block';
        }
    } else {
        authBtns.style.display = 'flex';
        userProfile.style.display = 'none';
        adminLink.style.display = 'none';
    }
}

// Event Listeners
function setupEventListeners() {
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        });
    });

    // Forms
    setupForm('loginForm', '/auth/login', 'Welcome back! ⚽');
    setupForm('registerForm', '/auth/register', 'Welcome to the Hub! 🎁');
    setupForm('depositForm', '/wallet/deposit', 'Wallet topped up! 💰', true);
    setupForm('matchForm', '/matches', 'New market launched! 🚀', true);

    if (stakeInput) stakeInput.addEventListener('input', calculatePotentialPayout);
}

function setupForm(formId, endpoint, successMsg, isAuthRequired = false) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const body = {};
        
        // Custom handling for matchForm to nest odds
        if (formId === 'matchForm') {
            body.league = formData.get('league');
            body.date = formData.get('date');
            body.team1 = { name: formData.get('team1') };
            body.team2 = { name: formData.get('team2') };
            body.odds = {
                team1: parseFloat(formData.get('odds1')),
                draw: parseFloat(formData.get('oddsX')),
                team2: parseFloat(formData.get('odds2'))
            };
        } else {
            formData.forEach((value, key) => body[key] = value);
        }
        
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (isAuthRequired && token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });
            
            const data = await res.json();
            if (res.ok) {
                if (formId === 'loginForm' || formId === 'registerForm') {
                    saveAuth(data.user, data.token);
                } else if (formId === 'depositForm') {
                    user.balance = data.newBalance;
                    saveAuth(user, token);
                }
                
                document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
                showNotification(successMsg);
                fetchMatches();
                if (formId === 'matchForm' && document.getElementById('adminGrid')) showAdminDashboard();
            } else {
                alert(data.message || 'Action failed');
            }
        } catch (err) {
            console.error(err);
        }
    });
}

function saveAuth(u, t) {
    user = u;
    token = t;
    localStorage.setItem('stakers_user', JSON.stringify(u));
    localStorage.setItem('stakers_token', t);
    updateAuthUI();
    fetchMatches();
}

function logout() {
    localStorage.removeItem('stakers_user');
    localStorage.removeItem('stakers_token');
    user = null;
    token = null;
    location.reload();
}

// Modals
window.openLogin = () => loginModal.classList.add('active');
window.openRegister = () => registerModal.classList.add('active');
window.openDeposit = () => depositModal.classList.add('active');
window.openCreateMatch = () => matchModal.classList.add('active');

// Bet Slip Logic
window.toggleSidebar = () => sidebar.classList.toggle('active');

window.addToBetSlip = (matchId, selection, odds, teams) => {
    if (!user) return openLogin();
    
    const existingIndex = betSlip.findIndex(b => b.matchId === matchId);
    if (existingIndex > -1) {
        if (betSlip[existingIndex].selection === selection) {
            betSlip.splice(existingIndex, 1);
        } else {
            betSlip[existingIndex].selection = selection;
            betSlip[existingIndex].odds = odds;
        }
    } else {
        betSlip.push({ matchId, selection, odds, teams });
    }
    
    updateSlipUI();
    renderMatches([]); 
    fetchMatches(); 
};

function updateSlipUI() {
    if (!betCount) return;
    betCount.textContent = betSlip.length;
    betItemsContainer.innerHTML = '';

    if (betSlip.length === 0) {
        betItemsContainer.innerHTML = `<div style="text-align: center; padding-top: 50px; color: var(--text-muted);"><i class="fas fa-mouse-pointer fa-2x" style="margin-bottom: 15px;"></i><p>Select odds to build your slip</p></div>`;
        slipTotalOdds.textContent = '1.00';
    } else {
        let totalOdds = 1;
        betSlip.forEach((item, index) => {
            totalOdds *= item.odds;
            const div = document.createElement('div');
            div.className = 'slip-item';
            div.innerHTML = `
                <div class="slip-item-top"><span>Football</span><i class="fas fa-times" onclick="removeFromSlip(${index})" style="cursor: pointer;"></i></div>
                <div class="slip-item-teams">${item.teams}</div>
                <div class="slip-item-selection">Result: ${item.selection} @ ${item.odds.toFixed(2)}</div>
            `;
            betItemsContainer.appendChild(div);
        });
        slipTotalOdds.textContent = totalOdds.toFixed(2);
    }
    calculatePotentialPayout();
}

window.removeFromSlip = (index) => {
    betSlip.splice(index, 1);
    updateSlipUI();
    fetchMatches();
};

function calculatePotentialPayout() {
    if (!slipTotalOdds) return;
    const totalOdds = parseFloat(slipTotalOdds.textContent);
    const stake = parseFloat(stakeInput.value) || 0;
    potentialPayout.textContent = `KES ${(totalOdds * stake).toFixed(2)}`;
}

window.placeBet = async () => {
    if (betSlip.length === 0) return showNotification('Add some matches first!');
    if (!user) return openLogin();
    
    const totalStake = parseFloat(stakeInput.value);
    if (totalStake < 50) return showNotification('Minimum stake is KES 50');
    if (totalStake > user.balance) return showNotification('Insufficient balance! Top up now.');

    try {
        const response = await fetch(`${API_URL}/bets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ items: betSlip.map(i => ({ matchId: i.matchId, selection: i.selection })), totalStake })
        });
        
        const data = await response.json();
        if (response.ok) {
            showNotification('Bet placed! Good luck! 🍀');
            betSlip = [];
            updateSlipUI();
            user.balance = data.newBalance;
            saveAuth(user, token);
            toggleSidebar();
            fetchMatches();
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
    }
};

// Views
window.showMyBets = async () => {
    if (!user) return openLogin();
    
    mainContent.innerHTML = `
        <section class="match-section">
            <div class="section-header"><h2><i class="fas fa-history"></i> My Betting History</h2><button class="btn btn-outline" onclick="location.reload()">Back to Arena</button></div>
            <div id="betsHistory" class="match-grid"><p>Loading your tickets...</p></div>
        </section>
    `;

    try {
        const res = await fetch(`${API_URL}/bets/my-bets`, { headers: { 'Authorization': `Bearer ${token}` } });
        const bets = await res.json();
        const container = document.getElementById('betsHistory');
        container.innerHTML = '';

        if (bets.length === 0) container.innerHTML = '<p>No bets placed yet. Join the arena!</p>';

        bets.forEach(bet => {
            const date = new Date(bet.createdAt).toLocaleDateString();
            const statusClass = bet.status === 'won' ? 'status-live' : (bet.status === 'lost' ? 'text-danger' : '');
            
            const card = document.createElement('div');
            card.className = 'glass';
            card.style.borderLeft = `5px solid ${bet.status === 'won' ? 'var(--primary)' : (bet.status === 'lost' ? 'var(--danger)' : 'var(--text-muted)')}`;
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;"><span style="font-weight: 800;">Slip #${bet._id.toString().slice(-6)}</span><span class="${statusClass}" style="text-transform: uppercase; font-weight: 900;">${bet.status}</span></div>
                <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 10px;">Placed on: ${date}</div>
                <div style="margin-bottom: 15px;">${bet.items.map(item => `<div style="font-size: 0.9rem; margin-bottom: 5px;">${item.match ? item.match.team1.name + ' vs ' + item.match.team2.name : 'Match Removed'} | <b>${item.selection}</b></div>`).join('')}</div>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--glass-border); padding-top: 10px;"><span>Stake: KES ${bet.totalStake}</span><span style="font-weight: 800; color: var(--primary);">Payout: KES ${bet.potentialWin.toFixed(2)}</span></div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error(err);
    }
};

window.showAdminDashboard = async () => {
    if (!user || user.role !== 'admin') return;

    mainContent.innerHTML = `
        <section class="match-section">
            <div class="section-header"><h2><i class="fas fa-user-shield"></i> Admin Dashboard</h2><div style="display: flex; gap: 10px;"><button class="btn btn-outline" onclick="openCreateMatch()">Upload Odds</button><button class="btn btn-primary" onclick="location.reload()">View Arena</button></div></div>
            <div id="adminGrid" class="match-grid"><p>Loading active matches...</p></div>
        </section>
    `;

    try {
        const res = await fetch(`${API_URL}/matches`);
        const matches = await res.json();
        const container = document.getElementById('adminGrid');
        container.innerHTML = '';

        matches.forEach(match => {
            const card = document.createElement('div');
            card.className = 'glass';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;"><span style="font-weight: 700;">${match.league}</span><span style="color: var(--primary); font-weight: 800;">${match.status.toUpperCase()}</span></div>
                <div style="text-align: center; margin-bottom: 20px;">${match.team1.name} vs ${match.team2.name}</div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-outline" style="flex: 1;" onclick="settleMatch('${match._id}', '1')">1</button>
                    <button class="btn btn-outline" style="flex: 1;" onclick="settleMatch('${match._id}', 'X')">X</button>
                    <button class="btn btn-outline" style="flex: 1;" onclick="settleMatch('${match._id}', '2')">2</button>
                </div>
                <p style="text-align: center; font-size: 0.7rem; color: var(--text-muted); margin-top: 10px;">Settle this match</p>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error(err);
    }
};

window.settleMatch = async (id, result) => {
    if (!confirm(`Settle match with result ${result}? Winners will be paid.`)) return;
    try {
        const res = await fetch(`${API_URL}/matches/${id}/settle`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ result })
        });
        if (res.ok) { showNotification('Match settled! 💰'); showAdminDashboard(); }
    } catch (err) { console.error(err); }
};

function showNotification(msg) {
    const toast = document.createElement('div');
    toast.className = 'notification glass';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 3000);
}

document.addEventListener('DOMContentLoaded', init);
