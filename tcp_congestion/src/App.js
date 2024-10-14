import React, { useState, useEffect, useCallback} from 'react';
import './App.css';
import NetworkDashboard from './NetworkDashboard';
import Logger from './Logger';
import Simulation from './simulation';

function App() {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [numNodes, setNumNodes] = useState(0);
  const [newConnection, setNewConnection] = useState({ from: 0, to: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState(0);
  const [selectedDestNodeId, setSelectedDestNodeId] = useState(1);
  const [lost_pkt, setLost_pkt] = useState(0);
  const [throughput, setThroughput] = useState([]);
  const [packetLoss, setPacketLoss] = useState([]);
  const [latency, setLatency] = useState([]);
  const [congestionWindow, setCongestionWindow] = useState([]);
  const [simulationTime, setSimulationTime] = useState(0);
  const [error, setError] = useState('');
  const [isAutoSimulationRunning, setIsAutoSimulationRunning] = useState(false);

  const [logger] = useState(new Logger());
  const [simulation, setSimulation] = useState(null);

  const updateNetworkMetrics = useCallback(() => {
    if (!simulation) return;

    const currentNode = nodes[selectedNodeId];
    const metrics = simulation.calculateAverageMetrics();
    
    setThroughput(prevThroughput => [
      ...prevThroughput,
      { x: simulationTime, y: metrics.throughput }
    ]);

    setPacketLoss(prevPacketLoss => [
      ...prevPacketLoss,
      { x: simulationTime, y: metrics.packetLoss }
    ]);

    setLatency(prevLatency => [
      ...prevLatency,
      { x: simulationTime, y: metrics.averageLatency }
    ]);

    setCongestionWindow(prevCongestionWindow => [
      ...prevCongestionWindow,
      { x: simulationTime, y: currentNode.cwnd }
    ]);

    logger.addLog({
      algorithm: 'TCP',
      packetLoss: metrics.packetLoss,
      averageLatency: metrics.averageLatency,
      throughput: metrics.throughput
    });
  }, [simulation, nodes, selectedNodeId, simulationTime, logger]);

  useEffect(() => {
    let timer;
    if (isAutoSimulationRunning && simulation) {
      timer = setInterval(() => {
        setSimulationTime(prevTime => prevTime + 1);
        simulation.simulateStep();
        updateNetworkMetrics();
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isAutoSimulationRunning, simulation, updateNetworkMetrics]);

  const handleNumNodesChange = (event) => {
    const value = parseInt(event.target.value);
    setNumNodes(value > 0 ? value : 0);
  };

  const createNodes = () => {
    if (numNodes <= 0) {
      setError('Please enter a valid number of nodes.');
      return;
    }
    const newNodes = Array.from({ length: numNodes }, (_, id) => ({
      id,
      cwnd: 1,
      ssthresh: 64,
      sent: [0],
      lost: [],
      ack: 0,
      connections: []
    }));
    setNodes(newNodes);
    setError('');

    const newSimulation = new Simulation(newNodes, connections, logger);
    setSimulation(newSimulation);
  };

  const handleConnectionChange = (event) => {
    const { name, value } = event.target;
    setNewConnection({ ...newConnection, [name]: parseInt(value) });
  };

  const addConnection = () => {
    const { from, to } = newConnection;
    if (
      from >= 0 && from < nodes.length &&
      to >= 0 && to < nodes.length &&
      from !== to &&
      !isConnected(from, to)
    ) {
      const newConnections = [...connections, [from, to]];
      setConnections(newConnections);
      setNodes(prevNodes => {
        const updatedNodes = [...prevNodes];
        updatedNodes[from].connections.push(to);
        updatedNodes[to].connections.push(from);
        return updatedNodes;
      });
      if (simulation) {
        simulation.connections = newConnections;
      }
      setError('');
    } else {
      setError('Invalid connection. Please check the node numbers and ensure the connection is unique.');
    }
  };

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
      updatePacketLoss(updatedLost.length, sourceNode.sent.length);
      setError('');
    } else {
      setError('Invalid packet number. Please check the packet exists and is not already marked as lost.');
    }
  };

  const updatePacketLoss = (lostPackets, totalPackets) => {
    const lossRate = (lostPackets / totalPackets) * 100 || 0;
    setPacketLoss(prevPacketLoss => [
      ...prevPacketLoss,
      { x: simulationTime, y: lossRate }
    ]);

    logger.addLog({
      algorithm: 'TCP',
      packetLoss: lossRate,
      averageLatency: 0,
      throughput: 0
    });
  };

  const isConnected = (from, to) => {
    return connections.some(conn => (conn[0] === from && conn[1] === to) || (conn[1] === from && conn[0] === to));
  };
  
  const handleClick = () => {
    if (!isConnected(selectedNodeId, selectedDestNodeId)) {
      setError(`No connection exists between Node ${selectedNodeId} and Node ${selectedDestNodeId}`);
      return;
    }

    if (simulation) {
      simulation.simulateNodeStep(nodes[selectedNodeId]);
      setNodes([...nodes]);
      updateNetworkMetrics();
      setError('');
    }
  };

  const toggleAutoSimulation = () => {
    if (isAutoSimulationRunning) {
      simulation.stop();
    } else {
      simulation.start();
    }
    setIsAutoSimulationRunning(prevState => !prevState);
  };

  const resetSimulation = () => {
    setNodes([]);
    setConnections([]);
    setNumNodes(0);
    setNewConnection({ from: 0, to: 0 });
    setSelectedNodeId(0);
    setSelectedDestNodeId(1);
    setLost_pkt(0);
    setThroughput([]);
    setPacketLoss([]);
    setLatency([]);
    setCongestionWindow([]);
    setSimulationTime(0);
    setError('');
    if (simulation) {
      simulation.stop();
    }
    setSimulation(null);
    logger.logs = [];
  };

  const exportLogs = (format) => {
    logger.exportLogs(format);
  };

  return (
    <div className="App">
      <header className="App-header">
        Simulate Congestion Control Algorithms with Multiple Nodes
      </header>
      <div className="App-body">
        <div className="section">
          <h3>Enter the number of nodes:</h3>
          <input
            type="number"
            value={numNodes}
            onChange={handleNumNodesChange}
            min="0"
          />
          <button onClick={createNodes}>Create Nodes</button>
        </div>

        {nodes.length > 0 && (
          <div className="section">
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
        )}

        {nodes.length > 0 && (
          <>
            <div className="section initialvalues">
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

            <div className='section send'>
              <div>
                <h4>Packets to be transferred from Node {selectedNodeId}</h4>
                <h5>#{nodes[selectedNodeId].sent.join(', ')}</h5>
              </div>
              <div>
                <h4>Packets simulated as lost in this window</h4>
                <h5>#{nodes[selectedNodeId].lost.join(', ')}</h5>
                <input
                  type="number"
                  onChange={handleChangeLostPkt}
                  value={lost_pkt}
                  min={0}
                />
                <button onClick={handleLost}>Mark as Lost</button>
              </div>
            </div>

            <div className="button-group">
              <button onClick={handleClick} className="simulate">
                Simulate Packet Transfer for Current Window
              </button>
              <button onClick={toggleAutoSimulation} className="simulate">
                {isAutoSimulationRunning ? "Stop Auto Simulation" : "Start Auto Simulation"}
              </button>
            </div>

            <div className="section">
              <h2>Received Acknowledgement (ACK): {nodes[selectedNodeId].ack}</h2>
            </div>
            <NetworkDashboard
              throughput={throughput}
              packetLoss={packetLoss}
              latency={latency}
              congestionWindow={congestionWindow}
            />

            <div className="button-group">
              <button onClick={resetSimulation} className="reset">
                Reset Simulation
              </button>
              <button onClick={() => exportLogs('csv')} className="export">
                Export Logs (CSV)
              </button>
              <button onClick={() => exportLogs('json')} className="export">
                Export Logs (JSON)
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;