class Voted {
    static HTML_TEMPLATE_WEEK = `
        <div id="{ID}">
            <div class="voted-title">Εβδομαδα {WEEK_NUMBER}</div>
            <div class="flex-row flex-wrap voted-players-container">
            </div>
        </div>
    `;

    static HTML_TEMPLATE_PLAYER = `
        <div class="voted-player" data-lost="{LOST}" id="{ID}">
            <div class="voted-player-image"></div>
        </div>
    `;

    #week;
    #player;
    #lost;

    constructor(week, player, lost) {
        this.#week = week;
        this.#player = player.replace(/\r/g, '').replace(/  +/g, ' ');
        this.#lost = lost;
    }
    
    get week() {
        return this.#week;
    }

    get player() {
        return this.#player;
    }

    get lost() {
        return this.#lost;
    }

    get week_element_id() {
        return `week-${this.#week}`
    }

    get week_template() {
        return Voted.HTML_TEMPLATE_WEEK
                        .replace(/{ID}/g, this.week_element_id)
                        .replace(/{WEEK_NUMBER}/g, this.#week);
    }

    get player_element_id() {
        return `week-${this.#week}-player-${this.#player.toLowerCase().replace(/ /g, '-')}`;
    }

    get player_template() {
        return Voted.HTML_TEMPLATE_PLAYER
                        .replace(/{ID}/g, this.player_element_id)
                        .replace(/{LOST}/g, this.#lost);
    }
}