import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

function App() {
  const state = useState()
  const [cwnd, setCwnd] = useState(1);
  const [ssthresh, setSsthresh] = useState(64);
  const [sent, setSent] = useState([0]);
  const [lost, setLost] = useState([]);
  const [lost_pkt, setLost_pkt] = useState(0);
  const [ack, setAck] = useState(0);

  const handleChangeThresh = (event) => {
      setSsthresh(parseInt(event.target.value));
  }

  const handleChange = (event) => {
      setLost_pkt(parseInt(event.target.value));
  }

  const handleLost = () => {
      if(lost.indexOf(lost_pkt) == -1 && sent.indexOf(lost_pkt) != -1){
          setLost([...lost, lost_pkt]);
      }
  }

  const handleClick = () => {
      if(lost.length > 0){
          setAck(lost[0]);
      }
      else {
          setAck(sent[sent.length - 1]+1)
      }
  }

  const handleNext = () => {
      if(cwnd < ssthresh && lost.length == 0){
          setCwnd(cwnd+1);
          setSent(Array.from({ length: cwnd + 1 }, (v, i) => ack+1 + i));
          // cwnd: state.cwnd + 1,
          // ssthresh: state.ssthresh,
          // sent: Array.from({ length: this.state.cwnd + 1 }, (v, i) => this.state.ack + i)
      }
      else if(lost.length != 0)
      {
        setSent(Array.from({ length: cwnd + 1 }, (v, i) => sent[sent.length - 1]+1 + i));
        setLost([]);
        // sent: Array.from({ length: this.state.cwnd + 1 }, (v, i) => state.sent[state.sent.length-1]+1 + i),
        // lost: []
      }
      else {
          setCwnd(1);
          setSsthresh(ssthresh/2);
          setSent(Array.from({ length: cwnd + 1 }, (v, i) => ack+1 + i));
          // cwnd: 1,
          // ssthresh: state.ssthresh/2,
          // sent: Array.from({ length: this.state.cwnd + 1 }, (v, i) => this.state.ack + i)
      }
  };
  return (
    <div className="App">
      <header className="App-header">
      <h2>Congestion Window: {cwnd}</h2>
        <h2>Slow Start Threshold: {ssthresh}</h2>
        <h3>Change Slow Start Threshold:</h3>
        <input onChange={handleChangeThresh} value={ssthresh} />
        <h2>Send packets</h2>
        {sent}
        <h2>Lost packets</h2>
        {lost}
        <p>Packet to lose:</p>
        <input onChange={handleChange} value={lost_pkt} />
        <button onClick={handleLost}>Lost</button>
        <h2>Simulate</h2>
        <button onClick={handleClick}>Send</button>
        <h2>Acknowledgement: ACK{ack}</h2>
        <h2>Next Simulation</h2>
        <button onClick={handleNext}>Next</button>
      </header>
    </div>
  );
}

export default App;
