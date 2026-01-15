import { Request, Response } from "express";
import axios from "axios";
import { CG_API_KEY } from "../Constants/index";

const cgAxios = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  headers: {
    "x-cg-demo-api-key": CG_API_KEY,
  },
});

// Getting the coins list (CoinGecko)
const onGetCoins = async (req: Request, res: Response) => {
  const limit = 30; // This is the numb of coins requested per to not surpass the free tier
  const current_page = Number(req.query.currentPage);

  try {
    const response = await cgAxios.get("/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: limit,
        page: current_page,
        sparkline: false,
        price_change_percentage: "24h",
      },
    });

    return res.json(response.data);
  } catch (error: any) {
    console.error(
      "CoinGecko API error:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      error: "Failed to fetch coins from CoinGecko",
    });
  }
};

const onGetCoin = async (req: Request, res: Response) => {
  try {
    const { coin_id } = req.query;

    if (!coin_id) {
      return res.status(400).json({ error: "coin_id is required" });
    }

    const response = await cgAxios.get(`/coins/${coin_id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });

    return res.json(response.data);
  } catch (error: any) {
    console.error(
      "CoinGecko API error:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: "Failed to fetch coin" });
  }
};

const onGetCoinChartData = async (req: Request, res: Response) => {
  const { coinId, interval, dataType } = req.query;

  if (!coinId) {
    return res.status(400).json({ error: "coinId is required" });
  }

  try {
    const timeRanges: Record<string, number | "max"> = {
      "1D": 1,
      "7D": 7,
      "1M": 30,
      "6M": 180,
      "1Y": 365,
      All: "max",
    };

    const days = timeRanges[interval as string] ?? 7;

    // Chart
    const chartResponse = await cgAxios.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: "usd",
        days,
      },
    });

    const chartSource =
      dataType === "Market Cap"
        ? chartResponse.data.market_caps
        : chartResponse.data.prices;

    const chartData = chartSource.map(
      ([timestamp, value]: [number, number]) => ({
        timestamp,
        value,
      })
    );

    // Markets
    const marketsResponse = await cgAxios.get(`/coins/${coinId}/tickers`, {
      params: {
        order: "volume_desc",
        per_page: 10,
        page: 1,
      },
    });

    const marketPairs = marketsResponse.data.tickers.map((t: any) => ({
      exchange: t.market.name,
      pair: `${t.base}/${t.target}`,
      price: t.last,
      volume_24h: t.volume,
    }));

    return res.json({
      chartData,
      marketPairs,
    });
  } catch (error: any) {
    console.error(
      "CoinGecko API error:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      error: "Failed to fetch coin chart data",
    });
  }
};

export { onGetCoins, onGetCoin, onGetCoinChartData };
