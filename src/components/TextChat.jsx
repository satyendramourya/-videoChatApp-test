import React from 'react'

const TextChat = () => {
    return (
        <div id="container" >

            <h1><a href="//webrtc.github.io/samples/" title="WebRTC samples homepage">WebRTC samples</a>
                <span>Transmit text</span></h1>

            <div id="buttons">
                <button id="startButton">Start</button>
                <button id="sendButton" disabled>Send</button>
                <button id="closeButton" disabled>Stop</button>
            </div>

            <div id="sendReceive" style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
                <div id="send">
                    <h2>Send</h2>
                    <textarea id="dataChannelSend" disabled
                        placeholder="Press Start, enter some text, then press Send."></textarea>
                </div>
                <div id="receive">
                    <h2>Receive</h2>
                    <textarea id="dataChannelReceive" disabled></textarea>
                </div>
            </div>


        </div>

    )
}

export default TextChat