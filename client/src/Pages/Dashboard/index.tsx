import React, { useState } from "react";
import "./Dashboard.css"

// Dashboard Pages
import Humanize from "../LandingPage/Dashboard/humanize";
import Writer from "../LandingPage/Dashboard/Writer";
import Translate from "../LandingPage/Dashboard/Translate";
import ProfileSettings from "../LandingPage/Dashboard/ProfileSettings";
import History from "../LandingPage/Dashboard/History";

// Icons:
import { FaWandMagicSparkles } from "react-icons/fa6";
import { GrArticle } from "react-icons/gr";
import { BiEditAlt, BiUser } from "react-icons/bi";
import { HiOutlineTranslate } from "react-icons/hi";
import {
  MdHistory,
  MdOutlineDarkMode,
  MdOutlineNotificationsNone,
} from "react-icons/md";

import DashboardLogo from "../Assets/_La_Logo_Black.png";

const Dashboard = () => {
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState<"sidebar" | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState<
    "humanize" | "write" | "contentStudio" | "history" | "profile" | "translate"
  >("humanize");

  // Usage data - can be hooked to backend
  const [usageData, setUsageData] = useState({
    totalCredits: 100000,
    usedCredits: 38000,
    dailyUsage: [2000, 3500, 2500, 4000, 3000, 1500, 2500], // Mon-Sun
  });

  // Function to update usage data from backend
  const updateUsageData = (newData) => {
    setUsageData(newData);
  };

  // Calculate usage percentage for line chart
  const usagePercentage =
    (usageData.usedCredits / usageData.totalCredits) * 100;

  // Format credits display
  const formatCredits = (credits: number) => {
    if (credits >= 1000) {
      return `${(credits / 1000).toFixed(0)}k`;
    }
    return credits.toString();
  };

  // Calculate daily usage bar heights (normalized to max 50px)
  const maxDailyUsage = Math.max(...usageData.dailyUsage);
  const getBarHeight = (usage: number) => {
    return (usage / maxDailyUsage) * 50;
  };

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
      if (newWidth >= 60 && newWidth <= 250) {
        setSidebarWidth(newWidth);
        if (newWidth < 180) {
          setSidebarCollapsed(true);
        } else {
          setSidebarCollapsed(false);
        }
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
  }, [isResizing, sidebarWidth]);

  const handlePageNavigation = (
    page: "humanize" | "write" | "translate" | "history" | "profile"
  ) => {
    setActivePage(page);
  };

  const getPageTitle = () => {
    switch (activePage) {
      case "humanize":
        return "Humanize";
      case "write":
        return "Write";
      case "translate":
        return "Translate";
      case "history":
        return "History";
      case "profile":
        return "Profile Settings";
      default:
        return "Humanize";
    }
  };

  const renderActiveComponent = () => {
    switch (activePage) {
      case "humanize":
        return <Humanize />;
      case "write":
        return <Writer />;
      case "translate":
        return <Translate />;
      case "history":
        return <History />;
      case "profile":
        return <ProfileSettings />;
      default:
        return <Humanize />;
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    if (!sidebarCollapsed) {
      // When collapsing, set width to collapsed size
      setSidebarWidth(80);
    } else {
      // When expanding, set width back to default
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
              {sidebarCollapsed && (
                <img
                  src={DashboardLogo}
                  alt='DashboardLogo'
                  className='_dashboard_logo_collapsed'
                />
              )}

              {!sidebarCollapsed && (
                <>
                  <img
                    src={DashboardLogo}
                    alt='DashboardLogo'
                    className='_dashboard_logo'
                  />
                  <span className='logo-text'>Humanize Writer</span>
                </>
              )}
            </div>
            <nav className='sidebar-nav'>
              <div
                className={`nav-item ${
                  activePage === "humanize" ? "active" : ""
                }`}
                title='Humanize'
                onClick={() => handlePageNavigation("humanize")}>
                <FaWandMagicSparkles className='_sidebar_icons' />
                {!sidebarCollapsed && <span>Humanize</span>}
              </div>
              <div
                className={`nav-item ${activePage === "write" ? "active" : ""}`}
                title='Write'
                onClick={() => handlePageNavigation("write")}>
                <BiEditAlt className='_sidebar_icons' />
                {!sidebarCollapsed && <span>Write</span>}
              </div>
              <div
                className={`nav-item ${
                  activePage === "translate" ? "active" : ""
                }`}
                title='Translate'
                onClick={() => handlePageNavigation("translate")}>
                <GrArticle className='_sidebar_icons' />

                {!sidebarCollapsed && <span>Content Studio</span>}
              </div>
              <div
                className={`nav-item ${
                  activePage === "translate" ? "active" : ""
                }`}
                title='Translate'
                onClick={() => handlePageNavigation("translate")}>
                <HiOutlineTranslate className='_sidebar_icons' />
                {!sidebarCollapsed && <span>Translate</span>}
              </div>

              <div
                className={`nav-item ${
                  activePage === "history" ? "active" : ""
                }`}
                title='History'
                onClick={() => handlePageNavigation("history")}>
                <MdHistory className='_sidebar_icons' />
                {!sidebarCollapsed && <span>History</span>}
              </div>
            </nav>
            {!sidebarCollapsed && (
              <>
                <div className='credits-section'>
                  <h3>Credits</h3>
                  <p className='credits-used'>
                    {formatCredits(usageData.usedCredits)}/
                    {formatCredits(usageData.totalCredits)} credits used
                  </p>

                  {/* Line Chart for Overall Usage */}
                  <div className='usage-line-chart'>
                    <div className='line-chart-container'>
                      <svg width='100%' height='40' viewBox='0 0 200 40'>
                        <defs>
                          <linearGradient
                            id='usageGradient'
                            x1='0%'
                            y1='0%'
                            x2='100%'
                            y2='0%'>
                            <stop offset='0%' stopColor='#8b5cf6' />
                            <stop
                              offset={`${usagePercentage}%`}
                              stopColor='#8b5cf6'
                            />
                            <stop
                              offset={`${usagePercentage}%`}
                              stopColor='#e5e7eb'
                            />
                            <stop offset='100%' stopColor='#e5e7eb' />
                          </linearGradient>
                        </defs>
                        <rect
                          x='0'
                          y='15'
                          width='200'
                          height='8'
                          rx='4'
                          fill='url(#usageGradient)'
                        />
                        <circle
                          cx={`${(usagePercentage / 100) * 200}`}
                          cy='19'
                          r='6'
                          fill='#8b5cf6'
                          stroke='#ffffff'
                          strokeWidth='2'
                        />
                      </svg>
                    </div>
                    <div className='usage-percentage'>
                      {usagePercentage.toFixed(1)}% used
                    </div>
                  </div>

                  {/* Bar Chart for Daily Usage */}
                  <div className='usage-chart'>
                    <div className='chart-bars'>
                      {usageData.dailyUsage.map((usage, index) => (
                        <div
                          key={index}
                          className='bar'
                          style={{ height: `${getBarHeight(usage)}px` }}
                          title={`${usage} credits`}></div>
                      ))}
                    </div>
                    <div className='chart-labels'>
                      <span>MON</span>
                      <span>TUE</span>
                      <span>WED</span>
                      <span>THU</span>
                      <span>FRI</span>
                      <span>SAT</span>
                      <span>SUN</span>
                    </div>
                  </div>

                  <button className='get-credits-btn'>Get More Credits</button>
                </div>
              </>
            )}

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
              <MdOutlineDarkMode className='_dashboard_header_icons' />
              <MdOutlineNotificationsNone className='_dashboard_header_icons' />
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
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
