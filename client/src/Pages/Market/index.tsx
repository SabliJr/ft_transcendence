import "./market.css";
import { useEffect, useState } from "react";
import { onGetCoins } from "../../API/endpoints";
import { useNavigate } from "react-router-dom";

import { RiFilter2Line } from "react-icons/ri";
import { BsSearch } from "react-icons/bs";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  last_updated: string;
  high_24h: number;
  low_24h: number;
}

type SortField = 'name' | 'current_price' | 'price_change_percentage_24h' | 'market_cap' | 'total_supply' | null;
type SortDirection = 'asc' | 'desc';

interface MarketProps {
  basePath?: string;
}

const Index = ({ basePath = '/market' }: MarketProps) => {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<CoinData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const data = await onGetCoins(currentPage);
        console.log("d:", data.data);
        setCoins(data.data);
        setFilteredCoins(data.data);
      } catch (error) {
        console.error("Failed to fetch coins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [currentPage]);

  useEffect(() => {
    let filtered = coins.filter((coin) => {
      const lowercasedQuery = searchQuery.toLowerCase();
      return (
        coin.name.toLowerCase().includes(lowercasedQuery) ||
        coin.symbol.toLowerCase().includes(lowercasedQuery)
      );
    });

    // Apply sorting
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = (bVal as string).toLowerCase();
          return sortDirection === 'asc' 
            ? (aVal as string).localeCompare(bVal as string)
            : (bVal as string).localeCompare(aVal as string);
        }
        
        return sortDirection === 'asc' 
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      });
    }

    setFilteredCoins(filtered);
  }, [searchQuery, coins, sortField, sortDirection]);

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

  const handleCoinClick = (coinId: string) => {
    navigate(`${basePath}/coin/${coinId}`);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setActiveFilter(null);
  };

  const applyFilter = (filter: string) => {
    if (filter === "top-gainers") {
      setSortField('price_change_percentage_24h');
      setSortDirection('desc');
    } else if (filter === "highest-market-cap") {
      setSortField('market_cap');
      setSortDirection('desc');
    } else if (filter === "highest-volume") {
      setSortField('total_supply');
      setSortDirection('desc');
    }
    setActiveFilter(filter);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSortField(null);
    setSortDirection('desc');
    setActiveFilter(null);
    setFilteredCoins(coins);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <TiArrowSortedUp /> : <TiArrowSortedDown />;
  };

  const getPaginationGroup = () => {
    const totalPages = 10;
    const visiblePages = 5;
    
    let startPage: number;
    let endPage: number;
    
    if (currentPage <= 3) {
      // At the beginning, show pages 1-5
      startPage = 1;
      endPage = visiblePages;
    } else if (currentPage >= totalPages - 2) {
      // At the end, show pages 6-10
      startPage = totalPages - visiblePages + 1;
      endPage = totalPages;
    } else {
      // In the middle, center the current page
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return { pages, startPage, endPage, totalPages };
  };

  const renderMiniRangeChart = (coin: CoinData) => {
    const width = 120;
    const height = 40;
    const padding = 4;
    
    // This simple 3-point line: low -> current -> simulated mid-point
    // Since we only have low, high, current, we'll create a simple visualization
    const low = coin.low_24h;
    const high = coin.high_24h;
    const current = coin.current_price;
    const range = high - low || 1;
    
    // Normalize values to chart coordinates
    const getY = (value: number) => {
      const normalized = (value - low) / range;
      return height - padding - (normalized * (height - padding * 2));
    };
    
    // Making a simple 5-point path to simulate price movement
    const points = [
      { x: 0, y: getY(low + range * 0.3) },
      { x: width * 0.25, y: getY(low + range * 0.1) },
      { x: width * 0.5, y: getY(low + range * 0.6) },
      { x: width * 0.75, y: getY(low + range * 0.4) },
      { x: width, y: getY(current) },
    ];
    
    const linePath = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');
    
    const areaPath = `${linePath} L ${width} ${height - padding} L 0 ${height - padding} Z`;
    
    // Determine color based on whether current is above or below the midpoint
    const isPositive = current >= low + range * 0.5;
    const strokeColor = isPositive ? '#16c784' : '#ea3943';
    const gradientId = `mini-gradient-${coin.id}`;
    
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mini-line-chart">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} />
        
        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <main>
      <div className="market-container">
        <div className="market-header">
          <h1>Cryptocurrency Market</h1>
          <div className="market-controls">
            <div className="search-bar">
              <BsSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-wrapper">
              <button
                className={`filter-btn ${activeFilter ? 'active' : ''}`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <RiFilter2Line />
                {activeFilter ? activeFilter.replace('-', ' ') : 'Filter'}
              </button>
              {isFilterOpen && (
                <div className="filter-dropdown">
                  <ul>
                    <li 
                      onClick={() => applyFilter("top-gainers")}
                      className={activeFilter === 'top-gainers' ? 'active' : ''}
                    >
                      Top Gainers
                    </li>
                    <li 
                      onClick={() => applyFilter("highest-market-cap")}
                      className={activeFilter === 'highest-market-cap' ? 'active' : ''}
                    >
                      Highest Market Cap
                    </li>
                    <li 
                      onClick={() => applyFilter("highest-volume")}
                      className={activeFilter === 'highest-volume' ? 'active' : ''}
                    >
                      Highest Volume
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {(searchQuery || sortField || activeFilter) && (
              <button className="clear-btn" onClick={clearFilters}>
                Clear
              </button>
            )}
          </div>
        </div>
        
        {/* Results count */}
        <div className="results-info">
          Showing {filteredCoins.length} of {coins.length} assets
          {searchQuery && <span> matching "{searchQuery}"</span>}
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="market-table">
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleSort('name')}>
                      Asset {renderSortIcon('name')}
                    </th>
                    <th className="sortable" onClick={() => handleSort('current_price')}>
                      Price {renderSortIcon('current_price')}
                    </th>
                    <th className="sortable" onClick={() => handleSort('price_change_percentage_24h')}>
                      24h Change {renderSortIcon('price_change_percentage_24h')}
                    </th>
                    <th className="sortable" onClick={() => handleSort('market_cap')}>
                      Market Cap {renderSortIcon('market_cap')}
                    </th>
                    <th className="sortable" onClick={() => handleSort('total_supply')}>
                      Total Supply {renderSortIcon('total_supply')}
                    </th>
                    <th>24h Range</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoins.map((coin) => (
                    <tr
                      key={coin.id}
                      onClick={() => handleCoinClick(coin.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="product-cell">
                        <div className="product-info">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="coin-icon"
                          />
                          <div>
                            <div className="coin-symbol">{coin.symbol.toUpperCase()}</div>
                            <div className="coin-name">{coin.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="price-cell">
                        {formatPrice(coin.current_price)}
                      </td>
                      <td className="change-cell">
                        <span
                          className={
                            coin.price_change_percentage_24h >= 0
                              ? "positive"
                              : "negative"
                          }
                        >
                          {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      </td>
                      <td className="market-cap-cell">
                        {formatMarketCap(coin.market_cap)}
                      </td>
                      <td className="supply-cell">
                        {formatSupply(coin.total_supply)}
                      </td>
                      <td className="markets-cell">
                        {renderMiniRangeChart(coin)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              {(() => {
                const { pages, startPage, endPage, totalPages } = getPaginationGroup();
                return (
                  <>
                    {startPage > 1 && (
                      <span 
                        className="page-dots" 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 5))}
                      >
                        ...
                      </span>
                    )}
                    {pages.map((item) => (
                      <button
                        key={item}
                        onClick={() => setCurrentPage(item)}
                        className={`page-btn ${currentPage === item ? "active" : ""}`}
                      >
                        {item}
                      </button>
                    ))}
                    {endPage < totalPages && (
                      <span 
                        className="page-dots" 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 5))}
                      >
                        ...
                      </span>
                    )}
                  </>
                );
              })()}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Index;
