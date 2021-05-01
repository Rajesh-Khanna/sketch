class Player {

    id = 'player-id';

    name = 'Player';

    score = 0;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    addScore(points) {
        this.score += points;
    }

}

export class Players {

    players = {}

    addPlayer(name) {
        const id = Math.random().toString(36).slice(-6);
        this.players[id] = new Player(id, name);
    }

    getScore() {
        return Object.values(this.players)
            .sort(function(a, b) {
                return a.score - b.score;
            })
            .map((player, index) => {
                return {
                    userId: player.id,
                    score: player.score,
                    rank: index,
                };
            });
    }

    getAllPlayers() {
        return Object.values(this.players)
            .map((player, index) => {
                return {
                    userId: player.id,
                    name: player.name
                };
            });
    }

}