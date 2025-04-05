
// TcpReno.js
class TcpReno {
    constructor(packetLossRate = 0.02) {
      this.packetLossRate = packetLossRate;
    }
  
    simulateNodeStep(node) {
      const packetsToSend = node.cwnd;
      let packetsSent = 0;
      let packetsLost = 0;

      console.log(`\n🔁 Simulating Node ${node.id} — cwnd: ${node.cwnd}, ssthresh: ${node.ssthresh}`);
  
      for (let i = 0; i < packetsToSend; i++) {
        packetsSent++;
        if (Math.random() < this.packetLossRate) {
          packetsLost++;
        } else {
          node.ack++;
        }
      }
  
      if (packetsLost === 0) {
        // No loss: grow cwnd
        if (node.cwnd < node.ssthresh) {
          node.cwnd *= 2; // Slow start
          console.log(`Slow Start: No loss. cwnd doubled to ${node.cwnd}`);

        } else {
          node.cwnd += 1; // Congestion avoidance
          console.log(` Congestion Avoidance: No loss. cwnd increased to ${node.cwnd}`);
        }
      } else if (packetsLost === 1) {
        // Simulate Fast Retransmit + Recovery
        node.ssthresh = Math.max(2, Math.floor(node.cwnd / 2));
        node.cwnd = node.ssthresh + 3; // Simulate fast recovery
        console.log(` Fast Retransmit + Recovery Triggered:`);
        console.log(`  1 Packet Lost`);
        console.log(`  ssthresh = floor(prev_cwnd / 2) = ${node.ssthresh}`);
        console.log(`  cwnd set to ssthresh + 3 = ${node.cwnd}`);
      } else {
        // Multiple losses: go back to slow start
        node.ssthresh = Math.max(2, Math.floor(node.cwnd / 2));
        node.cwnd = 1;
        console.log(` Multiple Losses Detected`);
        console.log(` ssthresh = ${node.ssthresh}`);
        console.log(` Returning to slow start: cwnd = ${node.cwnd}`);
      }
  
      node.totalPacketsSent += packetsSent;
      node.totalPacketsLost += packetsLost;
  
      return {
        packetsSent,
        packetsLost,
        cwnd: node.cwnd,
        ssthresh: node.ssthresh
      };
    }
  }
  
  export default TcpReno;
  