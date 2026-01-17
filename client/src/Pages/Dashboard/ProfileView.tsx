import React, { useState } from "react";
import "./ProfileView.css";

const ProfileView = () => {
  const [activeTab, setActiveTab] = useState("tweets");

  return (
    <div className="profile-view">
      <div className="profile-header">
        <div
          className="cover-photo"
          style={{
            backgroundImage: "url(https://placehold.co/1500x500)",
          }}></div>
        <div className="profile-details">
          <div
            className="profile-picture"
            style={{
              backgroundImage: "url(https://placehold.co/400x400)",
            }}></div>
          <button className="edit-profile-btn">Edit profile</button>
          <div className="user-info">
            <div className="name">Sabli Jr</div>
            <div className="username">@sabli_jr</div>
          </div>
          <div className="bio">
            <p>
              Frontend Developer | React | TypeScript | GraphQL | Avid learner
            </p>
          </div>
          <div className="follow-stats">
            <div>
              <span>1,234</span> Following
            </div>
            <div>
              <span>5,678</span> Followers
            </div>
          </div>
        </div>
      </div>
      <div className="profile-tabs">
        <div
          className={`profile-tab ${activeTab === "tweets" ? "active" : ""}`}
          onClick={() => setActiveTab("tweets")}>
          Tweets
        </div>
        <div
          className={`profile-tab ${activeTab === "replies" ? "active" : ""}`}
          onClick={() => setActiveTab("replies")}>
          Replies
        </div>
        <div
          className={`profile-tab ${activeTab === "likes" ? "active" : ""}`}
          onClick={() => setActiveTab("likes")}>
          Likes
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
