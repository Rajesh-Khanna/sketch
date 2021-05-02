import { USER_TYPE } from "../constants";

export default class RTC {

    rtc;

    localDescription;

    constructor(userType, onIce, onChannel, guestId) {
        const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
        this.rtc = new RTCPeerConnection(configuration);

        this.rtc.onicecandidate = e => this.localDescription = JSON.stringify(this.rtc.localDescription);

        this.rtc.addEventListener("icegatheringstatechange", ev => {
            switch (this.rtc.iceGatheringState) {
                case "complete":
                    onIce(this.rtc.localDescription, guestId);
                    break;
                default:
                    console.log(this.rtc.iceGatheringState);
            }
        });

        if (userType === USER_TYPE.HOST) {
            const dataChannel = this.createChannel('channel-name');
            console.log('on open set');
            this.rtc.addEventListener('connectionstatechange', event => {
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

    async generateOffer() {
        console.log('generateOffer');
        const offer = await this.rtc.createOffer();
        await this.rtc.setLocalDescription(offer);
    }

    setAnswer(answer) {
        console.log('setAnswer');
        this.rtc.setRemoteDescription(answer);
    }

    async setOffer(offer) {
        console.log('setOffer', offer);
        await this.rtc.setRemoteDescription(offer);
        const answer = await this.rtc.createAnswer();
        this.rtc.setLocalDescription(answer);
    }
}