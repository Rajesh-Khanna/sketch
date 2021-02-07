export class sketchChannelHandler {
    channel = null;
    channelOpen = false;
    constructor(messageHandler) {
        this.messageHandler = messageHandler;
    }

    setChannel(channel) {
        this.channel = channel;
        channel.onopen = (msg => {
            this.channelOpen = true;
            console.log('open channel');
            document.querySelector('#HOSTPanel').style.display = 'none';
            document.querySelector('#GUESTPanel').style.display = 'none';
            document.querySelector('#distDrawBoard').style.display = 'block';
        })
        channel.onmessage = (this.messageHandler)
    }

    sendMessage = (message) => {
        console.log('send');
        if (message && this.channelOpen) {
            this.channel.send(message);
        };
    }

    pushShape = async(copyObj) => {
        const props = copyObj.clone();
        this.sendMessage(JSON.stringify(props));
    }
}

export class messageChannelHandler {
    channel = null;
    channelOpen = false;

    constructor(messageHandler) {
        this.messageHandler = messageHandler;
    }

    sendMessage(message) {
        if (message && this.channel) {
            this.channel.send(message);
            return true;
        };
        return false;
    }

    setChannel(channel) {
        this.channel = channel;
        channel.onopen = (msg => {
            this.channelOpen = true;

        })
        channel.onmessage = (this.messageHandler)

    }

}