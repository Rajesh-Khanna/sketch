// all game logic goes here
export class MessageFormat {

    /** Meta Protocol */ 
    playersList(players)  {
        let obj = {
            "type": "PLAYERS",
            "name":  players // Array<String>
        };
        return JSON.stringify(obj);
    }

    playerName(player) {
        let obj = {
            "type": "PLAYER",
            "name":  player // String
        };
        return JSON.stringify(obj);
    }

    startGame() {
        let obj = {
            "type": "START_GAME"
        };
        return JSON.stringify(obj);
    }

    endGame() {
        let obj = {
            "type": "END_GAME"
        };
        return JSON.stringify(obj);
    }

    resetGame() {
        let obj = {
            "type": "RESET_GAME"
        };
        return JSON.stringify(obj);
    }

    /** Game Dynamics */ 
    initTurn(id, roundNum) {
        let obj = {
            "type": "INIT_TURN",
            "userId": id, // String
            "roundNum": roundNum // int
        };
        return JSON.stringify(obj);
    }

    selectedWord(word) {
        let obj = {
            "type": "SELECTED_WORD",
            "word": word // String
        };
        return JSON.stringify(obj);
    }

    blanks(blanks) {
        let obj = {
            "type": "BLANKS",
            "blanks": blanks // binary String
        };
        return JSON.stringify(obj);
    }

    endTurn(scores) {
        let obj = {
            "type": "END_TURN",
            "scores": scores // Array<{userId<String>, score<int>, rank<int>}>
        };
        return JSON.stringify(obj);
    }

    /** Chat Protocol */ 

    guessWord(id, data) {
        let obj = {
            "type": "GUESS",
            "userId": id, // String
            "data": data // String
        };
        return JSON.stringify(obj);
    }

    guessed(id, data) {
        let obj = {
            "type": "SOLVED",
            "userId": id, // String
            "data": data // boolean
        };
        return JSON.stringify(obj);
    }

    clues(id, data) {
        let obj = {
            "type": "CLUE",
            "userId": id, // String
            "data": data // String
        };
        return JSON.stringify(obj);
    }
}