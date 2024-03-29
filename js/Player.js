class PlayerEloHistory {
    #eloAmount;
    #match;
    
    constructor(eloAmount, match) {
        this.#eloAmount = eloAmount;
        this.#match = match;
    }

    get eloAmount() {
        return this.#eloAmount;
    }

    get match() {
        return this.#match;
    }

    get episode() {
        return this.#match.episode;
    }
}

class Player {
    static HTML_TEMPLATE = `
        <div class="player" id="{ID}" data-team="{TEAM}" data-active="{ACTIVE}" onclick="gotoPlayerPage('player.html', {name: '{NAME}'});">
            <div class="player-image"></div>
        </div>
    `;

    static currentId = 0;
    static players = [];

    static colors = [
        '#808080',
        '#d3d3d3',
        '#556b2f',
        '#8b4513',
        '#808000',
        '#483d8b',
        '#008000',
        '#008080',
        '#4682b4',
        '#00008b',
        '#8b008b',
        '#b03060',
        '#66cdaa',
        '#ff4500',
        '#ff8c00',
        '#ffff00',
        '#00ff00',
        '#8a2be2',
        '#00ff7f',
        '#dc143c',
        '#00ffff',
        '#f4a460',
        '#0000ff',
        '#adff2f',
        '#ff00ff',
        '#1e90ff',
        '#fa8072',
        '#eee8aa',
        '#dda0dd',
        '#ff1493',
        '#7b68ee',
        '#ee82ee',
        '#98fb98',
        '#87cefa',
        '#ffb6c1',
    ];

    #id;

    #uniqueColor;

    #name;
    #gender;
    #birth_year;
    #job;
    #team;
    #active;
    #image;

    #wins;
    #losses;

    #eloHistory;

    constructor(name, gender, birth_year, job, team, active, image, addToList = true) {
        this.#id = Player.currentId++;

        this.#uniqueColor = Player.colors[this.#id % Player.colors.length];

        this.#name = name.replace(/\r/g, '').replace(/  +/g, ' ');
        this.#gender = gender;
        this.#birth_year = birth_year;
        this.#job = job;
        this.#team = team;
        this.#active = active;
        this.#image = image;

        this.#wins = 0;
        this.#losses = 0;
        this.#eloHistory = [];

        if (addToList) Player.players.push(this);
    }

    get id() {
        return this.#id;
    }

    get uniqueColor() {
        return this.#uniqueColor;
    }

    get name() {
        return this.#name;
    }

    get active() {
        return this.#active;
    }

    get gender() {
        return this.#gender;
    }

    get birth_year() {
        return this.#birth_year;
    }

    get job() {
        return this.#job;
    }

    get team() {
        return this.#team;
    }

    get image() {
        return this.#image;
    }

    get wins() {
        return this.#wins;
    }

    get losses() {
        return this.#losses;
    }

    get winrate() {
        return this.#wins / (this.#wins + this.#losses) * 100.0;
    }

    get eloHistory() {
        return this.#eloHistory;
    }

    get currentElo() {
        if (this.#eloHistory.length === 0) return 1000;
        return this.#eloHistory[this.#eloHistory.length - 1].eloAmount;
    }

    get element_id() {
        return `player-${this.#name.toLowerCase().replace(/ /g, '-')}-${this.#id}`
    }

    get template() {
        return Player.HTML_TEMPLATE
                        .replace(/{ID}/g, this.element_id)
                        .replace(/{TEAM}/g, this.team.toLowerCase())
                        .replace(/{ACTIVE}/g, this.active ? 'true' : 'false')
                        .replace(/{NAME}/g, this.#name);
    }

    addWin(mateCurrentElo, enemy1CurrentElo, enemy2CurrentElo, match) {
        this.#wins++;
        this.#calculateElo(mateCurrentElo, enemy1CurrentElo, enemy2CurrentElo, 1, match);
    }

    addLose(mateCurrentElo, enemy1CurrentElo, enemy2CurrentElo, match) {
        this.#losses++;
        this.#calculateElo(mateCurrentElo, enemy1CurrentElo, enemy2CurrentElo, 0, match);
    }

    #calculateElo(mateCurrentElo, enemy1CurrentElo, enemy2CurrentElo, matchResult, match) {
        const K = 20;
        const score = matchResult === 1 ? 1 : 0;

        const diff = ((enemy1CurrentElo + enemy2CurrentElo) - (this.currentElo + mateCurrentElo)) / 400;
        const pow = Math.pow(10, diff);

        const expected = 1 / (pow + 1);
        const eloChange = K * (score - expected);

        if (this.#eloHistory.length === 0) this.#eloHistory.push(new PlayerEloHistory(1000, match));
        this.#eloHistory.push(new PlayerEloHistory(this.currentElo + eloChange, match));
    }
}