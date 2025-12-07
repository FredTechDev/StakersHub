        // Match Data
        const matches = [
            {
                id: 1,
                league: "Premier League",
                leagueIcon: "fa-futbol",
                date: "Today, 19:30 EAT",
                team1: "Manchester City",
                team2: "Arsenal",
                team1Icon: "fa-shield",
                team2Icon: "fa-gun",
                stakes: [
                    { type: "1", odds: 1.85 },
                    { type: "X", odds: 3.60 },
                    { type: "2", odds: 4.20 }
                ]
            },
            {
                id: 2,
                league: "UEFA Champions League",
                leagueIcon: "fa-trophy",
                date: "Today, 22:00 EAT",
                team1: "Real Madrid",
                team2: "Bayern Munich",
                team1Icon: "fa-crown",
                team2Icon: "fa-beer",
                stakes: [
                    { type: "1", odds: 2.10 },
                    { type: "X", odds: 3.40 },
                    { type: "2", odds: 3.30 }
                ]
            },
            {
                id: 3,
                league: "Kenyan Premier League",
                leagueIcon: "fa-flag",
                date: "Today, 16:00 EAT",
                team1: "Gor Mahia",
                team2: "AFC Leopards",
                team1Icon: "fa-lion",
                team2Icon: "fa-paw",
                stakes: [
                    { type: "1", odds: 1.90 },
                    { type: "X", odds: 2.80 },
                    { type: "2", odds: 4.10 }
                ]
            },
            {
                id: 4,
                league: "La Liga",
                leagueIcon: "fa-futbol",
                date: "Today, 21:00 EAT",
                team1: "Barcelona",
                team2: "Atletico Madrid",
                team1Icon: "fa-b",
                team2Icon: "fa-at",
                stakes: [
                    { type: "1", odds: 2.05 },
                    { type: "X", odds: 3.30 },
                    { type: "2", odds: 3.70 }
                ]
            }
        ];

        const kenyanMatches = {
            fpl: [
                {
                    id: 5,
                    league: "Kenyan FPL",
                    leagueIcon: "fa-flag",
                    date: "Today, 15:00 EAT",
                    team1: "Tusker FC",
                    team2: "KCB FC",
                    team1Icon: "fa-beer",
                    team2Icon: "fa-bank",
                    stakes: [
                        { type: "1", odds: 2.30 },
                        { type: "X", odds: 2.90 },
                        { type: "2", odds: 3.10 }
                    ]
                },
                {
                    id: 6,
                    league: "Kenyan FPL",
                    leagueIcon: "fa-flag",
                    date: "Today, 15:00 EAT",
                    team1: "Ulinzi Stars",
                    team2: "Bandari FC",
                    team1Icon: "fa-star",
                    team2Icon: "fa-ship",
                    stakes: [
                        { type: "1", odds: 2.40 },
                        { type: "X", odds: 2.80 },
                        { type: "2", odds: 2.90 }
                    ]
                }
            ],
            nsl: [
                {
                    id: 7,
                    league: "NSL",
                    leagueIcon: "fa-futbol",
                    date: "Today, 14:00 EAT",
                    team1: "MCF",
                    team2: "Fortune Sacco",
                    team1Icon: "fa-f",
                    team2Icon: "fa-s",
                    stakes: [
                        { type: "1", odds: 2.60 },
                        { type: "X", odds: 2.70 },
                        { type: "2", odds: 2.80 }
                    ]
                }
            ],
            division1: [
                {
                    id: 8,
                    league: "Division One",
                    leagueIcon: "fa-futbol",
                    date: "Today, 13:00 EAT",
                    team1: "Kisumu All Stars",
                    team2: "Mombasa Elite",
                    team1Icon: "fa-star",
                    team2Icon: "fa-anchor",
                    stakes: [
                        { type: "1", odds: 2.20 },
                        { type: "X", odds: 2.90 },
                        { type: "2", odds: 3.30 }
                    ]
                }
            ]
        };

        // Bet Slip Data
        let betSlip = [];
        let totalOdds = 1.00;

        // DOM Elements
        const matchesContainer = document.getElementById('matchesContainer');
        const betSlipElement = document.getElementById('betSlip');
        const betSlipHeader = document.getElementById('betSlipHeader');
        const betSlipContent = document.getElementById('betSlipContent');
        const betCountElement = document.getElementById('betCount');
        const totalOddsElement = document.getElementById('totalOdds');
        const placeBetBtn = document.getElementById('placeBetBtn');
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mainNav = document.getElementById('mainNav');
        const leagueTabs = document.querySelectorAll('.league-tab');
        const leagueContents = document.querySelectorAll('.league-content');

        // Initialize the page
        function init() {
            renderMatches();
            setupEventListeners();
            setupLeagueTabs();
        }

        // Render matches to the page
        function renderMatches() {
            matchesContainer.innerHTML = '';
            
            matches.forEach(match => {
                const matchCard = createMatchCard(match);
                matchesContainer.appendChild(matchCard);
            });
            
            // Render Kenyan FPL matches by default
            renderKenyanMatches('fpl');
        }

        // Render Kenyan matches based on selected league
        function renderKenyanMatches(league) {
            const container = document.getElementById(league).querySelector('.matches-container');
            container.innerHTML = '';
            
            kenyanMatches[league].forEach(match => {
                const matchCard = createMatchCard(match);
                container.appendChild(matchCard);
            });
        }

        // Create a match card element
        function createMatchCard(match) {
            const matchCard = document.createElement('div');
            matchCard.className = 'match-card';
            matchCard.dataset.id = match.id;
            
            matchCard.innerHTML = `
                <div class="match-header">
                    <div class="match-league">
                        <i class="fas ${match.leagueIcon}"></i>
                        <span>${match.league}</span>
                    </div>
                    <div class="match-date">${match.date}</div>
                </div>
                
                <div class="match-teams">
                    <div class="team">
                        <div class="team-logo">
                            <i class="fas ${match.team1Icon}"></i>
                        </div>
                        <div class="team-name">${match.team1}</div>
                    </div>
                    
                    <div class="vs">VS</div>
                    
                    <div class="team">
                        <div class="team-logo">
                            <i class="fas ${match.team2Icon}"></i>
                        </div>
                        <div class="team-name">${match.team2}</div>
                    </div>
                </div>
                
                <div class="match-stakes">
                    ${match.stakes.map(stake => `
                        <div class="stake-option" data-match-id="${match.id}" data-type="${stake.type}" data-odds="${stake.odds}">
                            <div class="stake-odds">${stake.odds.toFixed(2)}</div>
                            <div class="stake-type">${stake.type === '1' ? match.team1 : stake.type === '2' ? match.team2 : 'Draw'}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            return matchCard;
        }

        // Set up event listeners
        function setupEventListeners() {
            // Mobile menu toggle
            mobileMenuBtn.addEventListener('click', () => {
                mainNav.classList.toggle('active');
                mobileMenuBtn.innerHTML = mainNav.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });

            // Bet slip toggle
            betSlipHeader.addEventListener('click', () => {
                betSlipElement.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            document.querySelectorAll('#mainNav a').forEach(link => {
                link.addEventListener('click', () => {
                    mainNav.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                });
            });

            // Place bet button
            placeBetBtn.addEventListener('click', placeBet);

            // Add stake to bet slip when clicking on a stake option
            document.addEventListener('click', (e) => {
                if (e.target.closest('.stake-option')) {
                    const stakeOption = e.target.closest('.stake-option');
                    const matchId = parseInt(stakeOption.dataset.matchId);
                    const stakeType = stakeOption.dataset.type;
                    const odds = parseFloat(stakeOption.dataset.odds);
                    
                    addToBetSlip(matchId, stakeType, odds, stakeOption);
                }
            });
        }

        // Set up league tabs
        function setupLeagueTabs() {
            leagueTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs and contents
                    leagueTabs.forEach(t => t.classList.remove('active'));
                    leagueContents.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked tab and corresponding content
                    tab.classList.add('active');
                    const league = tab.dataset.league;
                    document.getElementById(league).classList.add('active');
                    
                    // Render matches for the selected league
                    renderKenyanMatches(league);
                });
            });
        }

        // Add stake to bet slip
        function addToBetSlip(matchId, stakeType, odds, stakeElement) {
            // Find the match
            let match;
            const allMatches = [...matches, ...kenyanMatches.fpl, ...kenyanMatches.nsl, ...kenyanMatches.division1];
            match = allMatches.find(m => m.id === matchId);
            
            // Check if this match is already in the bet slip
            const existingBetIndex = betSlip.findIndex(bet => bet.matchId === matchId);
            
            if (existingBetIndex !== -1) {
                // Replace the existing bet for this match
                betSlip[existingBetIndex] = {
                    matchId,
                    stakeType,
                    odds,
                    match
                };
            } else {
                // Add new bet to the slip
                betSlip.push({
                    matchId,
                    stakeType,
                    odds,
                    match
                });
            }
            
            // Update the UI
            updateBetSlipUI();
            
            // Show animation on the stake element
            stakeElement.classList.add('stake-added');
            setTimeout(() => {
                stakeElement.classList.remove('stake-added');
            }, 500);
            
            // Show notification
            showNotification(`Stake added to bet slip!`);
            
            // Open the bet slip
            betSlipElement.classList.add('active');
        }

        // Update bet slip UI
        function updateBetSlipUI() {
            // Update bet count
            betCountElement.textContent = betSlip.length;
            
            // Update total odds
            totalOdds = betSlip.reduce((total, bet) => total * bet.odds, 1);
            totalOddsElement.textContent = totalOdds.toFixed(2);
            
            // Update bet slip content
            if (betSlip.length === 0) {
                document.getElementById('emptyBetSlip').style.display = 'block';
                betSlipContent.innerHTML = '<p id="emptyBetSlip" style="text-align: center; color: #999; padding: 20px;">Your bet slip is empty. Add stakes from matches above.</p>';
            } else {
                document.getElementById('emptyBetSlip')?.remove();
                
                let betSlipHTML = '';
                betSlip.forEach((bet, index) => {
                    const stakeTypeText = bet.stakeType === '1' ? bet.match.team1 : bet.stakeType === '2' ? bet.match.team2 : 'Draw';
                    
                    betSlipHTML += `
                        <div class="bet-item">
                            <div>
                                <div class="bet-match">${bet.match.team1} vs ${bet.match.team2}</div>
                                <div class="bet-selection">${stakeTypeText} @ ${bet.odds.toFixed(2)}</div>
                            </div>
                            <button class="remove-bet" data-index="${index}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                });
                
                betSlipContent.innerHTML = betSlipHTML;
                
                // Add event listeners to remove buttons
                document.querySelectorAll('.remove-bet').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const index = parseInt(e.currentTarget.dataset.index);
                        removeFromBetSlip(index);
                    });
                });
            }
        }

        // Remove bet from bet slip
        function removeFromBetSlip(index) {
            betSlip.splice(index, 1);
            updateBetSlipUI();
            showNotification('Stake removed from bet slip');
        }

        // Place bet (simulate)
        function placeBet() {
            if (betSlip.length === 0) {
                showNotification('Please add stakes to your bet slip first');
                return;
            }
            
            // Show success message
            showNotification(`Bet placed successfully! Potential win: KES ${(100 * totalOdds).toFixed(2)}`, true);
            
            // Clear bet slip
            betSlip = [];
            updateBetSlipUI();
            
            // Close bet slip after 3 seconds
            setTimeout(() => {
                betSlipElement.classList.remove('active');
            }, 3000);
        }

        // Show notification
        function showNotification(message, isSuccess = true) {
            notificationText.textContent = message;
            notification.style.backgroundColor = isSuccess ? 'var(--primary)' : 'var(--accent)';
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Initialize the page when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);