import React from 'react'
import { useState } from 'react';

const TextChat = () => {

    const [textToSend, setTextToSend] = useState('');

    const handleSendData = () => {
        const textArea = document.getElementById('dataChannelSend');
        const textToSend = textArea.value;
        setTextToSend(textToSend);
    };
    return (
        <div id="container" >

            <h1><a href="//webrtc.github.io/samples/" title="WebRTC samples homepage">WebRTC samples</a>
                <span>Transmit text</span></h1>

            <div id="buttons">
                <button id="sendButton" onClick={handleSendData}>Send</button>
            </div>

            <div id="sendReceive" style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
                <div id="send">
                    <h2 >Send</h2>
                    <textarea id="dataChannelSend"
                        placeholder="Press Start, enter some text, then press Send."></textarea>
                </div>
                <div id="receive">
                    <h2>Receive</h2>
                    <div id="dataChannelReceive" style={{ height: "300px", width: "500px", backgroundColor: 'lightcoral' }}>
                        {textToSend}
                    </div>
                </div>
            </div>


        </div>

    )
}

export default TextChat