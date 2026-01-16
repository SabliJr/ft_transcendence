import React, { useState } from 'react';
import './PortfolioView.css';
import { FaBtc, FaEthereum, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { SiBinance } from "react-icons/si";

const PortfolioView = () => {
    const [activeTimeRange, setActiveTimeRange] = useState('7D');
    const timeRanges = ['1D', '7D', '1M', '3M', '1Y'];

    const topAssets = [
      {
        name: "Bitcoin",
        symbol: "BTC",
        icon: <FaBtc style={{ color: "#f7931a" }} />,
        value: "$68,345.12",
        change: "+2.1%",
        status: "positive",
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        icon: <FaEthereum style={{ color: "#627eea" }} />,
        value: "$3,456.89",
        change: "+1.8%",
        status: "positive",
      },
      {
        name: "Binance Coin",
        symbol: "BNB",
        icon: <SiBinance style={{ color: "#f0b90b" }} />,
        value: "$589.45",
        change: "-0.5%",
        status: "negative",
      },
    ];

    const recentTransactions = [
        { type: 'Sent', asset: 'BTC', amount: '0.05 BTC', usdValue: '$3,417.25', timestamp: '2h ago', status: 'sent' },
        { type: 'Received', asset: 'ETH', amount: '1.2 ETH', usdValue: '$4,148.27', timestamp: '1d ago', status: 'received' },
        { type: 'Sent', asset: 'BNB', amount: '10.5 BNB', usdValue: '$6,189.22', timestamp: '3d ago', status: 'sent' }
    ];

    return (
        <div className="portfolio-view">
            {/* 1. Portfolio Overview Header */}
            <div className="portfolio-card overview-header">
                <div className="overview-header-left">
                    <div className="portfolio-name">
                        <h2>My Main Portfolio</h2>
                    </div>
                    <div className="portfolio-value">
                        <h3>Total Value</h3>
                        <p className="value">$135,356.04</p>
                    </div>
                    <div className="portfolio-performance">
                        <h3>24h Change</h3>
                        <p className="change positive">+$2,367.53 (+1.8%)</p>
                    </div>
                </div>
                <div className="overview-header-right">
                    <div className="time-selector">
                        {timeRanges.map(range => (
                            <div 
                                key={range}
                                className={`time-option ${activeTimeRange === range ? 'active' : ''}`}
                                onClick={() => setActiveTimeRange(range)}
                            >
                                {range}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. Performance Chart & Key Stats */}
            <div className="performance-section">
                <div className="portfolio-card performance-chart">
                     <div className="chart-placeholder">
                        <p>Portfolio Performance Chart Placeholder</p>
                    </div>
                </div>
                <div className="performance-stats">
                    <div className="stat-item">
                        <h4>Portfolio Return</h4>
                        <p className="value change positive">+$12,450.10</p>
                    </div>
                     <div className="stat-item">
                        <h4>Best Performer</h4>
                        <p className="value">Bitcoin</p>
                    </div>
                     <div className="stat-item">
                        <h4>Worst Performer</h4>
                        <p className="value">Binance Coin</p>
                    </div>
                     <div className="stat-item">
                        <h4>Volatility</h4>
                        <p className="value">Low (2.1%)</p>
                    </div>
                </div>
            </div>

            {/* 3. Daily Highlights Section */}
            <div className="highlights-section">
                <div className="portfolio-card top-performers">
                    <h3>Top Performers Today</h3>
                    <div className="top-performers-list">
                        {topAssets.map(asset => (
                            <div key={asset.symbol} className="asset-item">
                                <div className="asset-icon">{asset.icon}</div>
                                <div className="asset-info">
                                    <p className="name">{asset.name}</p>
                                    <p className="value">{asset.value}</p>
                                </div>
                                <div className="asset-performance">
                                    <p className={`change ${asset.status}`}>{asset.change}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="portfolio-card activity-panel">
                    <h3>Recent Activity</h3>
                    <div className="activity-panel-list">
                        {recentTransactions.map(tx => (
                             <div key={tx.timestamp} className="transaction-item">
                                 <div className={`transaction-icon ${tx.status}`}>
                                     {tx.status === 'sent' ? <FaArrowUp /> : <FaArrowDown />}
                                 </div>
                                 <div className="transaction-info">
                                     <p className="type">{tx.type} {tx.asset}</p>
                                     <p className="timestamp">{tx.timestamp}</p>
                                 </div>
                                 <div className="transaction-amount">
                                     <p className="value">{tx.amount}</p>
                                     <p className="usd-value">{tx.usdValue}</p>
                                 </div>
                             </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioView;
