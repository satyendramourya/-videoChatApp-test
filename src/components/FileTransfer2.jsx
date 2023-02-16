import React, { useState, useRef } from "react";

const FileTransfer = ({ peerConnection }) => {

    const [file, setFile] = useState(null);
    const [fileTransferStatus, setFileTransferStatus] = useState("");
    const dataChannel = useRef(null);


    peerConnection.ondatachannel = (event) => {
        const dataChannel = event.channel;

        dataChannel.onopen = () => {
            console.log('Data channel is open');
        };

        dataChannel.onmessage = (event) => {
            const message = event.data;
            console.log(`Received message: ${message}`);
        };
    }

    const handleFileInputChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSendFileClick = () => {
        if (dataChannel.current?.readyState === "open") {
            setFileTransferStatus("Sending file...");
            dataChannel.current.send(file);
        } else {
            setFileTransferStatus("Error: Data channel is not open.");
        }
    };

    if (peerConnection) {
        peerConnection.ondatachannel = (event) => {
            dataChannel.current = event.channel;
            dataChannel.current.onopen = () => {
                setFileTransferStatus("Data channel is open.");
            };
            dataChannel.current.onmessage = (event) => {
                const receivedFile = event.data;
                const fileName = receivedFile.name;
                // const fileType = receivedFile.type;
                const url = URL.createObjectURL(receivedFile);
                const downloadLink = document.createElement("a");
                downloadLink.href = url;
                downloadLink.download = fileName;
                downloadLink.click();
                setFileTransferStatus(`Received file: ${fileName}`);
            };
        };
    }


    return (
        <div>
            <input type="file" onChange={handleFileInputChange} />
            <button onClick={handleSendFileClick}>Send file</button>
            <p>{fileTransferStatus}</p>
        </div>
    );
};

export default FileTransfer;

// const pc2 = new RTCPeerConnection(null);

// local peer
// const onOpenDataChannel = () => {
//     const dataChannel = pc2.createDataChannel("fileTransfer");
//     dataChannel.send("Hello, world!");

//     dataChannel.onopen = () => {
//         console.log("Data channel is open and ready to use");
//     };

//     dataChannel.onmessage = (event) => {
//         const message = event.data;
//         console.log(`Received message: ${message}`);
//     };

//     dataChannel.onerror = (error) => {
//         console.error(`Error occurred in data channel: ${error}`);
//     };
// };


// pc2.ondatachannel = (event) => {
//     const dataChannel = event.channel;

//     dataChannel.onopen = () => {
//         console.log("Data channel is open and ready to use");
//     };

//     dataChannel.onmessage = (event) => {
//         const message = event.data;
//         console.log(`Received message: ${message}`);
//     };

//     dataChannel.onerror = (error) => {
//         console.error(`Error occurred in data channel: ${error}`);
//     };
// };

// const sendToPeer2 = (eventType, payload) => {
//     socket.emit(eventType, payload);
//     if (eventType === "file") {
//         socket.emit("file", payload.file);
//     } else {
//         socket.emit(eventType, payload);
//     }
// };