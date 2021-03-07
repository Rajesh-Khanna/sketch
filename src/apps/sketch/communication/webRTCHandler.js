export class RTC {

    rtc;

    constructor() {
        const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
        this.rtc = RTCPeerConnection(configuration);


    }

    getOffer() {

    }

}