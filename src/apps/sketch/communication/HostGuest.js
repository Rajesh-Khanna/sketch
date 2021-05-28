import PubSub from './pubSub';
import Signal from './signal';
import RTC from './webRTCHandler';

// constants
import { USER_TYPE, MESSAGE_TYPE } from '../constants';
import { ActivityManager } from './ActivityManager';

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

    activityManager;

    constructor(onLobbyKey) {
        this.activityManager = new ActivityManager();
        this.pubSub = new PubSub(this.activityManager, null, onLobbyKey);
        this.simulatedChannels();
    }

    simulatedChannels() {
        const metaChannel = new ChannelSim('meta');
        const brushChannel = new ChannelSim('brush');
        const chatChannel = new ChannelSim('chat');
        const backgroundChannel = new ChannelSim('background');

        this.channels['meta'] = metaChannel.intakeChannel;
        this.channels['brush'] = brushChannel.intakeChannel;
        this.channels['chat'] = chatChannel.intakeChannel;
        this.channels['background'] = backgroundChannel.intakeChannel;

        this.pubSub.push('meta', metaChannel.dc1);
        this.pubSub.push('brush', brushChannel.dc1);
        this.pubSub.push('chat', chatChannel.dc1);
        this.pubSub.push('background', backgroundChannel.dc1);
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
            }, (channel) => { this.onChannel(channel); },
            (candidate, guestId) => { this.signal.send('guest_candidate', candidate, guestId) }
        );
        this.signal.onCandidate((candidate) => { this.rtc.storeCandidate(candidate) });
        this.signal.onMessage((message) => { this.incomingMessage(message) });
    }

    onChannel(channel) {
        console.log({ channel });
        this.channels[channel.label] = channel;
        console.log(Object.keys(this.channels).length);
        if (Object.keys(this.channels).length >= 5) {
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
        this.rtc.setAndSendOffer(host.offer);
    }

    getChannel(channel_name) {
        return this.channels[channel_name];
    }

    signalEnd() {
        this.signal.end();
    }
}