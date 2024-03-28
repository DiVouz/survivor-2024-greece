function getPlayerNameFromUrl() {
    const url = new URL(window.location.href);
    const playerName = url.searchParams.get('name');

    if (playerName === null) {
        gotoPlayerPage('index.html');
        return null;
    }

    return playerName;
}

function calculateAge(birthdayYear) {
    const currentYear = new Date().getFullYear();
    return currentYear - birthdayYear;
}

function getWinPercentString(total, win) {
    if (total === 0) return '0';
    return Math.round((win / total) * 100.0);
}

function getWinPercentStyleString(percent) {
    return `
        radial-gradient(closest-side, var(--color-main-1) 75%, transparent 78% 100%),
        conic-gradient(
            var(--color-blue) ${percent}%,
            var(--color-red) 0
        )
    `;
}

function fetchAllData(currentPlayerName) {
    getAllPlayers().then((players) => {
        const currentPlayer = players.find((player) => player.name === currentPlayerName);
        if (currentPlayer === undefined) {
            gotoPlayerPage('index.html');
            return;
        }

        parsePlayerData(currentPlayer, players);

        getAllMatches().then((matches) => {
            parseMatchesData(currentPlayer, players, matches);
        });

        getAllVoted().then((voted) => {
            parseVotedData(currentPlayer, players, voted);
        });
    });
}

function parsePlayerData(currentPlayer, players) {
    const body_element = document.querySelector('body');
    body_element.dataset.team = currentPlayer.team.toLowerCase();
    body_element.dataset.active = currentPlayer.active;

    const playerImage_element = document.querySelector('#player-header-image-background');
    playerImage_element.style.backgroundImage = `url(${currentPlayer.image})`;

    const playerName_element = document.querySelector('#player-header-info-name');
    playerName_element.innerHTML = currentPlayer.name;

    const playerAge_element = document.querySelector('#player-header-info-extra-age');
    playerAge_element.innerHTML = calculateAge(currentPlayer.birth_year);

    const playerJob_element = document.querySelector('#player-header-info-extra-job');
    playerJob_element.innerHTML = currentPlayer.job;

    const playerTeam_element = document.querySelector('#player-header-team');
    playerTeam_element.innerHTML = currentPlayer.team.toLowerCase() === 'blue' ? 'Μπλε' : 'Κόκκινη';
}

