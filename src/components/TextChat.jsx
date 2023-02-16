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
    // return (
    //     <section style={{ display: "grid", justifyContent: "end", alignContent: "end" }}>
    // <div>
    //     <p>Sent Message:</p>
    //     {sendMessageTo && sendMessageTo.length > 0 ? (
    //         sendMessageTo.map((mess, index) => <p key={index}>{mess}</p>)
    //     ) : (
    //         <p>No Sent Messages yet.</p>
    //     )}
    // </div>


    //         <div>
    //             <p>Received message:</p>
    //             {receivedMessage && receivedMessage.length > 0 ? (
    //                 receivedMessage.map((mess, index) => <p key={index}> {mess}</p>)
    //             ) : (
    //                 <p>No Received Messages yet.</p>
    //             )}
    //         </div>
    //         <div>
    //             <input
    //                 type="text"
    //                 placeholder="message ... "
    //                 value={message}
    //                 onChange={(e) => setMessage(e.target.value)}
    //             />
    //             <button onClick={sendMessage}>Send</button>
    //         </div>
    //     </section>
    // )

    return (
        <section
            style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "1fr 50px",
                height: "95vh",
            }}>
            <div style={{
                display: "flex",
                flexDirection: "column-reverse",
                overflowY: "auto",
                padding: "10px",
            }}>

                {sendMessageTo && sendMessageTo.length > 0 ? (
                    sendMessageTo.map((mess, index) => (
                        <div key={index} style={{ alignSelf: "start", marginLeft: "10px", padding: "10px", backgroundColor: "whitesmoke", borderRadius: "10px", maxWidth: "80%" }}>
                            <p style={{ margin: "0", whiteSpace: "pre-wrap" }}>{mess}</p>
                        </div>
                    ))
                ) : (
                    <p>No Sent Messages yet.</p>
                )}

                <p style={{ alignSelf: "start", marginLeft: "10px", color: "grey" }}>Sent Messages:</p>



                {receivedMessage && receivedMessage.length > 0 ? (
                    receivedMessage.map((mess, index) => (
                        <div key={index} style={{ alignSelf: "start", marginRight: "10px", padding: "10px", backgroundColor: "whitesmoke", borderRadius: "10px", maxWidth: "80%", display: "flex", justifyContent: "end" }}>
                            <p style={{ margin: "0", whiteSpace: "pre-wrap" }}>{mess}</p>
                        </div>
                    ))
                ) : (
                    <p style={{ display: "flex", justifyContent: "end" }}>No Received Messages yet.</p>
                )}
                <p style={{ alignSelf: "start", marginLeft: "10px", color: "grey" }}>Received Messages:</p>
            </div>
            <div style={{
                display: "flex",
                alignItems: "center",
                padding: "0 10px",
            }}>
                <input
                    type="text"
                    placeholder="message ... "
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                        flex: "1",
                        marginRight: "10px",
                        padding: "10px",
                        borderRadius: "20px",
                        border: "none",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    }}
                />
                <button onClick={sendMessage} style={{
                    padding: "10px 20px",
                    backgroundColor: "blue",
                    color: "white",
                    borderRadius: "20px",
                    border: "none",
                    cursor: "pointer",
                }}>Send</button>
            </div>
        </section>
    );


}

export default TextChat