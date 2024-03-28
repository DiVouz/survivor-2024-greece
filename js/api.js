const SPREADSHEET_ID = '1sA0nzaNBZLBdllt6VQXkGvQTfSHxbo4lSFjxfG4G_qg';

async function fetchWithChuncks(spreadsheetGid) {
    const response = await fetch(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&tq&gid=${spreadsheetGid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const reader = response.body.getReader();
    let result = "";
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            return JSON.parse(result.slice(47, -2)).table;
        }
        result += new TextDecoder().decode(value);
    }
}

async function getAllPlayers() {
    const data = await fetchWithChuncks('0');

    const players = [];

    const rows = data.rows;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i].c;
        const player = {
            name: row[0] != null ? row[0].v : null,
            gender: row[1] != null ? row[1].v : null,
            birth_year: row[2] != null ? row[2].v : null,
            job: row[3] != null ? row[3].v : null,
            team: row[4] != null ? row[4].v : null,
            active: row[5] != null ? row[5].v : null,
            image: row[6] != null ? row[6].v : null
        };
        
        if (player.name != null) {
            players.push(new Player(player.name, player.gender, player.birth_year, player.job, player.team, player.active, player.image));
        }
    };

    return players;
}

async function getAllMatches() {
    const data = await fetchWithChuncks('1475962732');

    const matches = [];

    const rows = data.rows;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i].c;
        const match = {
            team1name: row[0] != null ? row[0].v : null,
            team2name: row[1] != null ? row[1].v : null,

            team1player1: row[2] != null ? row[2].v : null,
            team1player2: row[3] != null ? row[3].v : null,

            team2player1: row[4] != null ? row[4].v : null,
            team2player2: row[5] != null ? row[5].v : null,

            winner: row[6] != null ? row[6].v : null,
            
            date: row[7] != null ? row[7].v : null,
            episode: row[8] != null ? row[8].v : null,

            food: row[9] != null ? row[9].v : null,
            communication: row[10] != null ? row[10].v : null,
            teamImmunity: row[11] != null ? row[11].v : null,
            selfStay: row[12] != null ? row[12].v : null
        };

        if (match.winner == 1 || match.winner == 2) {
            matches.push(new Match(match.team1name, match.team2name, match.team1player1, match.team1player2, match.team2player1, match.team2player2, match.winner, match.date, match.episode, match.food, match.communication, match.teamImmunity, match.selfStay));
        }
    };

    return matches;
}

async function getAllVoted() {
    const data = await fetchWithChuncks('679755780');

    const voted = [];

    const rows = data.rows;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i].c;
        const vote = {
            week: row[0] != null ? row[0].v : null,
            player: row[1] != null ? row[1].v : null,
            lost: row[2] != null ? row[2].v : null,
        };
        
        if (vote.player != null) {
            const player = Player.players.find(player => player.name == vote.player);
            if (player != null) {
                voted.push(new Voted(vote.week, player, vote.lost));
            }
        }
    };

    return voted;
}
