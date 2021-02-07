/* --------------- p2p ----------------- */
import p2pConnection from './p2p';

class sketchSync {
    constructor(sketchChannel, messageChannel) {
        this.sketchChannel = sketchChannel;
        this.messageChannel = messageChannel;
    }

    dataChannelListner = (channelEvent) => {
        console.log('dataChannelListner');
        if (channelEvent.channel.label === 'messageChannel') {
            console.log({ channelEvent });
            this.messageChannel.setChannel(channelEvent.channel);
        }
        if (channelEvent.channel.label === 'sketchChannel') {
            console.log({ channelEvent });
            this.sketchChannel.setChannel(channelEvent.channel);
        }
    }

    startHOST = () => {
        console.log('starting host');
        // document.querySelector('#choice').style.display = 'none';
        // document.querySelector('#HOSTPanel').style.display = 'block';
        const p2p = new p2pConnection(this.dataChannelListner);
        p2p.makeCall();
        this.sketchChannel.setChannel(p2p.createDataChannel('sketchChannel'));
        this.messageChannel.setChannel(p2p.createDataChannel('messageChannel'));
    };

    startGUEST = () => {
        console.log('starting guest');
        // document.querySelector('#choice').style.display = 'none';
        // document.querySelector('#GUESTPanel').style.display = 'block';
        const p2p = new p2pConnection(this.dataChannelListner);
        p2p.receiveCall();
    };

}

export default sketchSync;