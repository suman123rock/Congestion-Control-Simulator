# TCP Congestion Control Simulator

This tool is designed to help students and enthusiasts understand and visualize the congestion control algorithms in Transmission Control Protocol (TCP), specifically the Slow Start and Congestion Avoidance mechanisms.

## Project Overview

This simulator provides an interactive way to learn about TCP's congestion control algorithms. By simulating packet transfers and visualizing the impact of network conditions, users can gain a deeper understanding of how TCP manages congestion to maintain efficient data transfer. The primary focus is on the Slow Start and Congestion Avoidance algorithms.

## Features

- **Interactive Input**: Users can enter the value of the `ssthresh` (slow start threshold) to customize the simulation.
- **Packet State Selection**: Before each packet transfer, users can select whether the packet will be successfully delivered or lost.
- **Real-Time Visualization**: The simulator displays the sequence numbers of packets sent and acknowledgments received per unit RTT (Round-Trip Time).
- **Educational Purpose**: This project aims to enhance the learning experience for undergraduate students studying computer networks by providing a practical tool to visualize TCP behavior under different network conditions.

## How to Use

1. **Enter ssthresh**: Start by entering the desired value for `ssthresh` in the input field.
2. **Select Packet State**: Before each packet transfer, select the future state of the packet as either "Delivered" or "Lost".
3. **Simulate**: The simulator will run the selected TCP algorithm (Slow Start or Congestion Avoidance) and display the results in real-time, showing the sequence numbers and acknowledgments.

## Deployment

Visit the deployed site [here](https://nandika-a.github.io/Congestion-Control-Simulator/) to start simulating TCP congestion control algorithms.

## Technologies used

The simulator is built using React.js for a responsive and interactive user experience. The logic for the TCP algorithms is implemented in JavaScript to provide real-time feedback and visualization.

## Getting Started

To get started with the project locally:

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/tcp-congestion-control-simulator.git
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   (use project name as tcp-congestion)
   ```

3. **Run the Simulator**:
   ```bash
   cd tcp-congestion
   npm start
   ```

4. **Open in Browser**:
   Open [http://localhost:3000](http://localhost:3000) in your web browser to start using the simulator.


## Acknowledgments

This project was created to support educational efforts in computer networking courses, helping students visualize and understand TCP congestion control algorithms.

---

