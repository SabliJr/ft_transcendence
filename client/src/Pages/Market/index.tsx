import "./market.css";
import { useEffect, useState } from "react";
import { onGetCoins } from "../../API/endpoints";
import { useNavigate } from "react-router-dom";

import { RiFilter2Line } from "react-icons/ri";
import { BsSearch } from "react-icons/bs";

import Header from "../../LandingPage/TheHeader/index";
import Footer from "../../LandingPage/Footer/index";

interface CoinData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  total_supply: number;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
      market_cap: number;
    };
  };
}

const Index = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await onGetCoins();
        console.log("d:", data.data);
        setCoins(data.data);
      } catch (error) {
        console.error("Failed to fetch coins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  console.log(coins);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    }
    if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return formatPrice(marketCap);
  };

  const formatSupply = (supply: number) => {
    if (supply >= 1e9) {
      return `${(supply / 1e9).toFixed(2)}B`;
    }
    if (supply >= 1e6) {
      return `${(supply / 1e6).toFixed(2)}M`;
    }
    return supply.toLocaleString();
  };

  const handleCoinClick = (coinId: number) => {
    navigate(`/market/coin/${coinId}`);
  };

  return (
    <main>
      <Header />
      <div className="market-container">
        <div className="market-header">
          <h1>Cryptocurrency Market</h1>
          <div className="market-controls">
            <div className="search-bar">
              <BsSearch className="search-icon" />
              <input type="text" placeholder="Search assets..." />
            </div>
            <button className="filter-btn">
              <RiFilter2Line />
              Filter
            </button>
          </div>
        </div>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="market-table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Price</th>
                    <th>24h Change</th>
                    <th>Market Cap</th>
                    <th>Total Supply</th>
                    <th>Markets</th>
                  </tr>
                </thead>
                <tbody>
                  {coins.map((coin) => (
                    <tr
                      key={coin.id}
                      onClick={() => handleCoinClick(coin.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="product-cell">
                        <div className="product-info">
                          <img
                            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
                            alt={coin.name}
                            className="coin-icon"
                          />
                          <div>
                            <div className="coin-symbol">{coin.symbol}</div>
                            <div className="coin-name">{coin.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="price-cell">
                        {formatPrice(coin.quote.USD.price)}
                      </td>
                      <td className="change-cell">
                        <span
                          className={
                            coin.quote.USD.percent_change_24h >= 0
                              ? "positive"
                              : "negative"
                          }
                        >
                          {coin.quote.USD.percent_change_24h >= 0 ? "+" : ""}
                          {coin.quote.USD.percent_change_24h.toFixed(2)}%
                        </span>
                      </td>
                      <td className="market-cap-cell">
                        {formatMarketCap(coin.quote.USD.market_cap)}
                      </td>
                      <td className="supply-cell">
                        {formatSupply(coin.total_supply)}
                      </td>
                      <td className="markets-cell">
                        <div className="sparkline"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                1
              </button>
              <button
                className="page-btn"
                onClick={() => setCurrentPage(2)}
                disabled={currentPage === 2}
              >
                2
              </button>
              <button
                className="page-btn"
                onClick={() => setCurrentPage(3)}
                disabled={currentPage === 3}
              >
                3
              </button>
              <button
                className="page-btn"
                onClick={() => setCurrentPage(4)}
                disabled={currentPage === 4}
              >
                4
              </button>
              <button
                className="page-btn"
                onClick={() => setCurrentPage(5)}
                disabled={currentPage === 5}
              >
                5
              </button>
              <span className="page-dots">...</span>
            </div>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default Index;
