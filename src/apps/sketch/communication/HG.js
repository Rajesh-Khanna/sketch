import PubSub from './pubSub';
import Signal from './signal';
import RTC from './webRTCHandler';

// constants
import { USER_TYPE, MESSAGE_TYPE } from '../constants';

class ChannelEndSim {

    label = null;

    onmessage = null;

    pipe = null;

    mod = false;

    readyState = 'open';

    constructor(label, mod) {
        this.label = label;
        this.mod = mod;
    }

    send(message) {
        message = {
            data: message,
            currentTarget: {
                label: this.label
            }
        }
        if (this.pipe) this.pipe(message);
    }
}

class ChannelSim {

    dc1;

    intakeChannel;

    constructor(label) {
        this.dc1 = new ChannelEndSim(label, true);
        this.intakeChannel = new ChannelEndSim(label);

        this.intakeChannel.pipe = (message) => {
            if (this.dc1.onmessage)
                this.dc1.onmessage(message);
        }
        this.dc1.pipe = (message) => {
            if (this.intakeChannel.onmessage)
                this.intakeChannel.onmessage(message);
        }
    }
}

export class Host {

    pubSub;

    signal;

    guests = {};

    channels = {};

    constructor(onLobbyKey) {
        this.pubSub = new PubSub();
        this.signal = new Signal('host', null, onLobbyKey);
        this.signal.onMessage((message) => { this.incomingMessage(message) });
        this.simulatedChannels();
    }

    incomingMessage(message) {
        switch (message.type) {
            case MESSAGE_TYPE.GUEST:
                this.addClient(message.guestId)
                break;
            case MESSAGE_TYPE.ANSWER:
                this.handleAnswer(message.guest)
                break;
            default:
                console.log('invalid message Type', message);
        }
    }

    addClient(id) {
        console.log('addClient', id);
        const rtc = new RTC(
            USER_TYPE.HOST,
            (offer, guestId) => { this.signal.send('offer', offer, guestId) },
            (e) => { this.createChannels(id) },
            id
        );
        rtc.generateOffer();
        this.guests[id] = rtc;
    }

    createChannels(id) {
        this.pubSub.push('meta', this.guests[id].createChannel('meta'));
        this.pubSub.push('brush', this.guests[id].createChannel('brush'));
        this.pubSub.push('chat', this.guests[id].createChannel('chat'));
    }

    simulatedChannels() {
        const metaChannel = new ChannelSim('meta');
        const brushChannel = new ChannelSim('brush');
        const chatChannel = new ChannelSim('chat');

        this.channels['meta'] = metaChannel.intakeChannel;
        this.channels['brush'] = brushChannel.intakeChannel;
        this.channels['chat'] = chatChannel.intakeChannel;

        this.pubSub.push('meta', metaChannel.dc1);
        this.pubSub.push('brush', brushChannel.dc1);
        this.pubSub.push('chat', chatChannel.dc1);
    }

    handleAnswer(guest) {
        const rtc = this.guests[guest.id];
        if (!rtc) alert('guest Id doesnt exist');
        rtc.setAnswer(guest.answer);
    }

    getChannel(channel_name) {
        return this.channels[channel_name];
    }

}

export class Guest {

    signal;

    rtc;

    channels = {};

    constructor(lobbyKey, onConnection) {
        this.signal = new Signal(USER_TYPE.GUEST, lobbyKey);
        this.onConnection = onConnection;
        this.rtc = new RTC(USER_TYPE.GUEST, (answer, id) => {
            this.signal.send('answer', answer);
        }, (channel) => { this.onChannel(channel); });
        this.signal.onMessage((message) => { this.incomingMessage(message) });
    }

    onChannel(channel) {
        console.log({ channel });
        this.channels[channel.label] = channel;
        // channel.onmessage = message => console.log({ channel: message.currentTarget.label, message: message.data });
        if (Object.keys(this.channels).length >= 4) {
            this.onConnection()
        }
    }

    incomingMessage(message) {
        switch (message.type) {
            case MESSAGE_TYPE.OFFER:
                this.handleOffer(message.host)
                break;
            default:
                console.log('invalid message Type', message);
        }
    }

    send() {
        var channel = prompt("Please enter your channel:", "meta");
        var message = prompt("What is ur message:", "my test message");

        this.channels[channel].send(message);
    }

    handleOffer(host) {
        this.rtc.setOffer(host.offer);
    }

    getChannel(channel_name) {
        return this.channels[channel_name];
    }
}