class Player {

    id = 'player-id';

    name = 'Player';

    score = 0;

    solved = false;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    addScore(points) {
        this.score += points;
        this.solved = true;
    }

}

export class Players {

    players = {}

    addPlayer(id, name) {
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

    getUserById(id) {
        return this.players[id];
    }

}