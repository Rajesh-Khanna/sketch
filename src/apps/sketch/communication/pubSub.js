export default class PubSub {

    channels = {};

    constructor() {
        this.channels = {};
    }

    push(channel_name, dataChannel) {
        if (channel_name in this.channels) {
            this.channels[channel_name].push(dataChannel);
        } else {
            this.channels[channel_name] = [dataChannel, ];
        }
        dataChannel.onmessage = (message) => { this.publish(message) };
    }

    publish(message) {
        console.log({ message });
        console.log({ channel: message.currentTarget.label, message: message.data });
        const channel = message.currentTarget.label;
        this.channels[channel].forEach(line => {
            console.log({ line })
            line.send(message.data);
        });
    }
}