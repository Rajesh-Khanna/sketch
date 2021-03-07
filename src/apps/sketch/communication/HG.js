import PubSub from './pubSub';
import Signal from './signal';
import RTC from './webRTCHandler';

// constants
import { USER_TYPE, MESSAGE_TYPE } from '../constants';

export class Host {

    pubSub;

    signal;

    guests = {};

    constructor() {
        this.pubSub = new PubSub();
        this.signal = new Signal(USER_TYPE.HOST);
        this.signal.onMessage(this.incomingMessage);
    }

    incomingMessage(message) {
        switch (message.type) {
            case MESSAGE_TYPE.GUEST:
                this.addClient(message.guestId)
                break;
            case MESSAGE_TYPE.ANSWER:
                this.handleAnswer(message.guest)
                break;
            case MESSAGE_TYPE.OFFER:
                break;
            default:
                console.log('invalid message Type');
        }
    }

    addClient(id) {
        const rtc = new RTC();
        const offer = rtc.getOffer();
        this.signal.send({ id, offer });
        this.guests[id] = rtc;
    }

    handleAnswer(guest) {
        const rtc = this.guests[guest.id];
        rtc.setAnswer(guest.answer);
    }

}

export class Guest {
    signal;

    rtc;

    constructor() {
        this.signal = new Signal(USER_TYPE.GUEST);
        this.rtc = new RTC();
        this.signal.onMessage(this.incomingMessage);
    }

    incomingMessage(message) {
        switch (message.type) {
            case MESSAGE_TYPE.GUEST:
                this.addClient(message.guestId)
                break;
            case MESSAGE_TYPE.ANSWER:
                this.handleAnswer(message.guest)
                break;
            case MESSAGE_TYPE.OFFER:
                break;
            default:
                console.log('invalid message Type');
        }
    }

}