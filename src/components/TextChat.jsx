import React from 'react'
import { useState } from 'react';

const TextChat = ({ pc, dc }) => {

    const [message, setMessage] = useState("");
    const [sendMessageTo, setSendMessageTo] = useState([]);
    const [receivedMessage, setReceivedMessage] = useState();

    const handleDataChannel = (event) => {
        const remoteDc = event.channel;

        remoteDc.onopen = () => {
            console.log("Data channel is open");
        };

        remoteDc.onmessage = (e) => {
            console.log(`Received message: ${e.data}`);
            setReceivedMessage((prevMessages) => [...(prevMessages || []), e.data]);
            // setReceivedMessage(e.data);
        };

        remoteDc.onclose = () => {
            console.log("Data channel is closed");
        };
    };

    const sendMessage = () => {
        setSendMessageTo((prevMessages) => [...prevMessages, message]);
        dc.current.send(message);
        console.log(`Sent message: ${message}`);
        // clear the message input after sending
    };

    pc.current.ondatachannel = handleDataChannel;
    return (
        <div
            style={{
                height: "300px",
                width: "700px",
            }}
        >
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>

            {/* <p>Sent message: {sendMessageTo.map((mess)={})}</p> */}
            <div>
                <p>Sent Message:</p>
                {sendMessageTo && sendMessageTo.length > 0 ? (
                    sendMessageTo.map((mess, index) => <p key={index}>{mess}</p>)
                ) : (
                    <p>No Sent Messages yet.</p>
                )}
            </div>
            {/* <p>Received message: {receivedMessage}</p> */}

            <div>
                <p>Received message:</p>
                {receivedMessage && receivedMessage.length > 0 ? (
                    receivedMessage.map((mess, index) => <p key={index}> {mess}</p>)
                ) : (
                    <p>No Received Messages yet.</p>
                )}
            </div>
        </div>

    )
}

export default TextChat