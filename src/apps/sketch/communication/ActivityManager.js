import { Players } from './Players';
import { META_TYPES } from '../constants';
import { getChannel } from '../utils';

// all game logic goes here
export class ActivityManager {

    publish;

    players = new Players();

    handle(message) {
        console.log('handle');
        switch (getChannel(message)) {
            case 'meta':
                this.handleMeta(message);
                break;
            case 'chat':
            case 'brush':
            default:
                this.publish(message);
        }
    }

    handleMeta(message) {
        console.log('handle meta');
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
        this.players.addPlayer(JSON.parse(message.data).name);
        const resp = {
            type: META_TYPES.PLAYERS,
            players: this.players.getAllPlayers(),
        }
        this.publish({ data: JSON.stringify(resp) }, getChannel(message));
    }
}