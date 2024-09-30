"use client";

import { useState, useEffect } from "react";
import Web3 from "web3";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import {
  AccountBalanceWallet,
  Speed,
  LocalGasStation,
  Block,
  Security,
  TrendingUp,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const INFURA_API_URL = `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`;

// 型の定義
interface Transaction {
  blockHash?: string;
  blockNumber?: number;
  from: string;
  hash: string;
  transactionIndex?: number;
  to?: string;
  value?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface Block {
  number: number;
  hash: string;
  timestamp: number;
  miner: string;
  transactions: (string | Transaction)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

const StatCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => (
  <Card elevation={3}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        {icon}
        <Typography variant="h6" component="h2" ml={1}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="p">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default function Component() {
  const [ethPrice, setEthPrice] = useState(0);
  const [marketCap, setMarketCap] = useState(0);
  const [transactions, setTransactions] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);
  const [lastBlock, setLastBlock] = useState(0);
  const [lastSafeBlock, setLastSafeBlock] = useState(0);
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [latestTransactions, setLatestTransactions] = useState<Transaction[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const web3 = new Web3(INFURA_API_URL);

  const fetchCryptoData = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/ethereum"
      );
      setEthPrice(response.data.market_data.current_price.usd);
      setMarketCap(response.data.market_data.market_cap.usd);
    } catch (error) {
      console.error("Failed to fetch crypto data", error);
    }
  };

  const fetchBlockchainData = async () => {
    setLoading(true);
    try {
      const blockNumber = Number(await web3.eth.getBlockNumber());
      setLastBlock(blockNumber);
      setLastSafeBlock(blockNumber - 64);

      const gasPriceWei = await web3.eth.getGasPrice();
      setGasPrice(Number(web3.utils.fromWei(gasPriceWei, "gwei")));

      const latestBlocksData: Block[] = await Promise.all(
        Array.from({ length: 5 }, (_, i) =>
          web3.eth.getBlock(blockNumber - i, true).then((block) => ({
            ...block,
            number: Number(block.number),
            hash: block.hash || "",
            timestamp: Number(block.timestamp),
            transactions: block.transactions.map((tx) =>
              typeof tx === "string" ? tx : tx.hash
            ),
          }))
        )
      );
      setLatestBlocks(latestBlocksData);

      const latestBlock = await web3.eth.getBlock("latest", true);
      if (
        Array.isArray(latestBlock.transactions) &&
        typeof latestBlock.transactions[0] === "object"
      ) {
        setLatestTransactions(
          latestBlock.transactions.slice(0, 5) as Transaction[]
        );
      }
      setTransactions(latestBlock.transactions.length);
    } catch (error) {
      console.error("Failed to fetch blockchain data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    fetchBlockchainData();
    const interval = setInterval(fetchBlockchainData, 15000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}
      >
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              EthExplorer
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {loading && <LinearProgress />}

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<AccountBalanceWallet color="primary" />}
                title="ETHER PRICE"
                value={`$${ethPrice.toFixed(2)}`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<TrendingUp color="secondary" />}
                title="MARKET CAP"
                value={`$${(marketCap / 1e9).toFixed(2)}B`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<Speed color="warning" />}
                title="TRANSACTIONS"
                value={`${transactions} TPS`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<LocalGasStation color="error" />}
                title="MED GAS PRICE"
                value={`${gasPrice.toFixed(2)} Gwei`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<Block color="info" />}
                title="LAST FINALIZED BLOCK"
                value={lastBlock.toLocaleString()}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<Security color="success" />}
                title="LAST SAFE BLOCK"
                value={lastSafeBlock.toLocaleString()}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Latest Blocks
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Block</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Txn</TableCell>
                        <TableCell>Fee Recipient</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {latestBlocks.map((block) => (
                        <TableRow key={block.number} hover>
                          <TableCell>{block.number}</TableCell>
                          <TableCell>
                            {Math.floor(Date.now() / 1000 - block.timestamp)}{" "}
                            secs ago
                          </TableCell>
                          <TableCell>{block.transactions.length}</TableCell>
                          <TableCell>{`${block.miner.slice(
                            0,
                            6
                          )}...${block.miner.slice(-4)}`}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Latest Transactions
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Txn Hash</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {latestTransactions.map((tx) => (
                        <TableRow key={tx.hash} hover>
                          <TableCell>{`${tx.hash.slice(0, 6)}...${tx.hash.slice(
                            -4
                          )}`}</TableCell>
                          <TableCell>{`${tx.from.slice(0, 6)}...${tx.from.slice(
                            -4
                          )}`}</TableCell>
                          <TableCell>
                            {tx.to
                              ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`
                              : "Contract Creation"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Box
          component="footer"
          sx={{ bgcolor: "background.paper", py: 2, mt: "auto" }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              © 2024 EthExplorer. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
