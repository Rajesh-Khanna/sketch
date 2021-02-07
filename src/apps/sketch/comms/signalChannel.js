class signalChannel {
    constructor(host = true) {
        this.ReadICEId = host ? '#guestInfo' : '#hostCred';
        this.ShowICEId = host ? '#myCred' : '#guestCred';
    }

    onMessage(callBack) {
        document.querySelectorAll('.submit').forEach(element => {
            element.addEventListener('click', () => {
                const connectLink = document.querySelector(this.ReadICEId).value;
                callBack(JSON.parse(connectLink));
            });
        });
    }

    send(message) {
        console.log({ message });
        // const myLink = document.querySelector(this.ShowICEId);
        // myLink.innerHTML = JSON.stringify(message);
    }
}

export default signalChannel;