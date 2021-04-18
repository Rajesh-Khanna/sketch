export default class p2pConnection {

    constructor(dataChannelListner) {
        this.dataChannelListner = dataChannelListner;
    }

    async makeCall(sc) {
        const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
        this.peerConnection = new RTCPeerConnection(configuration);
        this.peerConnection.createDataChannel('channel');
        this.peerConnection.ondatachannel = e => {
            console.log({ e });
            this.dataChannelListner(e)
        }

        sc.onMessage(async message => {
            if (message) {
                const remoteDesc = new RTCSessionDescription(message);
                await this.peerConnection.setRemoteDescription(remoteDesc);
            }
            if (message.iceCandidate) {
                try {
                    await this.peerConnection.addIceCandidate(message.iceCandidate);
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }
        });
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);

        this.peerConnection.addEventListener("icegatheringstatechange", ev => {
            switch (this.peerConnection.iceGatheringState) {
                case "complete":
                    sc.send(this.peerConnection.localDescription);
                    break;
                default:
                    console.log(this.peerConnection.iceGatheringState);
            }
        });
    }

    async receiveCall(sc) {
        const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }

        this.peerConnection = new RTCPeerConnection(configuration);

        this.peerConnection.ondatachannel = e => {
            console.log({ e });
            this.dataChannelListner(e)
        }
        sc.onMessage(async message => {
            if (message) {
                this.peerConnection.setRemoteDescription(new RTCSessionDescription(message));
                const answer = await this.peerConnection.createAnswer();
                await this.peerConnection.setLocalDescription(answer);
                this.peerConnection.addEventListener("icegatheringstatechange", ev => {
                    switch (this.peerConnection.iceGatheringState) {
                        case "complete":
                            sc.send(this.peerConnection.localDescription);
                            break;
                        default:
                            console.log(this.peerConnection.iceGatheringState);
                    }
                });
            }
        });
    }

    createDataChannel(channelName) {
        return this.peerConnection.createDataChannel(channelName);
    }
}