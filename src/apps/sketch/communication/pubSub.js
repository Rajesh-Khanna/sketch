import { getChannel } from "../utils";

export default class PubSub {

    channels = {};

    constructor(activityManager) {
        this.channels = {};
        this.activityManager = activityManager;
        this.activityManager.publish = (message, channel) => { this.publish(message, channel) };
    }

    push(channel_name, dataChannel) {
        if (channel_name in this.channels) {
            this.channels[channel_name].push(dataChannel);
        } else {
            this.channels[channel_name] = [dataChannel, ];
        }
        dataChannel.onmessage = (message) => { this.activityManager.handle(message) };
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
}