import React, { useState } from "react";
import "./dashboard.css";

// Icons
import { BsBriefcase } from "react-icons/bs";
import { HiOutlineChartBar } from "react-icons/hi";
import { RiRobot2Line } from "react-icons/ri";
import { BiUser } from "react-icons/bi";
import { IoHome, IoChatbubblesOutline } from "react-icons/io5";
import { FiUser, FiPlus } from "react-icons/fi";
import {
  MdOutlineSettings,
} from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";

import DashboardLogo from "../../Assets/_La_Logo_Black.png";

// Page Components
import PortfolioView from "./PortfolioView";
import MarketView from "./MarketView";
import InsightsView from "./InsightsView";
import AIView from "./AIView";
import ChatView from "./ChatView";
import ProfileView from "./ProfileView";

// Define Page Types
type Page = "portfolio" | "market" | "insights" | "ai" | "profile" | "chat"; // Changed from analytics

const Dashboard = () => {
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState<"sidebar" | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState<Page>("insights");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleMouseDown = (resizer: "sidebar") => {
    setIsResizing(resizer);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const containerRect = document
      ?.querySelector(".dashboard-container")
      ?.getBoundingClientRect();

    if (!containerRect) return;

    if (isResizing === "sidebar") {
      const newWidth = e.clientX - containerRect.left;
      if (newWidth >= 80 && newWidth <= 400) { // Adjusted min/max width
        setSidebarWidth(newWidth);
        setSidebarCollapsed(newWidth < 180);
      }
    }
  };

  const handleMouseUp = () => {
    setIsResizing(null);
  };

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing]);

  const handlePageNavigation = (page: Page) => {
    setActivePage(page);
  };

  const getPageTitle = () => {
    switch (activePage) {
      case "portfolio":
        return "Portfolio";
      case "market":
        return "Market";
      case "insights":
        return "Home";
      case "ai":
        return "AI";
      case "profile":
        return "Profile Settings";
      case "chat":
        return "Chat";
      default:
        return "portfolio";
    }
  };
  
  const renderActiveComponent = () => {
    switch (activePage) {
      case "portfolio":
        return <PortfolioView />;
      case "market":
        return <MarketView />;
      case "insights":
        return <InsightsView />;
      case "ai":
        return <AIView />;
      case "profile":
        return <ProfileView />;
      case "chat":
        return <ChatView />;
      default:
        return <PortfolioView />;
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    if (!sidebarCollapsed) {
      setSidebarWidth(80);
    } else {
      setSidebarWidth(280);
    }
  };

  return (
    <div className='dashboard-wrapper'>
      <div className='dashboard-container'>
        {/* Sidebar */}
        <div
          className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}
          style={{ width: `${sidebarWidth}px` }}>
          <div className='_sidebar_items'>
            <div
              className={sidebarCollapsed ? "_logo_container_collap" : "logo"}
              onClick={toggleSidebar}
              style={{ cursor: "pointer" }}>
              {sidebarCollapsed ? (
                <img
                  src={DashboardLogo}
                  alt='Yieldbook Logo'
                  className='_dashboard_logo_collapsed'
                />
              ) : (
                <>
                  <img
                    src={DashboardLogo}
                    alt='Yieldbook Logo'
                    className='_dashboard_logo'
                  />
                  <h1 className='logo-text'>
                    Yield<span>book</span>
                  </h1>
                </>
              )}
            </div>
            <nav className='sidebar-nav'>
            <div
                className={`nav-item ${
                  activePage === "insights" ? "active" : ""
                }`}
                title='Home'
                onClick={() => handlePageNavigation("insights")}>
                <IoHome className='_sidebar_icons' />
                {!sidebarCollapsed && <span>Home</span>}
              </div>
              <div
                className={`nav-item ${
                  activePage === "market" ? "active" : ""
                }`}
                title='Market'
                onClick={() => handlePageNavigation("market")}>
                <HiOutlineChartBar className='_sidebar_icons' />
                {!sidebarCollapsed && <span>Market</span>}
              </div>
              <div
                className={`nav-item ${
                  activePage === "portfolio" ? "active" : ""
                }`}
                title='Portfolio'
                onClick={() => handlePageNavigation("portfolio")}>
                <BsBriefcase className='_sidebar_icons' />
                {!sidebarCollapsed && <span>Portfolio</span>}
              </div>
              <div
                className={`nav-item ${activePage === "ai" ? "active" : ""}`}
                title='AI'
                onClick={() => handlePageNavigation("ai")}>
                <RiRobot2Line className='_sidebar_icons' />
                {!sidebarCollapsed && <span>AI</span>}
              </div>
              <div
                className={`nav-item ${
                  activePage === "chat" ? "active" : ""
                }`}
                title='Chat'
                onClick={() => handlePageNavigation("chat")}>
                <IoChatbubblesOutline className='_sidebar_icons' />
                {!sidebarCollapsed && <span>Chat</span>}
              </div>
              <div
                className={`nav-item ${
                  activePage === "profile" ? "active" : ""
                }`}
                title='Profile'
                onClick={() => handlePageNavigation("profile")}>
                <FiUser className='_sidebar_icons' />
                {!sidebarCollapsed && <span>Profile</span>}
              </div>
              <button className="post-button">
                <FiPlus className='post-button-icon' />
                {!sidebarCollapsed && <span>Post</span>}
              </button>
            </nav>

            {/* Spacer to push user info to bottom */}
            <div style={{ flex: 1 }}></div>

            <div
              className={
                sidebarCollapsed ? "_side_user_info_collap" : "user-info"
              }
              onClick={() => setShowLogoutPopup(!showLogoutPopup)}
              style={{ cursor: "pointer" }}
              title='Profile Settings'>
              <div
                className={
                  sidebarCollapsed ? "_collap_user_avatar" : "user-avatar"
                }>
                <BiUser className='_side_prifile_icons ' />
              </div>
              {!sidebarCollapsed && (
                <div className="user-details">
                  <span className='username'>Sabli Jr</span>
                  <span className="user-handle">@sabli_jr</span>
                </div>
              )}
            </div>
            {showLogoutPopup && (
              <div className="logout-popup">
                <button className="logout-button">Logout</button>
              </div>
            )}
          </div>
          <div
            className='resize-handle sidebar-resize'
            onMouseDown={() => handleMouseDown("sidebar")}></div>
        </div>
        {/* Main Content Area with Header */}
        <div className='dasboard_main-content '>
          {/* Dashboard Header */}
          <div className='dashboard-header'>
            <div className='breadcrumb'>
              <span>Pages</span>
              <span className='breadcrumb-separator'>/</span>
              <span>{getPageTitle()}</span>
            </div>
            <div className='header-actions'>
              <IoMdNotificationsOutline
                className='_dashboard_header_icons'
                title='Notifications'
              />
              <MdOutlineSettings
                className='_dashboard_header_icons'
                title='Settings'
              />
            </div>
          </div>

          {/* Dynamic Component Rendering */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

