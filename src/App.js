import { useRef, useEffect, useState } from "react";
import FileTransfer from "./components/FileTransfer";

import io from "socket.io-client";
const socket = io("/webRTCPeers", {
  path: "/webrtc",
});

function App() {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const textRef = useRef();
  const dc = useRef();
  const pc = useRef(new RTCPeerConnection(null));

  const [offerVisible, setOfferVisible] = useState(true);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [status, setStatus] = useState("Make a call now");
  const [message, setMessage] = useState("");
  const [sendMessageTo, setSendMessageTo] = useState([]);
  const [receivedMessage, setReceivedMessage] = useState();

  // const peerConnection = new RTCPeerConnection();
  // const dc = peerConnection.createDataChannel("my channel");

  useEffect(() => {
    socket.on("connection-success", (success) => {
      console.log(success);
    });

    socket.on("sdp", (data) => {
      console.log(data);
      pc.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
      textRef.current.value = JSON.stringify(data.sdp);

      if (data.sdp.type === "offer") {
        setOfferVisible(false);
        setAnswerVisible(true);
        setStatus("Incoming call ....");
      } else {
        setStatus("call established");
      }
    });

    socket.on("candidate", (candidate) => {
      console.log(candidate);
      // candidates.current = [ ...candidates.current,candidate]
      pc.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    const constraints = {
      audio: true,
      video: true,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        localVideoRef.current.srcObject = stream;

        stream.getTracks().forEach((track) => {
          _pc.addTrack(track, stream);
        });
      })
      .catch((e) => {
        console.log("getUserMedia error ....", e);
      });

    const _pc = new RTCPeerConnection(null);
    _pc.onicecandidate = (e) => {
      if (e.candidate) console.log(JSON.stringify(e.candidate));
    };

    _pc.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };
    _pc.oniceconnectionstatechange = (e) => {
      console.log(e);
    };
    pc.current = _pc;
    dc.current = pc.current.createDataChannel("my channel");
  }, []);

  const sendToPeer = (eventType, payload) => {
    socket.emit(eventType, payload);
  };

  const processSDP = (sdp) => {
    console.log(JSON.stringify(sdp));
    pc.current.setLocalDescription(sdp);
    sendToPeer("sdp", { sdp });
  };

  const createOffer = () => {
    pc.current
      .createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVedio: 1,
      })
      .then((sdp) => {
        console.log(JSON.stringify(sdp));
        pc.current.setLocalDescription(sdp);

        //send the ans to the offering peer
        processSDP(sdp);
        setOfferVisible(false);
        setStatus("Calling....");
      })
      .catch((e) => console.log(e));
  };

  const createAnswer = () => {
    pc.current
      .createAnswer({
        offerToReceiveAudio: 1,
        offerToReceiveVedio: 1,
      })
      .then((sdp) => {
        console.log(JSON.stringify(sdp));
        pc.current.setLocalDescription(sdp);

        //send the ans to the offering peer
        processSDP(sdp);
        setAnswerVisible(false);
        setStatus("setRemoteDescription answered");
      })
      .catch((e) => console.log(e));
  };

  const setRemoteDescription = () => {
    const desc = JSON.parse(textRef.current.value);
    console.log(desc);
    if (desc.type === "offer") {
      setStatus("offer accepted");
      console.log("offer  accepted");
    } else {
      setStatus("answer accepted");
      console.log("answer accepted");
    }
    pc.current.setRemoteDescription(new RTCSessionDescription(desc));
    setStatus("setRemoteDescription seted");
  };

  const addCandidates = () => {
    const candidates = JSON.parse(textRef.current.value);
    // candidates.forEach((candidate) => {
    //   pc.current.addIceCandidate(new RTCIceCandidate(candidate));
    // console.log(`Adding Candidate...`, candidates);
    pc.current.addIceCandidate(new RTCIceCandidate(candidates));
    setStatus("candidate added");
  };

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
    <>
      <div style={{ margin: 10 }}>
        <video
          style={{
            width: 500,
            height: 400,
            margin: 5,
            backgroundColor: "black",
          }}
          ref={localVideoRef}
          autoPlay
        ></video>

        <video
          style={{
            width: 500,
            height: 400,
            margin: 5,
            backgroundColor: "black",
          }}
          ref={remoteVideoRef}
          autoPlay
        ></video>
        <br />

        <button onClick={createOffer}> Create Offer </button>
        <button onClick={createAnswer}> Create Answer </button>
        <button onClick={setRemoteDescription}> Set Remote Description</button>
        <button onClick={addCandidates}> Add Candidates </button>

        <div>{status}</div>

        <textarea
          ref={textRef}
          style={{ height: "200px", width: "700px" }}
        ></textarea>
        {/* {console.log("pc.current", pc.current)}
        {console.log("pc.current", pc.current)}
        {console.log("dc", dc)} */}
        <div
          style={{
            height: "300px",
            width: "700px",
            backgroundColor: "lightblue",
          }}
        >
          <FileTransfer peerConnection={pc.current} dataChannel={dc.current} />
        </div>
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
      </div>
    </>
  );
}

export default App;
