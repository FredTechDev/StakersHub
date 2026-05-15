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
    if (!matchGrid) return;
    matchGrid.innerHTML = '';

    matches.forEach(match => {
        const matchDate = new Date(match.date);
        const isLive = match.status === 'live';
        const isFinished = match.status === 'finished';
        
        if (isFinished) return; // Don't show finished matches in general grid

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
        userProfile.querySelector('.balance').textContent = `KES ${user.balance.toFixed(2)}`;
        
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
            loginModal.classList.remove('active');
            registerModal.classList.remove('active');
        });
    });

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            
            try {
                const res = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (data.token) {
                    saveAuth(data.user, data.token);
                    loginModal.classList.remove('active');
                    showNotification('Welcome back to the pitch! ⚽');
                } else {
                    alert(data.message);
                }
            } catch (err) {
                console.error(err);
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = e.target.username.value;
            const email = e.target.email.value;
            const password = e.target.password.value;
            
            try {
                const res = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                const data = await res.json();
                if (data.token) {
                    saveAuth(data.user, data.token);
                    registerModal.classList.remove('active');
                    showNotification('Welcome to the Hub! Your bonus is ready. 🎁');
                } else {
                    alert(data.message);
                }
            } catch (err) {
                console.error(err);
            }
        });
    }

    if (stakeInput) {
        stakeInput.addEventListener('input', calculatePotentialPayout);
    }
}

function saveAuth(u, t) {
    user = u;
    token = t;
    localStorage.setItem('stakers_user', JSON.stringify(u));
    localStorage.setItem('stakers_token', t);
    updateAuthUI();
}

function logout() {
    localStorage.removeItem('stakers_user');
    localStorage.removeItem('stakers_token');
    user = null;
    token = null;
    location.reload();
}

// Bet Slip Logic
window.toggleSidebar = () => sidebar.classList.toggle('active');

window.addToBetSlip = (matchId, selection, odds, teams) => {
    if (!user) {
        window.openLogin();
        return;
    }
    
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
    renderMatches([]); // Force re-render to update active classes (optimally we'd just fetch/update the grid)
    fetchMatches(); 
};

