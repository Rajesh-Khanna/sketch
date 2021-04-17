// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <
// script src = "https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js" > < /script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
// https: //firebase.google.com/docs/web/setup#available-libraries -->
//     <
//     script src = "https://www.gstatic.com/firebasejs/8.3.2/firebase-analytics.js" > < /script>

// <
// script >
//     // Your web app's Firebase configuration
//     // For Firebase JS SDK v7.20.0 and later, measurementId is optional
//     var
//     // Initialize Firebase
//         firebase.initializeApp(firebaseConfig);
// firebase.analytics(); <
// /script>

import firebase from 'firebase';
import { USER_TYPE, LOBBY_COLLECTION } from '../constants';
import { MESSAGE_TYPE } from './../constants';

function callbackClosure(i, callback) {
    return function(x) {
        return callback(i, x);
    }
}

export default class Signal {

    userType

    name

    firebaseConfig = {
        apiKey: "AIzaSyC76AeV9WHmHfgN0dSJcMLfXOHHI09ZZDs",
        authDomain: "sketch-e5889.firebaseapp.com",
        projectId: "sketch-e5889",
        storageBucket: "sketch-e5889.appspot.com",
        messagingSenderId: "417640075335",
        appId: "1:417640075335:web:d27812bbfa1a905bcea162",
        measurementId: "G-2RWBX5QBR6"
    };

    constructor(name, lobbyKey, onLobbyKey) {
        this.name = name; // todo: name should be less then 16 char, only a-zA-Z0-9_

        if (!firebase.apps.length) {
            firebase.initializeApp(this.firebaseConfig);
        } else {
            firebase.app();
        }
        firebase.analytics();
        this.database = firebase.database();


        if (lobbyKey && lobbyKey.length) {
            this.userType = USER_TYPE.GUEST;
            this.addGuest(lobbyKey);
        } else {
            this.userType = USER_TYPE.HOST
            this.addHost(onLobbyKey);
        }
    }

    dashboard() {
        this.workSpaceRef = this.database.ref(`${LOBBY_COLLECTION}`);
        this.workSpaceRef.on('value', (val) => {
            console.log({ val: val.val() });
        });
    }

    onMessage(callBack) {
        console.log('onMessage callback set');
        if (this.userType === USER_TYPE.GUEST) {
            this.workSpaceRef.child('offer').on('value', (snapShot) => {
                console.log('offer recived', snapShot);
                console.log({ offer: snapShot.val() });
                if (snapShot.val())
                    callBack({ type: MESSAGE_TYPE.OFFER, host: { offer: snapShot.val() } })
            });
        }
        if (this.userType === USER_TYPE.HOST) {
            // ADD_GUEST
            this.workSpaceRef.child('guests').on('child_added', (guestObj) => {
                console.log(guestObj);
                const guestKey = guestObj.key;
                console.log({ guestKey });
                callBack({ type: MESSAGE_TYPE.GUEST, guestId: guestKey });

                // ON_ANSWER
                this.workSpaceRef.child(`guests/${guestKey}/answer`).on('value', callbackClosure(guestKey,
                    (k, answer) => {
                        console.log({ answer, guestKey: k })
                        if (answer.val())
                            callBack({ type: MESSAGE_TYPE.ANSWER, guest: { id: k, answer: answer.val() } });
                    }));
            });
        }
    }

    send(key, value, path) {
        console.log('send', key, value, path);
        if (path) {
            this.workSpaceRef.child(`guests/${path}`).update({
                [key]: value
            })
        } else {
            console.log({ workSpaceRef: this.workSpaceRef })
            this.workSpaceRef.update({
                [key]: value
            });
        }
    }

    addHost(onLobbyKey) {
        /**
         * Push a new host obj to db
         */

        console.log('starting host');

        const currentDate = new Date();

        const hostObj = {
            name: `${this.name}-host`,
            lastActivityAt: currentDate.getTime(),
        }

        const ref = this.database.ref(LOBBY_COLLECTION);
        const lobbyKey = ref.push(hostObj).getKey();
        console.log({ lobbyKey });
        onLobbyKey(lobbyKey);
        this.workSpaceRef = this.database.ref(`${LOBBY_COLLECTION}/${lobbyKey}`);
        ref.off();
        // this.onMessage((v) => { console.log({ v }) });
    }

    addGuest(lobbyKey) {
        /**
         * Add a guest object in Host
         */
        console.log('starting guest');

        const guestObj = {
            name: this.name,
        }

        console.log({ lobbyKey });

        const ref = this.database.ref(`${LOBBY_COLLECTION}/${lobbyKey}/guests`);
        this.workSpaceRef = ref.push();
        this.workSpaceRef.set(guestObj);
        ref.off();
        console.log({ workSpaceRef: this.workSpaceRef });
        // this.onMessage((v) => { console.log({ v }) });
    }
}