import { Players } from './Players';
import { META_TYPES, POPUP_TIMEOUT } from '../constants';
import { getChannel } from '../utils';
import { CHAT_TYPE } from './../constants';

// all game logic goes here
export class ActivityManager {

    publish;

    players = new Players();

    currWord = 'CORRECT';

    playerIds = [];

    roundNum = 0;

    isGameSessionActive = false;

    turnTime = 10;

    rounds = 3;

    handleTimeOutVariable;

    alivePlayers;

    sessionBrushQueue = {};

    playerPositions = {};

    // constructor() {
    //     setInterval( () => {if(this.publish) this.checkHeartBeat();}, 1000)
    // }

    setGameSession(flag) {
        this.isGameSessionActive = flag;
    }

    setCurrWord(word) {
        this.currWord = word;
        console.log(this.currWord); //
    }

    handle(message) {
        switch (getChannel(message)) {
            case 'meta':
                this.handleMeta(message);
                break;
            case 'chat':
                this.handleChat(message);
                break;
            case 'background':
                this.handleBackGround(message);
                break;
            case 'brush':
            default:
                this.publish(message);
        }
    }

    addBoardcastChannel(channel_name, dataChannel) {
        if (!(channel_name in this.sessionBrushQueue)) {
            this.sessionBrushQueue[channel_name] = [];
        }
        this.pollBrushQueue(channel_name, dataChannel);
    }

    pollBrushQueue(channel_name, dataChannel) {
        let myPosition = 0;
        setTimeout(() => {
            const queueL = this.sessionBrushQueue[channel_name].length;
            const stroks = this.sessionBrushQueue[channel_name].slice(myPosition, queueL);
            if (stroks.length > 0) {
                myPosition = queueL;
                dataChannel.send(JSON.stringify(stroks));
            }
        }, 100);
    }

    resetScores() {
        let allPlayers = this.players.getAllPlayers();
        for (let i = 0; i < allPlayers.length; i++) {
            this.players.getUserById(allPlayers[i].userId).resetScore();
        }
    }

    resetSessionScores() {
        let allPlayers = this.players.getAllPlayers();
        for (let i = 0; i < allPlayers.length; i++) {
            this.players.getUserById(allPlayers[i].userId).resetSessionScore();
        }
    }

    handleTimeOut() {
        console.log('hello'); //
        this.setGameSession(false);
        console.log(this.players.getScore());

        this.sessionBrushQueue['brush'] = [];

        const correctWord = {
            "type": "CORRECT_WORD",
            "data": this.currWord
        };
        this.publish({ data: JSON.stringify(correctWord) }, 'chat');

        // send scores
        let endObj = {
            "type": "END_TURN",
            "scores": this.players.getScore()
        };
        this.publish({ data: JSON.stringify(endObj) }, 'background');
        this.resetSessionScores();

        this.initiateSession();
    }

    initiateSession() {
        if (this.playerIds.length === 0) {
            if (this.roundNum < this.rounds) {
                this.playerIds = this.players.getAllPlayers();
                console.log(this.playerIds); //
                this.roundNum = this.roundNum + 1;
            }
        }

        if (this.playerIds.length) {
            console.log(this.playerIds); //
            console.log(this.playerIds[this.playerIds.length - 1]); //
            const userId = this.playerIds[this.playerIds.length - 1].userId;
            console.log(userId);
            /** timeout is added so that users get the time to check the scores
             * Note: Initially(when the page loads for the first time), it might happen that host sends the message
             * before guests start listening. Adding time out also mitigates this issue.
             */
            setTimeout(() => {
                console.log('message sent'); //
                let initObj = {
                    "type": "INIT_TURN",
                    "userId": userId,
                    "roundNum": this.roundNum,
                    "timer": this.turnTime,
                    "rounds": this.rounds
                };
                this.publish({ data: JSON.stringify(initObj) }, 'background');
            }, POPUP_TIMEOUT);
            this.playerIds.pop();
        } else {
            // Game over logic
            let winnerObj = {
                "type": "WINNER",
                "scores": this.players.getScore()
            }
            this.publish({ data: JSON.stringify(winnerObj) }, 'background');

            this.resetScores();
            this.roundNum = 0;
            let engObj = {
                "type": "END_GAME"
            };
            setTimeout(() => {
                this.publish({ data: JSON.stringify(engObj) }, 'meta');
            }, POPUP_TIMEOUT);
        }
    }

