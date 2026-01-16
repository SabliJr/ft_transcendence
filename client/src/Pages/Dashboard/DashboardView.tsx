import React, { useState } from 'react';
import './DashboardView.css';
import { FaArrowUp, FaArrowDown, FaRegComment, FaRegHeart, FaWallet } from 'react-icons/fa';

const DashboardView = () => {
    const [activeTimeRange, setActiveTimeRange] = useState('7D');
    const timeRanges = ['1D', '7D', '1M', '3M', '1Y'];

    return (
        <div className="dashboard-view">
            
            {/* Portfolio Summary */}
            <div className="dashboard-card portfolio-summary">
                <div className="summary-item">
                    <h3>Total Value</h3>
                    <p className="value">$135,356.04</p>
                </div>
                <div className="summary-item">
                    <h3>24h Change</h3>
                    <p className="value change positive">+$2,367.53 (1.8%)</p>
                </div>
                <div className="summary-item">
                    <h3>Total Assets</h3>
                    <p className="value">5</p>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Performance Snapshot */}
                <div className="dashboard-card performance-snapshot">
                    <div className="performance-header">
                        <h3>Performance</h3>
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
                    <div className="chart-placeholder">
                        <p>Performance Chart Placeholder</p>
                    </div>
                    <div className="performance-metrics">
                        <div className="metric-item">
                            <h4>Best Performer (24h)</h4>
                            <p className="value change positive">BTC +1.8%</p>
                        </div>
                        <div className="metric-item">
                            <h4>Worst Performer (24h)</h4>
                            <p className="value change negative">LTC -1.16%</p>
                        </div>
                         <div className="metric-item">
                            <h4>Highest Balance</h4>
                            <p className="value">$762,365.76</p>
                        </div>
                    </div>
                </div>

                {/* Allocation Overview */}
                <div className="dashboard-card allocation-overview">
                    <h3>Allocation</h3>
                    <div className="allocation-chart-placeholder">
                        <p>Donut Chart</p>
                    </div>
                    <div className="allocation-legend">
                        <div className="legend-item">
                            <div className="legend-color-box" style={{backgroundColor: '#ff9900'}}></div>
                            <span>Bitcoin (BTC) - 45%</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color-box" style={{backgroundColor: '#4a90e2'}}></div>
                            <span>Ethereum (ETH) - 30%</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color-box" style={{backgroundColor: '#50e3c2'}}></div>
                            <span>Tether (USDT) - 15%</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color-box" style={{backgroundColor: '#bd10e0'}}></div>
                            <span>Other - 10%</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="dashboard-card recent-activity">
                    <h3>Recent Activity & Highlights</h3>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon social"><FaRegHeart /></div>
                            <p className="activity-text"><strong>CryptoWhale</strong> liked your insight on L2 scaling.</p>
                            <span className="activity-timestamp">2h ago</span>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon asset"><FaArrowUp /></div>
                            <p className="activity-text">You received <strong>0.02 BTC</strong> from an external wallet.</p>
                            <span className="activity-timestamp">1d ago</span>
                        </div>
                         <div className="activity-item">
                            <div className="activity-icon asset"><FaArrowDown /></div>
                            <p className="activity-text">You sent <strong>1.5 ETH</strong> to a verified exchange.</p>
                            <span className="activity-timestamp">2d ago</span>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon social"><FaRegComment /></div>
                            <p className="activity-text"><strong>DeFi_Dan</strong> commented on your post: "Totally agree. The UX improvement..."</p>
                            <span className="activity-timestamp">3d ago</span>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon portfolio"><FaWallet /></div>
                            <p className="activity-text">Your 'Yield Farming' portfolio was rebalanced successfully.</p>
                            <span className="activity-timestamp">4d ago</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardView;
