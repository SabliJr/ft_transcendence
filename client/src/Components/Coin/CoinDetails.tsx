import "./coin.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { onGetCoin } from "../../API/endpoints";
import { BsGlobe, BsTwitter } from "react-icons/bs";
import { AiOutlineFileText } from "react-icons/ai";
import { GrLineChart } from "react-icons/gr";
import { PiStarBold } from "react-icons/pi";


import Header from "../../LandingPage/TheHeader/index";
import Footer from "../../LandingPage/Footer/index"

interface CoinDetailsData {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
      market_cap: number;
      volume_24h: number;
      volume_change_24h: number;
    };
  };
  total_supply: number;
  circulating_supply: number;
  max_supply: number | null;
  fully_diluted_market_cap: number;
}

const CoinDetails = () => {
  const { id: coinId } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const [coin, setCoin] = useState<CoinDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("7D");

  useEffect(() => {
    const fetchCoinDetails = async () => {
      if (!coinId) return;

      try {
        const response = await onGetCoin(coinId);
        const coinData = response.data[coinId];
        setCoin(coinData);
      } catch (error) {
        console.error("Failed to fetch coin details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetails();
  }, [coinId]);

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

  return (
    <>
      <Header />
      <div className='coin-details-container'>
        <div className='coin-content'>
          <div className='coin-main'>
            <div className='coin-header'>
              <div className='coin-title'>
                <img
                  src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
                  alt={coin.name}
                  className='coin-logo'
                />
                <div>
                  <h1>
                    {coin.name}{" "}
                    <span className='coin-ticker'>{coin.symbol}</span>
                  </h1>
                  <div className='coin-meta'>
                    <span>UCID: 825</span>
                    <span className='coin-id'>1000237 USDT</span>
                  </div>
                </div>
              </div>
              <div className='coin-price-header'>
                <h2>{formatPrice(coin.quote.USD.price)}</h2>
                <span
                  className={
                    coin.quote.USD.percent_change_24h >= 0
                      ? "positive"
                      : "negative"
                  }>
                  {coin.quote.USD.percent_change_24h >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(coin.quote.USD.percent_change_24h).toFixed(2)}%
                </span>
              </div>
            </div>

            <div className='chart-section'>
              <div className='chart-controls'>
                <div className='chart-tabs'>
                  <button className='tab-btn active'>Price</button>
                  <button className='tab-btn'>Market Cap</button>
                  {/* <button className='tab-btn'>
                    <svg width='16' height='16' viewBox='0 0 16 16'>
                      <path d='M2 2v12h12' stroke='currentColor' fill='none' />
                    </svg>
                  </button> */}
                  {/* <button className='tab-btn'>
                    <svg width='16' height='16' viewBox='0 0 16 16'>
                      <rect
                        width='3'
                        height='10'
                        x='2'
                        y='4'
                        fill='currentColor'
                      />
                      <rect
                        width='3'
                        height='14'
                        x='7'
                        y='0'
                        fill='currentColor'
                      />
                      <rect
                        width='3'
                        height='8'
                        x='12'
                        y='6'
                        fill='currentColor'
                      />
                    </svg>
                  </button> */}
                </div>
                <div className='timeframe-buttons'>
                  {timeframes.map((tf) => (
                    <button
                      key={tf}
                      className={`timeframe-btn ${
                        selectedTimeframe === tf ? "active" : ""
                      }`}
                      onClick={() => setSelectedTimeframe(tf)}>
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
                    <td>BTC/{coin.symbol}</td>
                    <td>{formatPrice(coin.quote.USD.price)}</td>
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
                  <div className='range-fill'></div>
                </div>
                <div className='range-values'>
                  <span>$0.9969</span>
                  <span>$1.00</span>
                </div>
              </div>

              <div className='stats-list'>
                <div className='stat-item'>
                  <span className='stat-label'>
                    Market cap <span className='info-icon'>ⓘ</span>
                  </span>
                  <span className='stat-value'>
                    <span className='positive'>▲ 0.01%</span>{" "}
                    {formatLargeNumber(coin.quote.USD.market_cap)}
                  </span>
                </div>

                <div className='stat-item'>
                  <span className='stat-label'>
                    Volume (24h) <span className='info-icon'>ⓘ</span>
                  </span>
                  <span className='stat-value'>
                    <span className='positive'>▲ 24.88%</span>{" "}
                    {formatLargeNumber(coin.quote.USD.volume_24h)}
                  </span>
                </div>

                <div className='stat-item'>
                  <span className='stat-label'>
                    Volume/Market cap (24h) <span className='info-icon'>ⓘ</span>
                  </span>
                  <span className='stat-value'>
                    {(
                      (coin.quote.USD.volume_24h / coin.quote.USD.market_cap) *
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
                    {formatSupply(coin.circulating_supply)} {coin.symbol}
                  </span>
                </div>

                <div className='stat-item'>
                  <span className='stat-label'>
                    Total supply <span className='info-icon'>ⓘ</span>
                  </span>
                  <span className='stat-value'>
                    {formatSupply(coin.total_supply)} {coin.symbol}
                  </span>
                </div>

                <div className='stat-item'>
                  <span className='stat-label'>
                    Max supply <span className='info-icon'>ⓘ</span>
                  </span>
                  <span className='stat-value'>
                    {coin.max_supply ? formatSupply(coin.max_supply) : "∞"}
                  </span>
                </div>
              </div>

              <div className='official-links'>
                <h4>Official links</h4>
                <div className='links-buttons'>
                  <button className='link-btn'>
                    <BsGlobe /> Website
                  </button>
                  <button className='link-btn'>
                    <AiOutlineFileText /> Whitepaper
                  </button>
                  <button className='link-btn'>
                    <BsTwitter /> Twitter
                  </button>
                </div>
              </div>

              <div className='converter-section'>
                <h4>Converter</h4>
                <div className='converter-input'>
                  <input type='text' value={coin.symbol} readOnly />
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
