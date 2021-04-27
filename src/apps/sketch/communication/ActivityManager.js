// all game logic goes here
export class ActivityManager {

    publish;

    players = {};

    handle(message) {
        switch (message.currentTarget.label) {
            case 'chat':
            case 'brush':
            case 'meta':
            default:
                this.publish(message);

        }
    }
}