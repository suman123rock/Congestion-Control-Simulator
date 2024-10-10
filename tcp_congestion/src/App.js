import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

function App() {
  const [nodes, setNodes] = useState([]);//This state will contain all the info(cwnd, ssthresh, sent , lost, ack) for each node
  //in the form of array of js objects
  const [connections, setConnections] = useState([]); // Connection matrix (bi-directional)
  const [numNodes, setNumNodes] = useState(0); // Number of nodes to be created
  const [newConnection, setNewConnection] = useState({ from: 0, to: 0 }); // For creating connections
  const [selectedNodeId, setSelectedNodeId] = useState(0); // Selected source node
  const [selectedDestNodeId, setSelectedDestNodeId] = useState(1); // Selected destination node
  const [lost_pkt, setLost_pkt] = useState(0); // Packet to be marked as lost

  // Handler for setting number of nodes
  const handleNumNodesChange = (event) => {
    setNumNodes(parseInt(event.target.value));
  };

  // Create nodes dynamically based on user input
  const createNodes = () => {
    const newNodes = Array.from({ length: numNodes }, (_, id) => ({
      id,
      cwnd: 1,
      ssthresh: 64,
      sent: [0],
      lost: [],
      ack: 0,
    }));
    setNodes(newNodes);
  };

  // Handle changes in node connections
  const handleConnectionChange = (event) => {
    const { name, value } = event.target;
    setNewConnection({ ...newConnection, [name]: parseInt(value) });
  };

  // Add a connection between two nodes
  const addConnection = () => {
    const { from, to } = newConnection;
    if (
      from >= 0 && from < nodes.length &&
      to >= 0 && to < nodes.length &&
      from !== to &&
      !connections.some(conn => (conn[0] === from && conn[1] === to) || (conn[1] === from && conn[0] === to))
    ) {
      setConnections([...connections, [from, to]]);
    }
  };

  // Handle lost packet simulation
  const handleChangeLostPkt = (event) => {
    setLost_pkt(parseInt(event.target.value));
  };

  const handleLost = () => {
    const sourceNode = nodes.find(node => node.id === selectedNodeId);
    if (sourceNode.lost.indexOf(lost_pkt) === -1 && sourceNode.sent.indexOf(lost_pkt) !== -1) {
      const updatedLost = [...sourceNode.lost, lost_pkt];
      setNodes(nodes.map(node =>
        node.id === selectedNodeId ? { ...node, lost: updatedLost } : node
      ));
    }
  };

  // Check if connection exists between selected source and destination
  const isConnected = (from, to) => {
    return connections.some(conn => (conn[0] === from && conn[1] === to) || (conn[1] === from && conn[0] === to));
  };

  const handleClick = () => {
    if (!isConnected(selectedNodeId, selectedDestNodeId)) {
      alert(`No connection exists between Node ${selectedNodeId} and Node ${selectedDestNodeId}`);
      return;
    }

    setNodes(prevNodes => {
      const updatedNodes = [...prevNodes];
      const currentNode = { ...updatedNodes[selectedNodeId] };

      if (currentNode.lost.length > 0) {
        currentNode.ack = currentNode.lost[0]; // Acknowledge the lost packet
      } else {
        currentNode.ack = currentNode.sent[currentNode.sent.length - 1] + 1; // ACK for the last sent packet
      }

      updatedNodes[selectedNodeId] = currentNode;
      return updatedNodes;
    });
  };

  const handleNext = () => {
    if (!isConnected(selectedNodeId, selectedDestNodeId)) {
      alert(`No connection exists between Node ${selectedNodeId} and Node ${selectedDestNodeId}`);
      return;
    }

    setNodes(prevNodes => {
      const updatedNodes = [...prevNodes];
      const currentNode = { ...updatedNodes[selectedNodeId] };

      if (currentNode.cwnd < currentNode.ssthresh && currentNode.lost.length === 0) {
        // Increase cwnd
        currentNode.cwnd += 1;
        currentNode.sent = Array.from({ length: currentNode.cwnd + 1 }, (v, i) => currentNode.ack + 1 + i);
      } else if (currentNode.lost.length !== 0) {
        // Handle lost packets
        let last = currentNode.sent[currentNode.sent.length - 1];
        currentNode.cwnd += 1;
        currentNode.sent = [...currentNode.lost]; // Reset sent to lost packets
        if (currentNode.sent.length <= currentNode.cwnd) {
          currentNode.sent = currentNode.sent.concat(Array.from({ length: currentNode.cwnd - currentNode.sent.length + 1 }, (v, i) => last + 1 + i));
        }
        currentNode.lost = [];
      } else {
        // If we reached the threshold
        currentNode.cwnd = 1;
        currentNode.ssthresh = Math.floor(currentNode.ssthresh / 2);
        currentNode.sent = Array.from({ length: currentNode.cwnd + 1 }, (v, i) => currentNode.ack + 1 + i);
      }

      updatedNodes[selectedNodeId] = currentNode;
      return updatedNodes;
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        Simulate Congestion Control Algorithms with Multiple Nodes
      </header>
      <div className="App-body">

        {/* Input for number of nodes */}
        <div className="initialvalues">
          <h3>Enter the number of nodes:</h3>
          <input
            type="number"
            value={numNodes}
            onChange={handleNumNodesChange}
          />
          <button onClick={createNodes}>Create Nodes</button>
        </div>

        {/* Input for connections between nodes */}
        <div>
          <h3>Define connections between nodes:</h3>
          <div>
            <label>From Node:</label>
            <input
              type="number"
              name="from"
              value={newConnection.from}
              onChange={handleConnectionChange}
              min="0"
              max={numNodes - 1}
            />
            <label>To Node:</label>
            <input
              type="number"
              name="to"
              value={newConnection.to}
              onChange={handleConnectionChange}
              min="0"
              max={numNodes - 1}
            />
            <button onClick={addConnection}>Add Connection</button>
          </div>

          <h4>Existing Connections:</h4>
          <ul>
            {connections.map((conn, index) => (
              <li key={index}>Node {conn[0]} ↔ Node {conn[1]}</li>
            ))}
          </ul>
        </div>

        {/* Node selection for simulation */}
        {nodes.length > 0 && (
          <>
            <div className="initialvalues">
              <div className='pkthead'>
                <h2>Select Source Node</h2>
                <select onChange={(e) => setSelectedNodeId(parseInt(e.target.value))} value={selectedNodeId}>
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>Node {node.id}</option>
                  ))}
                </select>
              </div>
              <div className='pkthead'>
                <h2>Select Destination Node</h2>
                <select onChange={(e) => setSelectedDestNodeId(parseInt(e.target.value))} value={selectedDestNodeId}>
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>Node {node.id}</option>
                  ))}
                </select>
              </div>
              <div className='pkthead'>
                <h2>Congestion Window (Node {selectedNodeId})</h2>
                {nodes[selectedNodeId].cwnd}
              </div>
              <div className='pkthead'>
                <h2>Slow Start Threshold (Node {selectedNodeId})</h2>
                {nodes[selectedNodeId].ssthresh}
              </div>
            </div>

            <div className='send'>
              <div>
                <h4>Packets to be transferred from Node {selectedNodeId}</h4>
                <h5># {nodes[selectedNodeId].sent.join(', ')}</h5>
              </div>
              <div>
                <h4>Packets simulated as lost in this window</h4>
                <h5># {nodes[selectedNodeId].lost.join(', ')}</h5>
                <input onChange={handleChangeLostPkt} value={lost_pkt} />
                <button onClick={handleLost}>Mark as Lost</button>
              </div>
            </div>

            {/* Simulation buttons */}
            <button onClick={handleClick} className="simulate">
              Simulate Packet Transfer for Current Window
            </button>
            <div className="ack">
              <h2>Received Acknowledgement (ACK): {nodes[selectedNodeId].ack}</h2>
            </div>
            <button onClick={handleNext} className="simulate">
              Shift the Window for Next Simulation Round
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default App;
