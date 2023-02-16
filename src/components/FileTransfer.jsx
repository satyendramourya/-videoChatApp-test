

import React, { useState } from "react";

const FileTransfer = ({ peerConnection, dataChannel }) => {

    const [file, setFile] = useState(null);
    const [fileTransferStatus, setFileTransferStatus] = useState("");

    // peerConnection.ondatachannel = (event) => {
    //     dataChannel.onopen = () => {
    //         console.log('Data channel is open');
    //     };

    //     dataChannel.onmessage = (event) => {
    //         const message = event.data;
    //         console.log(`Received message: ${message}`);
    //     };
    // }

    const handleFileInputChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSendFileClick = () => {
        if (dataChannel.readyState === "open") {
            setFileTransferStatus(dataChannel.readyState);
            dataChannel.current.send(file);
        } else {
            setFileTransferStatus("Error: Data channel is not open.");
        }
    };

    // if (peerConnection) {
    //     peerConnection.ondatachannel = (event) => {
    //         dataChannel.current = event.channel;
    //         dataChannel.current.onopen = () => {
    //             setFileTransferStatus("Data channel is open.");
    //         };
    //         dataChannel.current.onmessage = (event) => {
    //             const receivedFile = event.data;
    //             const fileName = receivedFile.name;
    //             // const fileType = receivedFile.type;
    //             const url = URL.createObjectURL(receivedFile);
    //             const downloadLink = document.createElement("a");
    //             downloadLink.href = url;
    //             downloadLink.download = fileName;
    //             downloadLink.click();
    //             setFileTransferStatus(`Received file: ${fileName}`);
    //         };
    //     };
    // }


    return (<>

        <div >
            <h1>File Transfer</h1>
            <input type="file" onChange={handleFileInputChange} />
            <button onClick={handleSendFileClick}>Send file</button>
            <p>{fileTransferStatus}</p>
        </div>
    </>
    );
};

export default FileTransfer;