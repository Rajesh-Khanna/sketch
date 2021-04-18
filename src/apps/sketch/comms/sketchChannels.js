// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="https://www.gstatic.com/firebasejs/8.2.7/firebase-analytics.js"></script>

// <script>
//   // Your web app's Firebase configuration
//   // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Initialize Firebase
// </script>
import { firebase } from 'firebase';

/* --------------- p2p ----------------- */
import p2pConnection from './p2p';
import signalChannel from './signalChannel';

const firebaseConfig = {
    apiKey: "AIzaSyBSSVfpoewXWTfHNHbep672GOXNWszZ9vE",
    authDomain: "sketch-d2911.firebaseapp.com",
    databaseURL: "https://sketch-d2911-default-rtdb.firebaseio.com",
    projectId: "sketch-d2911",
    storageBucket: "sketch-d2911.appspot.com",
    messagingSenderId: "10217989188",
    appId: "1:10217989188:web:470c6180426833d5cd8811",
    measurementId: "G-BEQS83D2SD"
};

class sketchSync {
    constructor(sendDrawing, sendMessage, onDrawing, onMessage) {
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();

        this.sc = new signalChannel();

        this.sendDrawing = sendDrawing;
        this.sendMessage = sendMessage;
        this.onDrawing = onDrawing;
        this.onMessage = onMessage;
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

    bridge = (channel, ) => {

    }

    addGuests(guestConnection) {}

    startHOST = () => {
        console.log('starting host');
        // document.querySelector('#choice').style.display = 'none';
        // document.querySelector('#HOSTPanel').style.display = 'block';
        this.sc.onGuest(this.addGuests);
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