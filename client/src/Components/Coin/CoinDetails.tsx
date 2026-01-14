import "./coin.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { onGetCoin, onGetCoinChartData } from "../../API/endpoints";
import { BsGlobe, BsTwitter } from "react-icons/bs";
import { AiOutlineFileText } from "react-icons/ai";
import { GrLineChart } from "react-icons/gr";
import { PiStarBold } from "react-icons/pi";
import { FcReddit } from "react-icons/fc";

import Header from "../../LandingPage/TheHeader/index";
import Footer from "../../LandingPage/Footer/index"

interface CoinDetailsData {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  links: {
    homepage: string[];
    whitepaper: string;
    twitter_screen_name: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
  };
  market_data: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    circulating_supply: number;
    total_supply: number;
    max_supply: number | null;
    fully_diluted_valuation: { usd: number };
    market_cap_change_percentage_24h: number;
  };
  market_cap_rank: number;
}

const CoinDetails = () => {
  const { id: coinId } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<CoinDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("7D");
  const [chartData, setChartData] = useState("Price");

  useEffect(() => {
    const fetchCoinDetails = async () => {
      if (!coinId) return;

      try {
        const response = await onGetCoin(coinId);
        console.log("Coin data: ", response.data);
        setCoin(response.data);
      } catch (error) {
        console.error("Failed to fetch coin details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetails();
  }, [coinId]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!coinId) return;

      const getCoinInfo = {
        coinId: coinId,
        interval: selectedTimeframe,
        dataType: chartData,
      };

      console.log("The historical data we are requesting: ", getCoinInfo)

      try {
        const response = await onGetCoinChartData(getCoinInfo);
        console.log("Chart data:", response.data);
        // Handle chart data here
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchChartData();
  }, [coinId, selectedTimeframe, chartData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(3)}B`;
    }
    if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(3)}M`;
    }
    return formatPrice(num);
  };

  const formatSupply = (supply: number) => {
    if (supply >= 1e9) {
      return `${(supply / 1e9).toFixed(3)}B`;
    }
    if (supply >= 1e6) {
      return `${(supply / 1e6).toFixed(3)}M`;
    }
    return supply.toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!coin) {
    return <div className="error">Coin not found</div>;
  }

  const timeframes = ["1D", "7D", "1M", "6M", "1Y", "All"];

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  const handleChartTypeChange = (type: string) => {
    setChartData(type);
  };

  return (
    <>
      <Header />
      <div className='coin-details-container'>
        <div className='coin-content'>
          <div className='coin-main'>
            <div className='coin-header'>
              <div className='coin-title'>
                <img
                  src={coin.image.large}
                  alt={coin.name}
                  className='coin-logo'
                />
                <div>
                  <h1>
                    {coin.name}{" "}
                    <span className='coin-ticker'>{coin.symbol.toUpperCase()}</span>
                  </h1>
                  <div className='coin-meta'>
                    <span>Rank: #{coin.market_cap_rank}</span>
                  </div>
                </div>
              </div>
              <div className='coin-price-header'>
                <h2>{formatPrice(coin.market_data.current_price.usd)}</h2>
                <span
                  className={
                    coin.market_data.price_change_percentage_24h >= 0
                      ? "positive"
                      : "negative"
                  }>
                  {coin.market_data.price_change_percentage_24h >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(coin.market_data.price_change_percentage_24h).toFixed(2)}%
                </span>
              </div>
            </div>

            <div className='chart-section'>
              <div className='chart-controls'>
                <div className='chart-tabs'>
                  <button
                    className={`tab-btn ${chartData === "Price" ? "active" : ""}`}
                    onClick={() => handleChartTypeChange("Price")}
                  >
                    Price
                  </button>
                  <button
                    className={`tab-btn ${chartData === "Market Cap" ? "active" : ""}`}
                    onClick={() => handleChartTypeChange("Market Cap")}
                  >
                    Market Cap
                  </button>
                </div>
                <div className='timeframe-buttons'>
                  {timeframes.map((tf) => (
                    <button
                      key={tf}
                      className={`timeframe-btn ${
                        selectedTimeframe === tf ? "active" : ""
                      }`}
                      onClick={() => handleTimeframeChange(tf)}>
                      {tf}
                    </button>
                  ))}
                  <button className='expand-btn'>⛶</button>
                </div>
              </div>
              <div className='chart-placeholder'>
                <div className='chart-line'></div>
              </div>
            </div>

            <div className='markets-section'>
              <div className='markets-header'>
                <h3>{coin.name} Markets</h3>
                <div className='markets-filters'>
                  <button className='filter-btn-small active'>ALL</button>
                  <button className='filter-btn-small'>CEX</button>
                  <button className='filter-btn-small'>DEX</button>
                  <button className='filter-btn-small'>All pairs ▼</button>
                </div>
              </div>
              <table className='markets-table'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Pair</th>
                    <th>Exchange</th>
                    <th>Price</th>
                    <th>+2 Depth</th>
                    <th>-2 Depth</th>
                    <th>Volume (24H)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td className='pair-cell'>
                      <img
                        src={`https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png`}
                        alt='Binance'
                        className='exchange-icon'
                      />
                      Binance
                    </td>
                    <td>BTC/{coin.symbol.toUpperCase()}</td>
                    <td>{formatPrice(coin.market_data.current_price.usd)}</td>
                    <td>$15,956,846</td>
                    <td>$17,291,960</td>
                    <td>$750,025,552</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className='coin-sidebar'>
            <div className='overview-card'>
              <h3>Overview</h3>
              <div className="portfolio-btns">
                <button className='track-btn'>
                  <GrLineChart /> Track in portfolio
                </button>
                <button className="watchlist-btn">
                  <PiStarBold />
                </button>
              </div>

              <div className='range-section'>
                <h4>24h range</h4>
                <div className='range-bar'>
                  <div 
                    className='range-fill'
                    style={{
                      width: `${((coin.market_data.current_price.usd - coin.market_data.low_24h.usd) / 
                        (coin.market_data.high_24h.usd - coin.market_data.low_24h.usd)) * 100}%`
                    }}
                  ></div>
                </div>
                <div className='range-values'>
                  <span>{formatPrice(coin.market_data.low_24h.usd)}</span>
                  <span>{formatPrice(coin.market_data.high_24h.usd)}</span>
                </div>
              </div>

              <div className='stats-list'>
                <div className='stat-item'>
                  <span className='stat-label'>
                    Market cap <span className='info-icon'>ⓘ</span>
                  </span>
                  <span className='stat-value'>
                    <span className={coin.market_data.market_cap_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
                      {coin.market_data.market_cap_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(coin.market_data.market_cap_change_percentage_24h).toFixed(2)}%
                    </span>{" "}
                    {formatLargeNumber(coin.market_data.market_cap.usd)}
                  </span>
                </div>

                <div className='stat-item'>
                  <span className='stat-label'>
                    Volume (24h) <span className='info-icon'>ⓘ</span>
                  </span>
                  <span className='stat-value'>
                    {formatLargeNumber(coin.market_data.total_volume.usd)}
                  </span>
                </div>

                <div className='stat-item'>
                  <span className='stat-label'>
                    Volume/Market cap (24h) <span className='info-icon'>ⓘ</span>
                  </span>
                  <span className='stat-value'>
                    {(
                      (coin.market_data.total_volume.usd / coin.market_data.market_cap.usd) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </div>

                <div className='stat-item'>
                  <span className='stat-label'>
                    Circulating supply <span className='info-icon'>ⓘ</span>
                  </span>
                  <span className='stat-value'>
                    {formatSupply(coin.market_data.circulating_supply)} {coin.symbol.toUpperCase()}
                  </span>
                </div>

                <div className='stat-item'>
                  <span className='stat-label'>
                    Total supply <span className='info-icon'>ⓘ</span>
                  </span>
                  <span className='stat-value'>
                    {formatSupply(coin.market_data.total_supply)} {coin.symbol.toUpperCase()}
                  </span>
                </div>

                <div className='stat-item'>
                  <span className='stat-label'>
                    Max supply <span className='info-icon'>ⓘ</span>
                  </span>
                  <span className='stat-value'>
                    {coin.market_data.max_supply ? formatSupply(coin.market_data.max_supply) : "∞"}
                  </span>
                </div>

                <div className='stat-item'>
                  <span className='stat-label'>
                    Fully diluted valuation <span className='info-icon'>ⓘ</span>
                  </span>
                  <span className='stat-value'>
                    {formatLargeNumber(coin.market_data.fully_diluted_valuation.usd)}
                  </span>
                </div>
              </div>

              <div className='official-links'>
                <h4>Official links</h4>
                <div className='links-buttons'>
                  {coin.links.homepage[0] && (
                    <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer" className='link-btn'>
                      <BsGlobe /> Website
                    </a>
                  )}
                  {coin.links.whitepaper && (
                    <a href={coin.links.whitepaper} target="_blank" rel="noopener noreferrer" className='link-btn'>
                      <AiOutlineFileText /> Whitepaper
                    </a>
                  )}
                  {coin.links.twitter_screen_name && (
                    <a href={`https://twitter.com/${coin.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer" className='link-btn'>
                      <BsTwitter /> Twitter
                    </a>
                  )}
                  {coin.links.twitter_screen_name && (
                    <a href={`${coin.links.subreddit_url}`} target="_blank" rel="noopener noreferrer" className='link-btn'>
                      <FcReddit /> Subreddit
                    </a>
                  )}
                </div>
              </div>

              <div className='converter-section'>
                <h4>Converter</h4>
                <div className='converter-input'>
                  <input type='text' value={coin.symbol.toUpperCase()} readOnly />
                  <span>⇅</span>
                </div>
                <div className='converter-input'>
                  <input type='text' value='USD' readOnly />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoinDetails;
