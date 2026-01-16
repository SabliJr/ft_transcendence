import React, { useState } from "react";
import "./dashboard.css";

// Icons
import {
  MdOutlineSpaceDashboard,
  MdOutlineNotificationsNone,
} from "react-icons/md";
import { BsBriefcase, BsChatDots } from "react-icons/bs";
import { HiOutlineChartBar } from "react-icons/hi";
import { FiMessageSquare } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { BiUser } from "react-icons/bi";

import DashboardLogo from "../../Assets/_La_Logo_Black.png";

// Page Components
import DashboardView from "./DashboardView";
import PortfolioView from "./PortfolioView";
import MarketView from "./MarketView";
import InsightsView from "./InsightsView";
import AIView from "./AIView"; // Changed from AnalyticsView

// Define Page Types
type Page = "dashboard" | "portfolio" | "market" | "insights" | "ai" | "profile"; // Changed from analytics

const Dashboard = () => {
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState<"sidebar" | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState<Page>("dashboard");

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
      case "dashboard":
        return "Dashboard";
      case "portfolio":
        return "Portfolio";
      case "market":
        return "Market";
      case "insights":
        return "Insights";
      case "ai":
        return "AI"; // Changed from analytics
      case "profile":
        return "Profile Settings";
      default:
        return "Dashboard";
    }
  };
  
  const renderActiveComponent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardView />;
      case "portfolio":
        return <PortfolioView />;
      case "market":
        return <MarketView />;
      case "insights":
        return <InsightsView />;
      case "ai":
        return <AIView />; // Changed from AnalyticsView
      case "profile":
        return <div style={{padding: "2rem"}}><h2>Profile Settings</h2><p>User profile and settings placeholder.</p></div>; // Placeholder for profile
      default:
        return <DashboardView />;
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
              {/* Navigation Items */}
              <div
                className={`nav-item ${
                  activePage === "dashboard" ? "active" : ""
                }`}
                title='Dashboard'
                onClick={() => handlePageNavigation("dashboard")}>
                <MdOutlineSpaceDashboard className='_sidebar_icons' />
                {!sidebarCollapsed && <span>Dashboard</span>}
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
                  activePage === "insights" ? "active" : ""
                }`}
                title='Insights'
                onClick={() => handlePageNavigation("insights")}>
                <FiMessageSquare className='_sidebar_icons' />
                {!sidebarCollapsed && <span>Insights</span>}
              </div>
              <div
                className={`nav-item ${
                  activePage === "ai" ? "active" : ""
                }`}
                title='AI'
                onClick={() => handlePageNavigation("ai")}>
                <RiRobot2Line className='_sidebar_icons' />
                {!sidebarCollapsed && <span>AI</span>}
              </div>
            </nav>

            {/* Spacer to push user info to bottom */}
            <div style={{ flex: 1 }}></div>

            <div
              className={
                sidebarCollapsed ? "_side_user_info_collap" : "user-info"
              }
              onClick={() => handlePageNavigation("profile")}
              style={{ cursor: "pointer" }}
              title='Profile Settings'>
              <div
                className={
                  sidebarCollapsed ? "_collap_user_avatar" : "user-avatar"
                }>
                <BiUser className='_side_prifile_icons ' />
              </div>
              {!sidebarCollapsed && <span className='username'>Sabli Jr</span>}
            </div>
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
              <BsChatDots className='_dashboard_header_icons' title='Chat' />
              <MdOutlineNotificationsNone
                className='_dashboard_header_icons'
                title='Notifications'
              />
              <div
                className='user-badge'
                onClick={() => handlePageNavigation("profile")}
                style={{ cursor: "pointer" }}
                title='Profile Settings'>
                <BiUser className='_dashboard_header_icons' />
              </div>
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
