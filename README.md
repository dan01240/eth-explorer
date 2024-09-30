# EthExplorer

A React-based Ethereum blockchain explorer that provides real-time data about the Ethereum network. EthExplorer utilizes **Web3.js** for blockchain interaction and **Material UI** for a responsive and user-friendly UI.

## Features

- **Real-Time Ethereum Data**: Displays the latest block number, finalized block, transaction details, gas price, and more.
- **Interactive UI**: Built with Material UI, providing an intuitive way to navigate Ethereum data.
- **Auto Refresh**: Updates blockchain data every 15 seconds to keep information up-to-date.
- **Detailed Block and Transaction Info**: See recent blocks and transactions, including their hashes, miner addresses, and more.

## Demo

Check out the live demo to see the application in action: [EthExplorer Demo](https://eth-explorer-dqig.vercel.app/).

![Alt text for the image](https://github.com/user-attachments/assets/402199ba-01f2-4465-bfbc-88f121f6196f)

## Installation

To run EthExplorer locally, follow these steps:

### Prerequisites

- Node.js (>=14)
- npm or yarn
- Infura API key for connecting to the Ethereum mainnet

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/eth-explorer.git
   ```
2. **Navigate to the project directory**:

   ```bash
   cd eth-explorer
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

   or, if you use yarn:

   ```bash
   yarn install
   ```

4. **Set up environment variables**:

   Create a `.env.local` file in the project root with the following content:

   ```plaintext
   NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key_here
   ```

5. **Run the application**:

   ```bash
   npm run dev
   ```

   or, if you use yarn:

   ```bash
   yarn dev
   ```

6. **Access the app**:

   Open your browser and navigate to `http://localhost:3000`.

## Usage

- The dashboard will display key metrics like Ether price, transaction count, gas price, and recent blocks and transactions.
- Click on individual blocks or transactions for more details.

## Technologies Used

- **React**: For building the user interface.
- **Web3.js**: To interact with the Ethereum blockchain.
- **Axios**: To fetch cryptocurrency data from third-party APIs.
- **Material UI**: For consistent and responsive UI components.

## Contact

For questions or suggestions, please contact me at [domo01240@gmail.com].

---

Happy Exploring!
