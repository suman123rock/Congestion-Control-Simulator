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
        let last = sent[sent.length - 1];
        setCwnd(cwnd+1);
        console.log(lost.length, cwnd, sent.length, last, lost[0])
        setSent(lost);
        if(sent.length <= cwnd)
          setSent(sent.concat(Array.from({ length: sent.length - cwnd + 1 }, (v, i) => last+1 + i)));
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
      Simulate Congestion Control Algorithms
      </header>
      <div className="App-body">
      <div className="initialvalues">
        <div className='pkthead'>
        <h2>Congestion Window</h2>
        { cwnd }
        </div>
        <div className='pkthead'>
        <h2>Slow Start Threshold</h2>
        {ssthresh}
        </div>
        <div className='pkthead'>
        <h3>Change Initial Slow Start Threshold</h3>
        <input onChange={handleChangeThresh} value={ssthresh} />
        </div>
        </div>
        <div className='send'>
        <div>
      <h4>The packets to be transferred in this window have the following sequence numbers</h4>
      <h5># {sent}</h5>
      </div>
      <div>
      <h4>The packets to be simulated as lost in this window have the following sequence numbers</h4>
      <h5># {lost}</h5>
      <p></p>
        <input onChange={handleChange} value={lost_pkt} />
        <button onClick={handleLost}>Lost</button>
      </div>
      </div>
        <button onClick={handleClick} className="simulate">Simulate the packet transfer for current window</button>
        <div className="ack">
          <h2>Received Acknowledgement after transfer : ACK{ack}</h2>
        </div>
        <button onClick={handleNext} className="simulate">Shift the window for next simulation round.</button>
    </div>
    </div>
  );
}

export default App;