function updateSlipUI() {
    betCount.textContent = betSlip.length;
    betItemsContainer.innerHTML = '';

    if (betSlip.length === 0) {
        betItemsContainer.innerHTML = `
            <div style="text-align: center; padding-top: 50px; color: var(--text-muted);">
                <i class="fas fa-mouse-pointer fa-2x" style="margin-bottom: 15px;"></i>
                <p>Select odds to build your slip</p>
            </div>
        `;
        slipTotalOdds.textContent = '1.00';
    } else {
        let totalOdds = 1;
        betSlip.forEach((item, index) => {
            totalOdds *= item.odds;
            const div = document.createElement('div');
            div.className = 'slip-item';
            div.innerHTML = `
                <div class="slip-item-top">
                    <span>Football</span>
                    <i class="fas fa-times" onclick="removeFromSlip(${index})" style="cursor: pointer;"></i>
                </div>
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
    const totalOdds = parseFloat(slipTotalOdds.textContent);
    const stake = parseFloat(stakeInput.value) || 0;
    potentialPayout.textContent = `KES ${(totalOdds * stake).toFixed(2)}`;
}

window.placeBet = async () => {
    if (betSlip.length === 0) return showNotification('Add some matches first!');
    if (!user) return openLogin();
    
    const totalStake = parseFloat(stakeInput.value);
    if (totalStake < 50) return showNotification('Minimum stake is KES 50');
    if (totalStake > user.balance) return showNotification('Insufficient balance!');

    try {
        const response = await fetch(`${API_URL}/bets`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                items: betSlip.map(i => ({ matchId: i.matchId, selection: i.selection })),
                totalStake 
            })
        });
        
        const data = await response.json();
        if (response.ok) {
            showNotification('Bet placed! Good luck, Champ! 🍀');
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

// Notification System
function showNotification(msg) {
    const toast = document.createElement('div');
    toast.className = 'notification glass';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Navigation / Views
window.openLogin = () => loginModal.classList.add('active');
window.openRegister = () => registerModal.classList.add('active');

window.showMyBets = async () => {
    if (!user) return openLogin();
    
    mainContent.innerHTML = `
        <section class="match-section">
            <div class="section-header">
                <h2><i class="fas fa-history"></i> My Betting History</h2>
                <button class="btn btn-outline" onclick="location.reload()">Back to Arena</button>
            </div>
            <div id="betsHistory" class="match-grid">
                <p>Loading your winning tickets...</p>
            </div>
        </section>
    `;

    try {
        const res = await fetch(`${API_URL}/bets/my-bets`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const bets = await res.json();
        const container = document.getElementById('betsHistory');
        container.innerHTML = '';

        if (bets.length === 0) container.innerHTML = '<p>No bets placed yet. Start your journey!</p>';

        bets.forEach(bet => {
            const date = new Date(bet.createdAt).toLocaleDateString();
            const statusClass = bet.status === 'won' ? 'status-live' : (bet.status === 'lost' ? 'text-danger' : '');
            
            const card = document.createElement('div');
            card.className = 'glass';
            card.style.borderLeft = `5px solid ${bet.status === 'won' ? 'var(--primary)' : (bet.status === 'lost' ? 'var(--danger)' : 'var(--text-muted)')}`;
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <span style="font-weight: 800;">Slip #${bet._id.toString().slice(-6)}</span>
                    <span class="${statusClass}" style="text-transform: uppercase; font-weight: 900;">${bet.status}</span>
                </div>
                <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 10px;">Placed on: ${date}</div>
                <div style="margin-bottom: 15px;">
                    ${bet.items.map(item => `
                        <div style="font-size: 0.9rem; margin-bottom: 5px;">
                            ${item.match.team1.name} vs ${item.match.team2.name} | <b>${item.selection}</b>
                        </div>
                    `).join('')}
                </div>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--glass-border); padding-top: 10px;">
                    <span>Stake: KES ${bet.totalStake}</span>
                    <span style="font-weight: 800; color: var(--primary);">Payout: KES ${bet.potentialWin.toFixed(2)}</span>
                </div>
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
            <div class="section-header">
                <h2><i class="fas fa-user-shield"></i> Admin Command Center</h2>
                <button class="btn btn-primary" onclick="openCreateMatch()">New Match</button>
            </div>
            <div id="adminGrid" class="match-grid">
                <p>Loading active matches...</p>
            </div>
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
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <span style="font-weight: 700;">${match.league}</span>
                    <span style="color: var(--primary); font-weight: 800;">${match.status.toUpperCase()}</span>
                </div>
                <div style="text-align: center; margin-bottom: 20px;">
                    ${match.team1.name} vs ${match.team2.name}
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-outline" style="flex: 1;" onclick="settleMatch('${match._id}', '1')">1</button>
                    <button class="btn btn-outline" style="flex: 1;" onclick="settleMatch('${match._id}', 'X')">X</button>
                    <button class="btn btn-outline" style="flex: 1;" onclick="settleMatch('${match._id}', '2')">2</button>
                </div>
                <p style="text-align: center; font-size: 0.7rem; color: var(--text-muted); margin-top: 10px;">Click result to settle match</p>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error(err);
    }
};

window.settleMatch = async (id, result) => {
    if (!confirm(`Settle match with result ${result}? This will payout all winners.`)) return;

    try {
        const res = await fetch(`${API_URL}/matches/${id}/settle`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ result })
        });
        
        if (res.ok) {
            showNotification('Match settled and winners paid! 💰');
            showAdminDashboard();
        } else {
            const data = await res.json();
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
    }
};

document.addEventListener('DOMContentLoaded', init);