function parseMatchesData(currentPlayer, players, matches) {
    let totalTeamMatchAmount = 0;
    let totalTeamMatchAmount_win = 0;
    let totalTeamMatchAmount_lose = 0;

    let totalMatchWithTeamImmunity = 0;
    let totalMatchWithTeamImmunity_win = 0;
    let totalMatchWithTeamImmunity_lose = 0;

    let totalMatchWithFood = 0;
    let totalMatchWithFood_win = 0;
    let totalMatchWithFood_lose = 0;

    let totalMatchWithCommunication = 0;
    let totalMatchWithCommunication_win = 0;
    let totalMatchWithCommunication_lose = 0;

    let totalMatchWithSelfStay = 0;
    let totalMatchWithSelfStay_win = 0;
    let totalMatchWithSelfStay_lose = 0;

    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];

        let isCurrentPlayerWinner = false;
        let isCurrentPlayerLoser = false;

        // count win/lose and elo for each player
        {
            const winnerReverce = [2, 1];

            const winPlayer1 = players.find(player => player.name == match[`team${match.winner}player1`]);
            const winPlayer2 = players.find(player => player.name == match[`team${match.winner}player2`]);
            const losePlayer1 = players.find(player => player.name == match[`team${winnerReverce[match.winner - 1]}player1`]);
            const losePlayer2 = players.find(player => player.name == match[`team${winnerReverce[match.winner - 1]}player2`]);
            
            const winPlayer1elo = winPlayer1 != null ? winPlayer1.elo : 0;
            const winPlayer2elo = winPlayer2 != null ? winPlayer2.elo : 0;
            const losePlayer1elo = losePlayer1 != null ? losePlayer1.elo : 0;
            const losePlayer2elo = losePlayer2 != null ? losePlayer2.elo : 0;

            if (winPlayer1) {
                winPlayer1.addWin(winPlayer2elo, losePlayer1elo, losePlayer2elo);

                if (winPlayer1.name === currentPlayer.name) isCurrentPlayerWinner = true;
            }
            if (winPlayer2) {
                winPlayer2.addWin(winPlayer1elo, losePlayer1elo, losePlayer2elo);

                if (winPlayer2.name === currentPlayer.name) isCurrentPlayerWinner = true;
            }

            if (losePlayer1) {
                losePlayer1.addLose(losePlayer2elo, winPlayer1elo, winPlayer2elo);

                if (losePlayer1.name === currentPlayer.name) isCurrentPlayerLoser = true;
            }
            if (losePlayer2) {
                losePlayer2.addLose(losePlayer1elo, winPlayer1elo, winPlayer2elo);

                if (losePlayer2.name === currentPlayer.name) isCurrentPlayerLoser = true;
            }
        }

        // calulate matches stats
        if (isCurrentPlayerWinner || isCurrentPlayerLoser){
            if (!match.selfStay) {
                totalTeamMatchAmount++;

                if (isCurrentPlayerWinner) totalTeamMatchAmount_win++;
                else totalTeamMatchAmount_lose++;
            }
            
            if (match.teamImmunity) {
                totalMatchWithTeamImmunity++;

                if (isCurrentPlayerWinner) totalMatchWithTeamImmunity_win++;
                else totalMatchWithTeamImmunity_lose++;
            }

            if (match.food) {
                totalMatchWithFood++;
                
                if (isCurrentPlayerWinner) totalMatchWithFood_win++;
                else totalMatchWithFood_lose++;
            }

            if (match.communication) {
                totalMatchWithCommunication++;

                if (isCurrentPlayerWinner) totalMatchWithCommunication_win++;
                else totalMatchWithCommunication_lose++;
            }

            if (match.selfStay) {
                totalMatchWithSelfStay++;

                if (isCurrentPlayerWinner) totalMatchWithSelfStay_win++;
                else totalMatchWithSelfStay_lose++;
            }
        }
    }

    players.sort((a, b) => b.elo - a.elo);

    // Set player general stats 
    {
        const playerRank_element = document.querySelector('#general-stats-rank');
        playerRank_element.innerHTML = players.findIndex(player => player.name == currentPlayer.name) + 1;
    }

    // Set player match stats
    {
        {
            const sectionMatches_total_amount_element = document.querySelector('.match-stat-card[data-match-type="total"]');
            sectionMatches_total_amount_element.querySelector('.match-stat-card-amount-total').innerHTML = totalTeamMatchAmount;
            sectionMatches_total_amount_element.querySelector('.match-stat-card-blue-amount').innerHTML = totalTeamMatchAmount_win;
            sectionMatches_total_amount_element.querySelector('.match-stat-card-red-amount').innerHTML = totalTeamMatchAmount_lose;

            const winPercent = getWinPercentString(totalTeamMatchAmount, totalTeamMatchAmount_win);
            sectionMatches_total_amount_element.querySelector('.match-stat-card-amount-teams-percent > span').innerHTML = winPercent;
            sectionMatches_total_amount_element.querySelector('.match-stat-card-amount-teams-percent').style.background = getWinPercentStyleString(winPercent);
        }

        {
            const sectionMatches_teamImmunity_amount_element = document.querySelector('.match-stat-card[data-match-type="team-immunity"]');
            sectionMatches_teamImmunity_amount_element.querySelector('.match-stat-card-amount-total').innerHTML = totalMatchWithTeamImmunity;
            sectionMatches_teamImmunity_amount_element.querySelector('.match-stat-card-blue-amount').innerHTML = totalMatchWithTeamImmunity_win;
            sectionMatches_teamImmunity_amount_element.querySelector('.match-stat-card-red-amount').innerHTML = totalMatchWithTeamImmunity_lose;

            const winPercent = getWinPercentString(totalMatchWithTeamImmunity, totalMatchWithTeamImmunity_win);
            sectionMatches_teamImmunity_amount_element.querySelector('.match-stat-card-amount-teams-percent > span').innerHTML = winPercent;
            sectionMatches_teamImmunity_amount_element.querySelector('.match-stat-card-amount-teams-percent').style.background = getWinPercentStyleString(winPercent);
        }
        
        {
            const sectionMatches_food_amount_element = document.querySelector('.match-stat-card[data-match-type="food"]');
            sectionMatches_food_amount_element.querySelector('.match-stat-card-amount-total').innerHTML = totalMatchWithFood;
            sectionMatches_food_amount_element.querySelector('.match-stat-card-blue-amount').innerHTML = totalMatchWithFood_win;
            sectionMatches_food_amount_element.querySelector('.match-stat-card-red-amount').innerHTML = totalMatchWithFood_lose;

            const winPercent = getWinPercentString(totalMatchWithFood, totalMatchWithFood_win);
            sectionMatches_food_amount_element.querySelector('.match-stat-card-amount-teams-percent > span').innerHTML = winPercent;
            sectionMatches_food_amount_element.querySelector('.match-stat-card-amount-teams-percent').style.background = getWinPercentStyleString(winPercent);
        }
        
        {
            const sectionMatches_communication_amount_element = document.querySelector('.match-stat-card[data-match-type="communication"]');
            sectionMatches_communication_amount_element.querySelector('.match-stat-card-amount-total').innerHTML = totalMatchWithCommunication;
            sectionMatches_communication_amount_element.querySelector('.match-stat-card-blue-amount').innerHTML = totalMatchWithCommunication_win;
            sectionMatches_communication_amount_element.querySelector('.match-stat-card-red-amount').innerHTML = totalMatchWithCommunication_lose;

            const winPercent = getWinPercentString(totalMatchWithCommunication, totalMatchWithCommunication_win);
            sectionMatches_communication_amount_element.querySelector('.match-stat-card-amount-teams-percent > span').innerHTML = winPercent;
            sectionMatches_communication_amount_element.querySelector('.match-stat-card-amount-teams-percent').style.background = getWinPercentStyleString(winPercent);
        }
        
        {
            const sectionMatches_selfStay_amount_element = document.querySelector('.match-stat-card[data-match-type="self-stay"]');
            sectionMatches_selfStay_amount_element.querySelector('.match-stat-card-amount-total').innerHTML = totalMatchWithSelfStay;
            sectionMatches_selfStay_amount_element.querySelector('.match-stat-card-blue-amount').innerHTML = totalMatchWithSelfStay_win;
            sectionMatches_selfStay_amount_element.querySelector('.match-stat-card-red-amount').innerHTML = totalMatchWithSelfStay_lose;

            const winPercent = getWinPercentString(totalMatchWithSelfStay, totalMatchWithSelfStay_win);
            sectionMatches_selfStay_amount_element.querySelector('.match-stat-card-amount-teams-percent > span').innerHTML = winPercent;
            sectionMatches_selfStay_amount_element.querySelector('.match-stat-card-amount-teams-percent').style.background = getWinPercentStyleString(winPercent);
        }
    }
}

function parseVotedData(currentPlayer, players, voted) {
    let votedTimes = 0;

    for (let i = 0; i < voted.length; i++) {
        if (voted[i].player.name === currentPlayer.name) {
            votedTimes++;
        }
    }

    const playerVoted_element = document.querySelector('#general-stats-voted');
    playerVoted_element.innerHTML = votedTimes;
}

const playerName = getPlayerNameFromUrl();
if (playerName !== null) fetchAllData(playerName);
