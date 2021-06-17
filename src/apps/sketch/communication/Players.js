class Player {

    id = 'player-id';

    name = 'Player';

    sessionScore = 0;

    score = 0;

    solved = false;

    guessedTime = 0;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    resetSessionScore() {
        this.sessionScore = 0;
        this.solved = false;
        this.guessedTime = 0;
    }

    resetScore() {
        this.score = 0;
        this.sessionScore = 0;
        this.solved = false;
        this.guessedTime = 0;
    }

    addScore(points) {
        this.score += points;
        this.sessionScore = points;
        this.solved = true;
    }

    addGuessedTime(time) {
        this.guessedTime = time;
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
            .map((player, index) => {
                return {
                    name: player.name,
                    userId: player.id,
                    sessionScore: player.sessionScore,
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

    deletePlayer(id) {
        delete this.players[id];
    }

    /** player -> 400 (formula) + 100 bonus (100/no.of players guessed)
     *  artist -> 400 ((400/playerCount) * no. of players guessed) + 100 bonus ((sum of each player formula score)/(4*(playerCount)) )
     *  considering avg as 60% so that the cubic equation will be strictly increasing with time (avg => at 60% of time, score will be half(200))
    */
    calculateScores(artist) {
        let p = Object.values(this.players);
        let i = 0, count = 0;

        let a = 1, b = 165, c = 234;
        let t, absoluteScore, relativeScore, artistIndex, scoreSum = 0, score;

        for(i = 0; i < p.length; i++) {
            if (p[i].id === artist) {
                artistIndex = i;
                continue;
            }
            if (p[i].guessedTime !== 0) {
                count++;
            } 
        }

        for(i = 0; i < p.length; i++) {
            if (p[i].id === artist) {
                continue;
            }
            if (count === 0) {
                p[i].addScore(0);
            } else {
                t = p[i].guessedTime;
                if (t === 0) {
                    absoluteScore = 0;
                    relativeScore = 0;
                } else {
                    absoluteScore = a*Math.pow(t,3) + b*Math.pow(t,2) + c*t;
                    relativeScore = 100/(count);
                }
                score = Math.min(Math.round(absoluteScore+relativeScore), 500);
                scoreSum += score;
                p[i].addScore(score);
            }
        }

        //Artist score
        if (count === 0) {
            p[artistIndex].addScore(0);
        } else {
            absoluteScore = (400/(p.length-1))*count;
            relativeScore = scoreSum/(4*(p.length-1));

            score = Math.min(Math.round(absoluteScore+relativeScore), 500);
            p[artistIndex].addScore(score);
        }
    }
}