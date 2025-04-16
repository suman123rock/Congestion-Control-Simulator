// TcpBbr.js

class TcpBbr {
    constructor(lossRate = 0.02) {
      this.packetLossRate = lossRate;
      this.minRtt = 100; // starting RTT in ms
      this.btlBandwidth = 0; // estimated bandwidth
      this.pacingGain = 1.25;
      this.cwndGain = 2;
    }
  
    estimateBandwidth(ack, rtt) {
      return ack / rtt;
    }
  
    simulateNodeStep(node) {
      const rtt = Math.random() * 100 + 50; // simulate RTT 50–150ms
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
  
      const deliveryRate = this.estimateBandwidth(node.ack, rtt);
      this.minRtt = Math.min(this.minRtt, rtt);
      this.btlBandwidth = Math.max(this.btlBandwidth, deliveryRate);
  
      // BBR cwnd = BDP estimate = Bandwidth * RTT
      const bdp = this.btlBandwidth * this.minRtt / 1000;
      node.cwnd = Math.max(4, Math.floor(bdp * this.cwndGain));
  
      node.totalPacketsSent += packetsSent;
      node.totalPacketsLost += packetsLost;
  
      return {
        packetsSent,
        packetsLost,
        cwnd: node.cwnd,
        bandwidthEstimate: this.btlBandwidth.toFixed(2),
        minRtt: this.minRtt.toFixed(2),
      };
    }
  }
  
  export default TcpBbr;
  