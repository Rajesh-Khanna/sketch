class Player {

    id = 'player-id';

    name = 'Player';

    sessionScore = 0;

    score = 0;

    solved = false;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    addScore(points) {
        this.score += points;
        this.sessionScore = points;
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
                return a.sessionScore - b.sessionScore;
            })
            .map((player, index) => {
                return {
                    name: player.name,
                    userId: player.id,
                    sessionScore: player.sessionScore,
                    score:player.score,
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