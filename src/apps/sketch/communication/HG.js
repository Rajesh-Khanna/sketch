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

    req_channels = [];

    constructor(onLobbyKey, firebaseConfig, req_channels, activityManager) {
        this.req_channels = req_channels;
        this.pubSub = new PubSub(activityManager, firebaseConfig, req_channels, null, onLobbyKey);
        this.simulatedChannels();
    }

    simulatedChannels() {
        this.req_channels.forEach(channel => {
            const currChannel = new ChannelSim(channel.name);
            this.channels[channel.name] = currChannel.intakeChannel;
            this.pubSub.push(channel.name, currChannel.dc1);
        });
    }

    getChannel(channel_name) {
        return this.channels[channel_name];
    }

}

export class Guest {

    signal;

    rtc;

    channels = {};

    req_channels = [];

    constructor(lobbyKey, firebaseConfig, req_channels, onConnection) {
        this.signal = new Signal(USER_TYPE.GUEST, firebaseConfig, lobbyKey);
        this.req_channels = req_channels;
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
        if (Object.keys(this.channels).length >= Object.values(this.req_channels).length) {
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