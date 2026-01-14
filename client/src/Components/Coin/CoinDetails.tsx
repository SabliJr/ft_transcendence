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
import Footer from "../../LandingPage/Footer/index";
import CoinChart from "../CoinChart";

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
  description: {
    en: string;
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

interface ChartDataPoint {
  timestamp: number;
  value: number;
}

const CoinDetails = () => {
  const { id: coinId } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<CoinDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("7D");
  const [chartType, setChartType] = useState("Price");
  const [chartDataPoints, setChartDataPoints] = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [isChartFullscreen, setIsChartFullscreen] = useState(false);
  const [coinAmount, setCoinAmount] = useState<string>("1");
  const [usdAmount, setUsdAmount] = useState<string>("");
  const [isUsdFirst, setIsUsdFirst] = useState(false);

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

      setChartLoading(true);
      const getCoinInfo = {
        coinId: coinId,
        interval: selectedTimeframe,
        dataType: chartType,
      };

      console.log("The historical data we are requesting: ", getCoinInfo)

      try {
        const response = await onGetCoinChartData(getCoinInfo);
        console.log("Chart data:", response.data);
        setChartDataPoints(response.data.chartData || []);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartData();
  }, [coinId, selectedTimeframe, chartType]);

  // Update USD amount when coin data loads or coin amount changes
  useEffect(() => {
    if (coin && coinAmount && !isUsdFirst) {
      const numericCoinAmount = parseFloat(coinAmount) || 0;
      const converted = numericCoinAmount * coin.market_data.current_price.usd;
      setUsdAmount(converted.toFixed(2));
    }
  }, [coin]);

  const handleToggleFullscreen = () => {
    setIsChartFullscreen(!isChartFullscreen);
  };

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

  const handleCoinAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setCoinAmount(value);
      if (coin && value) {
        const numericValue = parseFloat(value) || 0;
        const converted = numericValue * coin.market_data.current_price.usd;
        setUsdAmount(converted.toFixed(2));
      } else {
        setUsdAmount("");
      }
    }
  };

  const handleUsdAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setUsdAmount(value);
      if (coin && value) {
        const numericValue = parseFloat(value) || 0;
        const converted = numericValue / coin.market_data.current_price.usd;
        setCoinAmount(converted.toFixed(6));
      } else {
        setCoinAmount("");
      }
    }
  };

  const handleSwapAmounts = () => {
    setIsUsdFirst(!isUsdFirst);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!coin) {
    return <div className="error">Coin not found</div>;
  }

  const timeframes = ["1D", "7D", "1M", "6M", "1Y"];

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  const handleChartTypeChange = (type: string) => {
    setChartType(type);
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
                    className={`tab-btn ${chartType === "Price" ? "active" : ""}`}
                    onClick={() => handleChartTypeChange("Price")}
                  >
                    Price
                  </button>
                  <button
                    className={`tab-btn ${chartType === "Market Cap" ? "active" : ""}`}
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
                  <button className='expand-btn' onClick={handleToggleFullscreen}>⛶</button>
                </div>
              </div>
              <CoinChart 
                data={chartDataPoints} 
                loading={chartLoading} 
                timeframe={selectedTimeframe}
                isFullscreen={isChartFullscreen}
                onToggleFullscreen={handleToggleFullscreen}
              />
            </div>

            <div className='description-section'>
              <h3>About {coin.name}</h3>
              <div 
                className='description-content'
                dangerouslySetInnerHTML={{ __html: coin.description?.en || 'No description available.' }}
              />
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
                  {coin.links.subreddit_url && (
                    <a href={`${coin.links.subreddit_url}`} target="_blank" rel="noopener noreferrer" className='link-btn'>
                      <FcReddit /> Subreddit
                    </a>
                  )}
                </div>
              </div>

              <div className='converter-section'>
                <h4>Converter</h4>
                {isUsdFirst ? (
                  <>
                    <div className='converter-input'>
                      <input 
                        type='text' 
                        value={usdAmount}
                        onChange={handleUsdAmountChange}
                        placeholder="0"
                      />
                      <span className='currency-label'>USD</span>
                    </div>
                    <button className='swap-btn' onClick={handleSwapAmounts}>⇅</button>
                    <div className='converter-input'>
                      <input 
                        type='text' 
                        value={coinAmount}
                        onChange={handleCoinAmountChange}
                        placeholder="0"
                      />
                      <span className='currency-label'>{coin.symbol.toUpperCase()}</span>
                    </div>
                    <div className='converter-rate'>
                      $1 USD = {(1 / coin.market_data.current_price.usd).toFixed(6)} {coin.symbol.toUpperCase()}
                    </div>
                  </>
                ) : (
                  <>
                    <div className='converter-input'>
                      <input 
                        type='text' 
                        value={coinAmount}
                        onChange={handleCoinAmountChange}
                        placeholder="0"
                      />
                      <span className='currency-label'>{coin.symbol.toUpperCase()}</span>
                    </div>
                    <button className='swap-btn' onClick={handleSwapAmounts}>⇅</button>
                    <div className='converter-input'>
                      <input 
                        type='text' 
                        value={usdAmount}
                        onChange={handleUsdAmountChange}
                        placeholder="0"
                      />
                      <span className='currency-label'>USD</span>
                    </div>
                    <div className='converter-rate'>
                      1 {coin.symbol.toUpperCase()} = {formatPrice(coin.market_data.current_price.usd)}
                    </div>
                  </>
                )}
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