    generateBlanks(word) {
        let blank = ''
        for (let i = 0; i < word.length - 1; i++) {
            blank = blank + '_ ';
        }
        return blank + '_'
    }

    checkIfEveryOneSolved() {
        let allPlayers = this.players.getAllPlayers();
        let count = allPlayers.length;
        for (let i = 0; i < allPlayers.length; i++) {
            if (this.players.getUserById(allPlayers[i].userId).solved === true) {
                count = count - 1;
            }
        }
        if (count === 1) {
            clearTimeout(this.handleTimeOutVariable);
            this.handleTimeOut();
        }
    }

    handleBackGround(message) {
        const data = JSON.parse(message.data);

        if (data.type === "SELECTED_WORD") {
            this.setCurrWord(data.word);
            this.setGameSession(true);

            let blanks = this.generateBlanks(data.word);

            let blankObj = {
                "type": "BLANKS",
                "blanks": blanks
            };
            this.publish({ data: JSON.stringify(blankObj) }, 'background');
            this.handleTimeOutVariable = setTimeout(() => {
                this.handleTimeOut();
            }, (this.turnTime) * 1000);
        } else {
            this.publish(message);
        }
    }

    handleChat(message) {
        const data = JSON.parse(message.data);
        if (this.players.getUserById(data.userId).solved || !data.data)
            return;

        if ((data.data.toLowerCase() === this.currWord.toLowerCase()) && (this.isGameSessionActive)) {
            this.players.getUserById(data.userId).addScore(1);
            const resp = {
                userId: data.userId,
                type: CHAT_TYPE.SOLVED,
            };
            this.publish({ data: JSON.stringify(resp) }, getChannel(message));
            this.checkIfEveryOneSolved();
        } else {
            this.publish(message);
        }
    }

    handleMeta(message) {
        const data = JSON.parse(message.data);
        switch (data.type) {
            case META_TYPES.NEW_PLAYER:
                this.handleNewPlayer(message);
                break;
            case META_TYPES.ALIVE:
                this.checkLiveness(message);
                break;
            case META_TYPES.START_GAME:
                this.handleStartGame(message);
                // eslint-disable-next-line no-fallthrough
            default:
                this.publish(message)
        }
    }

    handleStartGame(message) {
        const data = JSON.parse(message.data);
        this.turnTime = data.turns;
        this.rounds = data.rounds;

        this.initiateSession();
    }

    handleNewPlayer(message) {
        const data = JSON.parse(message.data);
        this.players.addPlayer(data.userId, data.name);
        const resp = {
            type: META_TYPES.PLAYERS,
            players: this.players.getAllPlayers(),
        }
        this.publish({ data: JSON.stringify(resp) }, getChannel(message));
    }

    checkHeartBeat() {
        this.alivePlayers = [];
        let heartBeat = {
            type: META_TYPES.HEART_BEAT,
        }
        this.publish({ data: JSON.stringify(heartBeat) }, 'meta');

        setTimeout(() => {
            let allPlayers = this.players.getAllPlayers();
            console.log(this.alivePlayers);
            for (let i = 0; i < allPlayers.length; i++) {
                // console.log(allPlayers[i]);
                if (!this.alivePlayers.includes(allPlayers[i].userId)) {
                    console.log(allPlayers[i].userId);
                    this.players.deletePlayer(allPlayers[i].userId);
                    console.log(this.players.getAllPlayers());
                }
            }
        }, 3000);
    }

    checkLiveness(message) {
        console.log(message); //
        const data = JSON.parse(message.data);
        console.log(data); //
        console.log('alive player: ', data.userId); //
        this.alivePlayers.push(data.userId);
    }
}