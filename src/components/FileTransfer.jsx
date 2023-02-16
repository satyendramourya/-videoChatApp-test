

import React, { useState } from "react";

const FileTransfer = ({ pc, dc }) => {

    // const [file, setFile] = useState(null);
    // const [fileTransferStatus, setFileTransferStatus] = useState("");
    // const [receivedFile, setReceivedFile] = useState(null);

    // const handleFileInputChange = (event) => {
    //     setFile(event.target.files[0]);
    // };

    // const handleSendFileClick = () => {
    //     if (dc.current.readyState === "open") {
    //         setFileTransferStatus(dc.readyState);
    //         dc.current.send(file);
    //     } else {
    //         setFileTransferStatus("Error: Data channel is not open.");
    //     }
    // };


    // const handleDataChannel = (event) => {
    //     const remoteDc = event.channel;
    //     remoteDc.onopen = () => {
    //         setFileTransferStatus("Data channel is open.");
    //     };
    //     remoteDc.onmessage = (event) => {
    //         const receivedFile = event.data;
    //         const fileName = receivedFile.name;
    //         const fileType = receivedFile.type;
    //         const url = URL.createObjectURL(receivedFile);
    //         const downloadLink = document.createElement("a");
    //         downloadLink.href = url;
    //         downloadLink.download = fileName;
    //         downloadLink.click();
    //         setFileTransferStatus(`Received file: ${fileName}`);
    //     };
    // };


    // pc.current.ondatachannel = handleDataChannel;
    return (<>

        <section
            style={{

                backgroundColor: "lightblue",
            }}>
            <div >
                <form id="fileInfo">
                    <input type="file" id="fileInput" name="files" />
                </form>
                <button id="sendFile">Send</button>
                <button id="abortButton">Abort</button>
            </div>

            <div className="progress">
                <div className="label">Send progress: </div>
                <progress id="sendProgress" max="0" value="0"></progress>
            </div>

            <div className="progress">
                <div className="label">Receive progress: </div>
                <progress id="receiveProgress" max="0" value="0"></progress>
            </div>

            <div id="bitrate"></div>
            <p> download link</p>
            <span id="status"></span>

        </section>
    </>
    );
};

export default FileTransfer;