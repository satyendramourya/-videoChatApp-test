import { useRef, useEffect, useState } from "react";
import FileTransfer from "./components/FileTransfer";
import "./styles/app.css";

import io from "socket.io-client";
import TextChat from "./components/TextChat";
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
  const codeToSend = useRef("NULL");

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
    pc.current.addIceCandidate(new RTCIceCandidate(candidates));
    setStatus("candidate added");
  };

  return (
    <section className="container">
      <div className="grid-container">
        <div>
          <div>
            <video className="local-video" ref={localVideoRef} autoPlay></video>
          </div>

          <div className="connection-area">
            <textarea ref={textRef} className="text-area"></textarea>
            <div className="button-container">
              <button onClick={createOffer}>Create Offer</button>
              <button onClick={createAnswer}>Create Answer</button>
              <button
                style={{
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  marginLeft: "8px",
                  marginRight: "12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={setRemoteDescription}
              >
                Set Remote Description
              </button>
              <button className="green" onClick={addCandidates}>
                Add Candidates
              </button>
            </div>

            <textarea style={{ height: "100px" }} disabled>
              {codeToSend.current}
            </textarea>
            <button className="green" onClick={"sendText"}>
              copy
            </button>
          </div>
        </div>

        <div>
          <video className="remote-video" ref={remoteVideoRef} autoPlay></video>
          <FileTransfer className="file-transfer-container" pc={pc} dc={dc} />
        </div>
        <div className="text-chat-container">
          <TextChat pc={pc} dc={dc} />
        </div>
      </div>
    </section>
  );
}

export default App;
