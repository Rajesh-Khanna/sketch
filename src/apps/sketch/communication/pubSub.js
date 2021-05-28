import { getChannel } from "../utils";
import { MESSAGE_TYPE, USER_TYPE } from './../constants';
import RTC from './webRTCHandler';
import Signal from './signal';

export default class PubSub {

    channels = {};

    bridgeChannels = [];

    guests = {};

    req_channels = [];

    constructor(activityManager, req_channels, bridgeChannels, onLobbyKey) {

        this.signal = new Signal('host', null, onLobbyKey);
        this.signal.onMessage((message) => { this.incomingMessage(message) });
        this.req_channels = req_channels;
        this.channels = (req_channels || []).reduce((acc, curr) => { return {...acc, [curr.name]: [] } }, {});
        this.bridgeChannels = bridgeChannels || [];
        this.activityManager = activityManager;
        this.activityManager.publish = (message, channel) => { this.publish(message, channel) };
    }

    push(channel_name, dataChannel) {
        if (channel_name in this.channels) {
            this.channels[channel_name].push(dataChannel);
        } else {
            this.channels[channel_name] = [dataChannel, ];
        }

        if (channel_name in this.bridgeChannels) {
            dataChannel.onmessage = (message) => { this.publish(message) };
        } else {
            dataChannel.onmessage = (message) => { this.activityManager.handle(message) };
        }
        if (channel_name === 'meta')
            dataChannel.onclose = (e) => { this.activityManager.checkHeartBeat() }
    }

    publish(message, channel) {
        if (!channel) channel = getChannel(message);
        this.channels[channel].forEach(line => {
            if (line.readyState === 'open')
                line.send(message.data);
            else
                console.log('channel closed:', line);
        });
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
            (e) => {
                console.log('on channel open set');
                this.createChannels(id)
            },
            (candidate, guestId) => { this.signal.send('host_candidate', candidate, guestId) },
            id
        );
        this.signal.onCandidate((candidate) => { rtc.storeCandidate(candidate) }, id);
        rtc.sendOffer();
        this.guests[id] = rtc;
    }

    createChannels(id) {
        console.log('creating channel');
        this.req_channels.forEach(channel => {
            this.push(channel.name, this.guests[id].createChannel(channel.name));
        })
    }

    handleAnswer(guest) {
        const rtc = this.guests[guest.id];
        if (!rtc) alert('guest Id doesnt exist');
        rtc.setAnswer(guest.answer);
    }

    signalEnd() {
        this.signal.end();
    }

}