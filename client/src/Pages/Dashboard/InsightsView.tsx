import React, { useState } from 'react';
import './InsightsView.css';
import { FaHeart, FaRegHeart, FaRegCommentDots } from 'react-icons/fa';
import { BiUser } from 'react-icons/bi';

// Mock Data
const mockPosts = [
  {
    id: 1,
    author: 'CryptoWhale',
    avatar: 'CW',
    timestamp: '2 hours ago',
    content: "Just took a deep dive into the latest layer-2 scaling solutions. Optimism's recent updates are a game-changer for DeFi protocols struggling with high gas fees. The potential for near-instant transactions at a fraction of the cost is huge. Keeping a close eye on $OP.",
    tags: [{type: 'asset', label: 'BTC'}, {type: 'topic', label: 'DeFi'}, {type: 'topic', label: 'Scaling'}],
    likes: 128,
    comments: [
      { author: 'DeFi_Dan', text: 'Totally agree. The UX improvement alone will onboard so many new users.'},
      { author: 'GasWatcher', text: 'What are your thoughts on Arbitrum as a competitor?'},
    ]
  },
  {
    id: 2,
    author: 'DiamondHands',
    avatar: 'DH',
    timestamp: '5 hours ago',
    content: "Unpopular opinion: The market is getting overly excited about short-term gains. My strategy remains unchanged: dollar-cost averaging into solid projects and holding for the long term. Volatility is the price you pay for life-changing returns. Don't get shaken out.",
    tags: [{type: 'asset', label: 'ETH'}, {type: 'topic', label: 'Long-term'}, {type: 'topic', label: 'Strategy'}],
    likes: 256,
    comments: []
  },
  {
    id: 3,
    author: 'NFT_Hunter',
    avatar: 'NH',
    timestamp: '1 day ago',
    content: "The intersection of AI and NFTs is a space not enough people are talking about. Imagine dynamic NFTs that evolve based on real-world data, or AI-generated art that is truly unique and verifiable on-chain. This is the next frontier of digital ownership.",
    tags: [{type: 'topic', label: 'NFTs'}, {type: 'topic', label: 'AI'}, {type: 'topic', label: 'Innovation'}],
    likes: 89,
    comments: [
        { author: 'ArtCollector', text: 'This is fascinating. Any projects you recommend looking into?' }
    ]
  },
];

const trendingAssets = ['Solana (SOL)', 'Chainlink (LINK)', 'Avalanche (AVAX)'];
const popularTopics = ['Memecoins', 'Regulation', 'Staking', 'Security'];


const CommentsSection = ({ comments }) => (
    <div className="comments-section">
        {comments.map((comment, index) => (
            <div key={index} className="comment">
                <div className="comment-avatar"><BiUser /></div>
                <div className="comment-content">
                    <span className="comment-author">{comment.author}</span>
                    <p className="comment-text">{comment.text}</p>
                </div>
            </div>
        ))}
        <div className="comment-input-container">
            <input type="text" placeholder="Add a comment..." className="comment-input" />
            <button className="comment-submit-btn">Post</button>
        </div>
    </div>
);

const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [commentsOpen, setCommentsOpen] = useState(false);

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="post-avatar">{post.avatar}</div>
                <div className="post-author-info">
                    <span className="post-author-name">{post.author}</span>
                    <span className="post-timestamp">{post.timestamp}</span>
                </div>
            </div>
            <p className="post-content">{post.content}</p>
            <div className="post-tags">
                {post.tags.map(tag => (
                    <span key={tag.label} className={`tag ${tag.type}-tag`}>{tag.label}</span>
                ))}
            </div>
            <div className="post-actions">
                <div className="action-item" onClick={() => setLiked(!liked)}>
                    {liked ? <FaHeart style={{ color: 'red' }} /> : <FaRegHeart />}
                    <span>{liked ? post.likes + 1 : post.likes}</span>
                </div>
                <div className="action-item" onClick={() => setCommentsOpen(!commentsOpen)}>
                    <FaRegCommentDots />
                    <span>{post.comments.length} Comments</span>
                </div>
            </div>
            {commentsOpen && <CommentsSection comments={post.comments} />}
        </div>
    )
}

const InsightsView = () => {
    const [activeSort, setActiveSort] = useState('Latest');
    const sortOptions = ['Latest', 'Trending', 'Following'];

    return (
        <div className="insights-view">
            <div className="insights-header">
                <h2>Insights</h2>
                <p>Discuss crypto assets, market trends, and investment strategies with the community.</p>
                <div className="sort-controls">
                    {sortOptions.map(option => (
                        <div
                            key={option}
                            className={`sort-option ${activeSort === option ? 'active' : ''}`}
                            onClick={() => setActiveSort(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>
            <div className="insights-content">
                <div className="feed-container">
                    {mockPosts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
                <aside className="secondary-area">
                    <h3>Trending Assets</h3>
                    <ul className="trending-list">
                        {trendingAssets.map(asset => <li key={asset}>{asset}</li>)}
                    </ul>
                    <h3 style={{marginTop: '2rem'}}>Popular Topics</h3>
                    <ul className="trending-list">
                        {popularTopics.map(topic => <li key={topic}>{topic}</li>)}
                    </ul>
                </aside>
            </div>
        </div>
    );
};

export default InsightsView;
