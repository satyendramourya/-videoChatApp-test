// const createAnswer = () => {
//   pc.current
//     .createAnswer({
//       offerToReceiveAudio: 1,
//       offerToReceiveVedio: 1,
//     })
//     .then((sdp) => {
//       console.log(JSON.stringify(sdp));
//       pc.current.setLocalDescription(sdp);

//       //send the ans to the offering peer
//       processSDP(sdp);
//       setAnswerVisible(false);
//       setStatus("setRemoteDescription answered");
//     })
//     .catch((e) => console.log(e));
// };

// const setRemoteDescription = () => {
//   const desc = JSON.parse(textRef.current.value);
//   console.log(desc);
//   if (desc.type === "offer") {
//     setStatus("offer accepted");
//     console.log("offer  accepted");
//   } else {
//     setStatus("answer accepted");
//     console.log("answer accepted");
//   }
//   pc.current.setRemoteDescription(new RTCSessionDescription(desc));
//   setStatus("setRemoteDescription seted");
// };

// const addCandidates = () => {
//   const candidates = JSON.parse(textRef.current.value);
//   // candidates.forEach((candidate) => {
//   //   pc.current.addIceCandidate(new RTCIceCandidate(candidate));
//   // console.log(`Adding Candidate...`, candidates);
//   pc.current.addIceCandidate(new RTCIceCandidate(candidates));
//   setStatus("candidate added");
// };

// // ---------------Data channel ----------------

// const onSendChannelStateChange = () => {
//   // const readyState = sendChannel.readyState;
//   console.log("Send channel state is: " + sendChannel.readyState);
// };

// const receiveChannelCallback = (event) => {
//   console.log("Receive Channel Callback");
//   receiveChannel = event.channel;
//   receiveChannel.onmessage = onReceiveMessageCallback;
//   receiveChannel.onopen = onReceiveChannelStateChange;
//   receiveChannel.onclose = onReceiveChannelStateChange;
// };

// const onReceiveMessageCallback = (event) => {
//   console.log("Received Message");
//   // dataChannelReceive.push(event.data);
//   setReceivedMessage((prevMessages) => [...prevMessages, "niraj"]);
// };

// const onReceiveChannelStateChange = () => {
//   const readyState = receiveChannel.readyState;
//   console.log(`Receive channel state is: ${readyState}`);
// };
