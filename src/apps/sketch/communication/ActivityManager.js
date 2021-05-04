import { Players } from './Players';
import { META_TYPES } from '../constants';
import { getChannel } from '../utils';
import { CHAT_TYPE } from './../constants';

// all game logic goes here
export class ActivityManager {

    publish;

    players = new Players();

    currWord = 'CORRECT';

    isGameSessionActive = false;

    setGameSession(flag) {
        this.isGameSessionActive = flag;
    }

    setCurrWord(word) {
        this.currWord = word;
        console.log(this.currWord);//
    }

    handle(message) {
        switch (getChannel(message)) {
            case 'meta':
                this.handleMeta(message);
                break;
            case 'chat':
                this.handleChat(message);
                break;
            case 'brush':
            default:
                this.publish(message);
        }
    }

    handleChat(message) {
        const data = JSON.parse(message.data);
        if (this.players.getUserById(data.userId).solved || !data.data)
            return;

        if ((data.data === this.currWord) && (this.isGameSessionActive) ) {
            this.players.getUserById(data.userId).addSessionScore(1);
            const resp = {
                userId: data.userId,
                type: CHAT_TYPE.SOLVED,
            };
            this.publish({ data: JSON.stringify(resp) }, getChannel(message));
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
            default:
                this.publish(message)
        }
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
}