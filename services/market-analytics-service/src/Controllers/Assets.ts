import { Request, Response } from "express";
import axios from "axios"
import { CMC_API_KEY } from "../Constants/index"

const CMC_API_URL = "https://pro-api.coinmarketcap.com/v1";

//Getting the coins data
const onGetCoins = async (req: Request, res: Response) => {
  let limit = 50;

 try {
   const response = await axios.get(
     `${CMC_API_URL}/cryptocurrency/listings/latest`,
     {
       headers: {
         "X-CMC_PRO_API_KEY": CMC_API_KEY,
       },
       params: {
         start: 1,
         limit,
         convert: "USD",
       },
     }
   );

   return res.json(response.data.data);
 } catch (error: any) {
   console.error(
     "CoinMarketCap API error:",
     error.response?.data || error.message
   );
   return res.status(500).json({ error: "Failed to fetch coins" });
 }
}

const onGetCoin = async (req: Request, res: Response) => {
  try {
    const { coin_id } = req.query;
    
    if (!coin_id) {
      return res.status(400).json({ error: "coin_id is required" });
    }

    const response = await axios.get(
      `${CMC_API_URL}/cryptocurrency/quotes/latest`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": CMC_API_KEY,
        },
        params: {
          id: coin_id,
          convert: "USD",
        },
      }
    );

    return res.json(response.data.data);
  } catch (error: any) {
    console.error(
      "CoinMarketCap API error:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: "Failed to fetch coin" });
  }
}

export {
  onGetCoins,
  onGetCoin
}