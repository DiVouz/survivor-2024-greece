function fetchAllData() {
    getAllPlayers().then((players) => {
        getAllMatches().then((matches) => {
            parseMatchesData(players, matches);
        });

        getAllVoted().then((voted) => {
            parseVotedData(players, voted);
        });
    });
}

function parseMatchesData(players, matches) {
    let totalTeamMatchAmount = 0;
    let totalTeamMatchAmount_blue = 0;
    let totalTeamMatchAmount_red = 0;

    let totalMatchWithTeamImmunity = 0;
    let totalMatchWithTeamImmunity_blue = 0;
    let totalMatchWithTeamImmunity_red = 0;

    let totalMatchWithFood = 0;
    let totalMatchWithFood_blue = 0;
    let totalMatchWithFood_red = 0;

    let totalMatchWithCommunication = 0;
    let totalMatchWithCommunication_blue = 0;
    let totalMatchWithCommunication_red = 0;

    let totalMatchWithSelfStay = 0;
    let totalMatchWithSelfStay_blue = 0;
    let totalMatchWithSelfStay_red = 0;

    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];

        const isBlueWinner = ((match.winner === 1 && match.team1name === 'Blue') || (match.winner === 2 && match.team2name === 'Blue'));

        // calulate matches stats
        {
            if (!match.selfStay) {
                totalTeamMatchAmount++;

                if (isBlueWinner) totalTeamMatchAmount_blue++;
                else totalTeamMatchAmount_red++;
            }
            
            if (match.teamImmunity) {
                totalMatchWithTeamImmunity++;

                if (isBlueWinner) totalMatchWithTeamImmunity_blue++;
                else totalMatchWithTeamImmunity_red++;
            }

            if (match.food) {
                totalMatchWithFood++;
                
                if (isBlueWinner) totalMatchWithFood_blue++;
                else totalMatchWithFood_red++;
            }

            if (match.communication) {
                totalMatchWithCommunication++;

                if (isBlueWinner) totalMatchWithCommunication_blue++;
                else totalMatchWithCommunication_red++;
            }

            if (match.selfStay) {
                totalMatchWithSelfStay++;

                if (isBlueWinner) totalMatchWithSelfStay_blue++;
                else totalMatchWithSelfStay_red++;
            }
        }

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

            if (winPlayer1) winPlayer1.addWin(winPlayer2elo, losePlayer1elo, losePlayer2elo);
            if (winPlayer2) winPlayer2.addWin(winPlayer1elo, losePlayer1elo, losePlayer2elo);

            if (losePlayer1) losePlayer1.addLose(losePlayer2elo, winPlayer1elo, winPlayer2elo);
            if (losePlayer2) losePlayer2.addLose(losePlayer1elo, winPlayer1elo, winPlayer2elo);
        }
    }

    // Sort players by elo
    players.sort((a, b) => b.elo - a.elo);

    // Set players to section-teams
    {
        const sectionTeams_blueMen_element = document.querySelector('#team-blue-men');
        const sectionTeams_blueWomen_element = document.querySelector('#team-blue-women');
        const sectionTeams_redMen_element = document.querySelector('#team-red-men');
        const sectionTeams_redWomen_element = document.querySelector('#team-red-women');

        for (let i = 0; i < players.length; i++) {
            const player = players[i];

            // if (player.active) {
                if (player.gender === 'M') {
                    if (player.team === 'Blue') {
                        sectionTeams_blueMen_element.insertAdjacentHTML('beforeend', player.template);
                    } else {
                        sectionTeams_redMen_element.insertAdjacentHTML('beforeend', player.template);
                    }
                } else {
                    if (player.team === 'Blue') {
                        sectionTeams_blueWomen_element.insertAdjacentHTML('beforeend', player.template);
                    } else {
                        sectionTeams_redWomen_element.insertAdjacentHTML('beforeend', player.template);
                    }
                }

                const player_element = document.getElementById(player.element_id);
                const player_image = player_element.querySelector('.player-image');
                player_image.style.backgroundImage = `url(${player.image})`;
            // }
        }
    }

    // Set matches to section-match-stats
    {
        const sectionMatches_total_amount_element = document.querySelector('.match-stat-card[data-match-type="total"]');
        sectionMatches_total_amount_element.querySelector('.match-stat-card-amount-total').innerHTML = totalTeamMatchAmount;
        sectionMatches_total_amount_element.querySelector('.match-stat-card-blue-amount').innerHTML = totalTeamMatchAmount_blue;
        sectionMatches_total_amount_element.querySelector('.match-stat-card-red-amount').innerHTML = totalTeamMatchAmount_red;
        
        const sectionMatches_teamImmunity_amount_element = document.querySelector('.match-stat-card[data-match-type="team-immunity"]');
        sectionMatches_teamImmunity_amount_element.querySelector('.match-stat-card-amount-total').innerHTML = totalMatchWithTeamImmunity;
        sectionMatches_teamImmunity_amount_element.querySelector('.match-stat-card-blue-amount').innerHTML = totalMatchWithTeamImmunity_blue;
        sectionMatches_teamImmunity_amount_element.querySelector('.match-stat-card-red-amount').innerHTML = totalMatchWithTeamImmunity_red;
        
        const sectionMatches_food_amount_element = document.querySelector('.match-stat-card[data-match-type="food"]');
        sectionMatches_food_amount_element.querySelector('.match-stat-card-amount-total').innerHTML = totalMatchWithFood;
        sectionMatches_food_amount_element.querySelector('.match-stat-card-blue-amount').innerHTML = totalMatchWithFood_blue;
        sectionMatches_food_amount_element.querySelector('.match-stat-card-red-amount').innerHTML = totalMatchWithFood_red;
        
        const sectionMatches_communication_amount_element = document.querySelector('.match-stat-card[data-match-type="communication"]');
        sectionMatches_communication_amount_element.querySelector('.match-stat-card-amount-total').innerHTML = totalMatchWithCommunication;
        sectionMatches_communication_amount_element.querySelector('.match-stat-card-blue-amount').innerHTML = totalMatchWithCommunication_blue;
        sectionMatches_communication_amount_element.querySelector('.match-stat-card-red-amount').innerHTML = totalMatchWithCommunication_red;
        
        const sectionMatches_selfStay_amount_element = document.querySelector('.match-stat-card[data-match-type="self-stay"]');
        sectionMatches_selfStay_amount_element.querySelector('.match-stat-card-amount-total').innerHTML = totalMatchWithSelfStay;
        sectionMatches_selfStay_amount_element.querySelector('.match-stat-card-blue-amount').innerHTML = totalMatchWithSelfStay_blue;
        sectionMatches_selfStay_amount_element.querySelector('.match-stat-card-red-amount').innerHTML = totalMatchWithSelfStay_red;
    }

    // Set players to section-top3
    {
        for (let i = 0; i < 3; i++) {
            const player = players[i];
            
            const rankXplayer_element = document.querySelector(`.section-top3 .top3-rank${i + 1}`);
            rankXplayer_element.querySelector('.top3-player').addEventListener('click', gotoPlayerPage.bind(null, 'player.html', {name: player.name}));
            rankXplayer_element.querySelector('.top3-player-image').style.backgroundImage = `url(${player.image})`;
            rankXplayer_element.querySelector('.top3-player-percent > span').innerHTML = Math.round(player.winrate);
            rankXplayer_element.querySelector('.top3-player-win').innerHTML = player.wins;
            rankXplayer_element.querySelector('.top3-player-lose').innerHTML = player.losses;
            rankXplayer_element.querySelector('.top3-player-name').innerHTML = player.name;
        }
    }
}

