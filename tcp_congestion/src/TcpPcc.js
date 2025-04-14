// TcpPcc.js

class TcpPcc {
    constructor(lossRate = 0.02) {
      this.packetLossRate = lossRate;
      this.utilityHistory = [];
    }
  
    calculateUtility(ack, cwnd, lossRate, rtt) {
      const throughput = ack / rtt;
      return throughput - (lossRate * cwnd);  // simplified utility function
    }
  
    simulateNodeStep(node) {
      const packetsToSend = node.cwnd;
      let packetsSent = 0;
      let packetsLost = 0;
      const rtt = Math.random() * 100 + 50; // simulate RTT between 50-150ms
  
      for (let i = 0; i < packetsToSend; i++) {
        packetsSent++;
        if (Math.random() < this.packetLossRate) {
          packetsLost++;
        } else {
          node.ack++;
        }
      }
  
      const lossRate = packetsLost / packetsSent;
      const utility = this.calculateUtility(node.ack, node.cwnd, lossRate, rtt);
  
      // Maintain a short history to track performance
      this.utilityHistory.push(utility);
      if (this.utilityHistory.length > 2) this.utilityHistory.shift();
  
      // Compare utility to previous cycle
      if (this.utilityHistory.length < 2 || utility > this.utilityHistory[0]) {
        node.cwnd += 1;  // Increase sending rate
      } else {
        node.cwnd = Math.max(1, node.cwnd - 1);  // Decrease if performance worsens
      }
  
      node.totalPacketsSent += packetsSent;
      node.totalPacketsLost += packetsLost;
  
      return { packetsSent, packetsLost, cwnd: node.cwnd, utility };
    }
  }
  
  export default TcpPcc;
  