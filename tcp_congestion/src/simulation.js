class Simulation {
    constructor(nodes, connections, logger) {
      this.nodes = nodes;
      this.connections = connections;
      this.logger = logger;
      this.currentTime = 0;
      this.isRunning = false;
      this.algorithm = 'TCP'; // Default algorithm
    }
  
    start() {
      this.isRunning = true;
      this.run();
    }
  
    stop() {
      this.isRunning = false;
    }
  
    run() {
      if (!this.isRunning) return;
  
      this.simulateStep();
      this.currentTime++;
  
      setTimeout(() => this.run(), 1000); // Run every second
    }
  
    simulateStep() {
      this.nodes.forEach(node => {
        if (node.connections.length > 0) {
          this.simulateNodeStep(node);
        }
      });
  
      this.logSimulationState();
    }
  
    simulateNodeStep(node) {
      // Simulate packet transfer
      if (node.cwnd < node.ssthresh) {
        // Slow start
        node.cwnd *= 2;
      } else {
        // Congestion avoidance
        node.cwnd += 1;
      }
  
      // Simulate packet loss (randomly, for demonstration)
      if (Math.random() < 0.1) { // 10% chance of packet loss
        node.cwnd = Math.floor(node.cwnd / 2);
        node.ssthresh = Math.max(2, node.cwnd);
      }
  
      // Update sent packets
      node.sent = Array.from({ length: node.cwnd }, (_, i) => node.ack + i + 1);
  
      // Update ACK
      node.ack = Math.max(...node.sent);
    }
  
    logSimulationState() {
      const averageMetrics = this.calculateAverageMetrics();
      this.logger.addLog({
        algorithm: this.algorithm,
        ...averageMetrics
      });
    }
  
    calculateAverageMetrics() {
      const metrics = this.nodes.map(node => ({
        packetLoss: (node.lost.length / node.sent.length) * 100 || 0,
        latency: Math.random() * 150 + 50, // Simulated latency between 50-200ms
        throughput: node.sent.length / (this.currentTime || 1)
      }));
  
      return {
        packetLoss: metrics.reduce((sum, m) => sum + m.packetLoss, 0) / this.nodes.length,
        averageLatency: metrics.reduce((sum, m) => sum + m.latency, 0) / this.nodes.length,
        throughput: metrics.reduce((sum, m) => sum + m.throughput, 0) / this.nodes.length
      };
    }
  
    setAlgorithm(algorithm) {
      this.algorithm = algorithm;
    }
  }
  
  export default Simulation;