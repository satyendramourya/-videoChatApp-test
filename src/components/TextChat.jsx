
import React, { useState } from 'react';
import "../styles/textChat.css";

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
        <section
            style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "1fr 50px",
                height: "95vh",
            }}>
            <div className='message-box'>

                {sendMessageTo && sendMessageTo.length > 0 ? (
                    sendMessageTo.map((mess, index) => (
                        <div key={index}
                            className='sent-bubble'
                        >
                            <p className='message-text'>{mess}</p>
                        </div>
                    ))
                ) : (
                    <p>No Sent Messages yet.</p>
                )}

                <p className='message-title'>Sent Messages:</p>



                {receivedMessage && receivedMessage.length > 0 ? (
                    receivedMessage.map((mess, index) => (
                        <div key={index}
                            className='received-bubble'
                        >
                            <p className='message-text'>{mess}</p>
                        </div>
                    ))
                ) : (
                    <p className='received-bubble'>No Received Messages yet.</p>
                )}
                <p className='message-title'>Received Messages:</p>
            </div>
            <div className='input-container'>
                <input
                    type="text"
                    placeholder="message ... "
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="message-input"
                />
                <button onClick={sendMessage} className='send-button'>Send</button>
            </div>
        </section>
    );


}

export default TextChat