class Match {
    #team1name;
    #team2name;

    #team1player1;
    #team1player2;

    #team2player1;
    #team2player2;

    #winner;
    
    #date;
    #episode;

    #food;
    #communication;
    #teamImmunity;
    #selfStay;

    constructor(team1name, team2name, team1player1, team1player2, team2player1, team2player2, winner, date, episode, food, communication, teamImmunity, selfStay) {
        this.#team1name = team1name;
        this.#team2name = team2name;

        this.#team1player1 = team1player1 != null ? team1player1.replace(/\r/g, '').replace(/  +/g, ' ') : null;
        this.#team1player2 = team1player2 != null ? team1player2.replace(/\r/g, '').replace(/  +/g, ' ') : null;

        this.#team2player1 = team2player1 != null ? team2player1.replace(/\r/g, '').replace(/  +/g, ' ') : null;
        this.#team2player2 = team2player2 != null ? team2player2.replace(/\r/g, '').replace(/  +/g, ' ') : null;

        this.#winner = winner;
        
        this.#date = date;
        this.#episode = episode;

        this.#food = food;
        this.#communication = communication;
        this.#teamImmunity = teamImmunity;
        this.#selfStay = selfStay;
    }

    get team1name() {
        return this.#team1name;
    }

    get team2name() {
        return this.#team2name;
    }

    get team1player1() {
        return this.#team1player1;
    }

    get team1player2() {
        return this.#team1player2;
    }

    get team2player1() {
        return this.#team2player1;
    }

    get team2player2() {
        return this.#team2player2;
    }

    get winner() {
        return this.#winner;
    }

    get date() {
        return this.#date;
    }

    get episode() {
        return this.#episode;
    }

    get food() {
        return this.#food;
    }

    get communication() {
        return this.#communication;
    }

    get teamImmunity() {
        return this.#teamImmunity;
    }

    get selfStay() {
        return this.#selfStay;
    }
}