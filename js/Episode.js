class Episode {
    static episodes = [];

    #number;
    #date;
    #week;

    constructor(number, date, week) {
        this.#number = number + 1;
        this.#date = date;
        this.#week = week;

        if (Episode.episodes[number] == null) {
            Episode.episodes[number] = this;
        }
    }

    get number() {
        return this.#number;
    }

    get date() {
        return this.#date;
    }

    get week() {
        return this.#week;
    }
}
