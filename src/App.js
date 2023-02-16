import { useRef, useEffect, useState } from "react";
import FileTransfer from "./components/FileTransfer";

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
    pc.current.addIceCandidate(new RTCIceCandidate(candidates));
    setStatus("candidate added");
  };

  return (
    // <div
    //   style={{
    //     display: "grid",
    //     gridTemplateColumns: "1fr 2fr 1fr", // Divide the width into three equal parts
    //     gridTemplateRows: "1fr 3fr", // Divide the height into two parts
    //     gridTemplateAreas: `
    //         "local-video  remote-video text-chat"
    //   "connection-area remote-video  file-transfer"
    // `,
    //     height: "100vh", // Set the height of the grid to the full viewport height
    //   }}
    // >
    //   <div style={{ gridArea: "local-video" }}>
    //     <video
    //       style={{
    //         backgroundColor: "black",
    //       }}
    //       ref={localVideoRef}
    //       autoPlay
    //     ></video>
    //   </div>

    //   <div style={{ gridArea: "connection-area" }}>
    //     <div style={{}}>
    //       <button onClick={createOffer}> Create Offer </button>
    //       <button onClick={createAnswer}> Create Answer </button>
    //       <button onClick={setRemoteDescription}>Set Remote Description</button>
    //       <button onClick={addCandidates}> Add Candidates </button>
    //     </div>
    //     <textarea ref={textRef} style={{ height: "200px" }}></textarea>
    //   </div>

    //   <div style={{ gridArea: "remote-video" }}>
    //     <video
    //       style={{
    //         backgroundColor: "black",
    //       }}
    //       ref={remoteVideoRef}
    //       autoPlay
    //     ></video>
    //   </div>

    //   {/* <div>{status}</div>

    //   {console.log("dc.current", dc.current)}
    //   {console.log("pc.current", pc.current)} */}
    //   <div style={{ gridArea: "part-3" }}>
    //     <TextChat style={{ gridArea: "text-chat" }} pc={pc} dc={dc} />
    //     <FileTransfer style={{ gridArea: "file-transfer" }} pc={pc} dc={dc} />
    //   </div>
    // </div>

    <section style={{ display: "flex", margin: "2px" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",

          gridTemplateColumns: "1fr 2fr 1fr", // Divide the width into three equal parts
          gridTemplateRows: "1fr 3fr", // Divide the height into two parts
          gridTemplateAreas: `
      "local-video  remote-video text-chat "
      "connection-area  file-transfer ."
    `,
          gap: "10px",
          height: "100vh", // Set the height of the grid to the full viewport height
        }}
      >
        <div>
          <div style={{ gridArea: "local-video" }}>
            <video
              style={{
                backgroundColor: "black",
                height: "100%",
                width: "100%",
              }}
              ref={localVideoRef}
              autoPlay
            ></video>
          </div>

          <div style={{ gridArea: "connection-area", display: "grid" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr 1fr",
                gap: "10px",
                marginBottom: "8px",
              }}
            >
              <button
                style={{
                  backgroundColor: "#3452eb",
                  color: "white",
                  border: "none",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  marginLeft: "8px",
                  marginRight: "12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={createOffer}
              >
                Create Offer
              </button>
              <button
                style={{
                  backgroundColor: "#3452eb",
                  color: "white",
                  border: "none",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  marginLeft: "8px",
                  marginRight: "12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={createAnswer}
              >
                Create Answer
              </button>
              <button
                style={{
                  backgroundColor: "#3452eb",
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
              <button
                style={{
                  backgroundColor: "#3452eb",
                  color: "white",
                  border: "none",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  marginLeft: "8px",
                  marginRight: "12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={addCandidates}
              >
                Add Candidates
              </button>
            </div>
            <textarea ref={textRef} style={{ height: "100px" }}></textarea>
            <button
              style={{
                backgroundColor: "#3452eb",
                color: "white",
                border: "none",
                paddingTop: "5px",
                paddingBottom: "5px",
                marginLeft: "20px",
                marginRight: "20px",
                marginBottom: "8px",
                marginTop: "8px",
                borderRadius: "5px",
                cursor: "pointer",
                display: "absolute",
              }}
              onClick={"sendText"}
            >
              copy
            </button>
            <textarea style={{ height: "100px" }} disabled></textarea>
          </div>
        </div>

        <div style={{ gridArea: "remote-video" }}>
          <video
            style={{
              backgroundColor: "black",
              height: "70%",
              width: "100%",
            }}
            ref={remoteVideoRef}
            autoPlay
          ></video>
          <FileTransfer pc={pc} dc={dc} />
        </div>
        <div style={{ gridArea: "text-chat" }}>
          <TextChat pc={pc} dc={dc} />
        </div>
      </div>
    </section>
  );
}

export default App;