function parseVotedData(players, voted) {
    const weeks = [];

    for (let i = 0; i < voted.length; i++) {
        const vote = voted[i];

        if (weeks[vote.week] == null) {
            weeks[vote.week] = [];
        }

        weeks[vote.week].push(vote);
    }

    for (let weekNumber in weeks) {
        const week = weeks[weekNumber];

        for (let j = 0; j < week.length; j++) {
            const vote = week[j];

            if (vote.player == null) {
                continue;
            }
        }
    }

    const votedContainer_element = document.querySelector('.section-voted .voted-container');

    for (let weekNumber in weeks) {
        const week = weeks[weekNumber];

        if (week == null) {
            continue;
        }
        
        votedContainer_element.insertAdjacentHTML('afterbegin', week[0].week_template);
        const weekContainer_element = votedContainer_element.querySelector(`#${week[0].week_element_id} .voted-players-container`);

        for (let j = 0; j < 4; j++) {
            const vote = (j < week.length) ? week[j] : new Voted(weekNumber, new Player('Unknown', null, null, null, null, null, null, false), false);

            weekContainer_element.insertAdjacentHTML('beforeend', vote.player_template);
            const playerImage_element = weekContainer_element.querySelector(`#${vote.player_element_id} .voted-player-image`);
            
            if (vote.player != null && vote.player.image != null) {
                playerImage_element.style.backgroundImage = `url(${vote.player.image})`;
            } else {
                playerImage_element.style.backgroundColor = 'white';
                playerImage_element.style.backgroundImage = `url(assets/images/question-mark.png)`;
                playerImage_element.style.backgroundSize = '50%';
                playerImage_element.style.backgroundPosition = 'center';
            }
        }
    }
}

fetchAllData();
