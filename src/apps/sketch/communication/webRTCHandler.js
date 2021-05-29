import { USER_TYPE, CONFIGURATION } from "../constants";

export default class RTC {

    onIce;

    guestId;

    rtc;

    localDescription;

    constructor(userType, onIce, onChannel, onCandidate, guestId) {
        this.onIce = onIce;
        this.guestId = guestId;

        this.rtc = new RTCPeerConnection(CONFIGURATION);

        this.rtc.addEventListener("icecandidate", event => {
            if (event.candidate) {
                console.log(event.candidate);
                // send candidate
                onCandidate(event.candidate, guestId);
            }
        });

        if (userType === USER_TYPE.HOST) {
            const dataChannel = this.createChannel('channel-name');
            console.log('on open set');
            this.rtc.addEventListener('connectionstatechange', event => {
                console.log(this.rtc.connectionState, event);
                if (this.rtc.connectionState === 'connected') {
                    console.log('connection established');
                    onChannel();
                } else {}
            });

            dataChannel.onopen = (e) => { console.log('onOpen call'); };
        } else {
            this.rtc.ondatachannel = e => {
                window.dataChannel = e.channel;
                console.log({ channel: e });
                onChannel(e.channel);
                // window.dataChannel.onmessage = e => console.log('Recieved message: ', e.data);
                window.dataChannel.onopen = e => console.log('channel open', e);
            }
        }
    }

    createChannel(channelName) {
        const dataChannel = this.rtc.createDataChannel(channelName);
        return dataChannel;
    }

    async sendOffer() {
        console.log('generateOffer');
        const offer = await this.rtc.createOffer();
        this.onIce(offer,this.guestId);
        await this.rtc.setLocalDescription(offer);
    }

    setAnswer(answer) {
        console.log('setAnswer');
        console.log(JSON.stringify(answer));
        this.rtc.setRemoteDescription(answer);
    }

    async setAndSendOffer(offer) {
        console.log('setOffer', offer);
        console.log(JSON.stringify(offer));
        await this.rtc.setRemoteDescription(offer);
        const answer = await this.rtc.createAnswer();
        this.onIce(answer,this.guestId);
        console.log(JSON.stringify(answer));
        this.rtc.setLocalDescription(answer);
    }

    async storeCandidate(candidate) {
        console.log('candidate:', candidate);
        await this.rtc.addIceCandidate(candidate);
    }
}