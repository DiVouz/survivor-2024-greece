class Player {
    static HTML_TEMPLATE = `
        <div class="player" id="{ID}" data-team="{TEAM}" data-active="true">
            <div class="player-image"></div>
        </div>
    `;

    #name;
    #gender;
    #team;
    #active;
    #image;

    #wins;
    #losses;

    #elo;

    constructor(name, gender, team, active, image) {
        this.#name = name.replace(/\r/g, '').replace(/  +/g, ' ');
        this.#gender = gender;
        this.#team = team;
        this.#active = active;
        this.#image = image;

        this.#wins = 0;
        this.#losses = 0;
        this.#elo = 1000;
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

    get elo() {
        return this.#elo;
    }

    get element_id() {
        return `player-${this.#name.toLowerCase().replace(/ /g, '-')}`
    }

    get template() {
        return Player.HTML_TEMPLATE
                        .replace(/{ID}/g, this.element_id)
                        .replace(/{TEAM}/g, this.team.toLowerCase());
    }

    addWin(mateCurrentElo, enemy1CurrentElo, enemy2CurrentElo) {
        this.#wins++;
        this.#calculateElo(mateCurrentElo, enemy1CurrentElo, enemy2CurrentElo, 1);
    }

    addLose(mateCurrentElo, enemy1CurrentElo, enemy2CurrentElo) {
        this.#losses++;
        this.#calculateElo(mateCurrentElo, enemy1CurrentElo, enemy2CurrentElo, 0);
    }

    #calculateElo(mateCurrentElo, enemy1CurrentElo, enemy2CurrentElo, matchResult) {
        const K = 20;
        const score = matchResult === 1 ? 1 : 0;

        const diff = ((enemy1CurrentElo + enemy2CurrentElo) - (this.#elo + mateCurrentElo)) / 400;
        const pow = Math.pow(10, diff);

        const expected = 1 / (pow + 1);
        const eloChange = K * (score - expected);

        this.#elo += eloChange;
    }
}