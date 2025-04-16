// TcpCubic.js

class TcpCubic {
    constructor(lossRate = 0.02) {
      this.packetLossRate = lossRate;
      this.lastLossTime = 0;
      this.K = 0;
      this.W_max = 0;
      this.C = 0.4; // Cubic scaling constant
      this.beta = 0.7; // Multiplicative decrease factor
      this.startTime = Date.now();
    }
  
    getCurrentTime() {
      return (Date.now() - this.startTime) / 1000; // seconds since start
    }
  
    calculateCubicCwnd(timeSinceLastLoss) {
      const t = timeSinceLastLoss - this.K;
      return this.C * Math.pow(t, 3) + this.W_max;
    }
  
    simulateNodeStep(node) {
      const packetsToSend = node.cwnd;
      let packetsSent = 0;
      let packetsLost = 0;
  
      for (let i = 0; i < packetsToSend; i++) {
        packetsSent++;
        if (Math.random() < this.packetLossRate) {
          packetsLost++;
        } else {
          node.ack++;
        }
      }
  
      const timeNow = this.getCurrentTime();
  
      if (packetsLost > 0) {
        this.W_max = node.cwnd;
        node.ssthresh = Math.max(2, Math.floor(node.cwnd * this.beta));
        node.cwnd = Math.max(1, node.ssthresh);
        this.lastLossTime = timeNow;
        this.K = Math.cbrt(this.W_max * (1 - this.beta) / this.C);
      } else {
        const t = timeNow - this.lastLossTime;
        const cubicCwnd = this.calculateCubicCwnd(t);
        node.cwnd = Math.max(1, Math.floor(cubicCwnd));
      }
  
      node.totalPacketsSent += packetsSent;
      node.totalPacketsLost += packetsLost;
  
      return {
        packetsSent,
        packetsLost,
        cwnd: node.cwnd
      };
    }
  }
  
  export default TcpCubic;
  