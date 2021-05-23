import { USER_TYPE } from "../constants";

export default class RTC {

    onIce;

    guestId;

    rtc;

    localDescription;

    constructor(userType, onIce, onChannel, onCandidate, guestId) {
        this.onIce = onIce;
        this.guestId = guestId;

        const configuration = {
            'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' },
                { 'url': 'stun:stun1.l.google.com:19302' },
                { 'url': 'stun:stun2.l.google.com:19302' },
                { 'url': 'stun:stun3.l.google.com:19302' },
                { 'url': 'stun:stun4.l.google.com:19302' },
            ]
        }
        this.rtc = new RTCPeerConnection(configuration);

        // this.rtc.addEventListener("icegatheringstatechange", ev => {
        //     console.log(this.rtc.iceGatheringState, ev);
        //     switch (this.rtc.iceGatheringState) {
        //         case "complete":
        //             onIce(this.rtc.localDescription, guestId);
        //             break;
        //         default:
        //             console.log(this.rtc.iceGatheringState);
        //     }
        // });

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