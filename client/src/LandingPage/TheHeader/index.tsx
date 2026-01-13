import React, { useState, useEffect, useRef } from "react";
import { RxAvatar } from "react-icons/rx";
import { RiMenuUnfold2Line } from "react-icons/ri";
import { HiChevronRight, HiChevronDown } from "react-icons/hi";
import "./Header.css";

import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("Light");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedCurrency, setSelectedCurrency] = useState({ symbol: "$", code: "USD" });
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current?.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageOpen(false);
  };

  const handleCurrencyChange = (symbol: string, code: string) => {
    setSelectedCurrency({ symbol, code });
    setIsCurrencyOpen(false);
  };

  return (
    <div className='app-container'>
      <header className='Header'>
        <h1 className='_header_logo' onClick={() => navigate("/")}>
          Yield<span>book</span>
        </h1>

        <nav className={scrolled ? "_nav_scrolled _nav" : "_nav"}>
          <li>
            <a 
              onClick={() => navigate("/")}
              className={`_login_text ${location.pathname === "/" ? "_active_tab" : ""}`}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              onClick={() => navigate("/about")} 
              className={`_login_text ${location.pathname === "/about" ? "_active_tab" : ""}`}
            >
              About
            </a>
          </li>
          <li>
            <a 
              onClick={() => navigate("/market")} 
              className={`_login_text ${location.pathname === "/market" ? "_active_tab" : ""}`}
            >
              Market
            </a>
          </li>
        </nav>

        <div className='dropdown-wrapper' ref={dropdownRef}>
          <div
            className='_btns_container'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <RiMenuUnfold2Line className='_header_icons' />
            <RxAvatar className='_header_icons' />
          </div>

          {isDropdownOpen && (
            <div className='dropdown-menu'>
              {/* Header Buttons */}
              <div className='dropdown-header'>
                <button className='btn-login' onClick={() => navigate("/login")}>
                  Log In
                </button>
                <button className='btn-signup' onClick={() => navigate("/signup")}>Sign Up</button>
              </div>

              {/* Language Option */}
              <div className='dropdown-item-wrapper'>
                <div
                  className='dropdown-item'
                  onClick={() => {
                    setIsLanguageOpen(!isLanguageOpen);
                    setIsCurrencyOpen(false);
                  }}>
                  <span className='item-label'>Language</span>
                  <div className='item-value'>
                    <span>{selectedLanguage}</span>
                    {isLanguageOpen ? (
                      <HiChevronDown className='chevron-icon' />
                    ) : (
                      <HiChevronRight className='chevron-icon' />
                    )}
                  </div>
                </div>
                {isLanguageOpen && (
                  <div className='sub-dropdown'>
                    <div
                      className={`sub-dropdown-item ${selectedLanguage === "English" ? "selected" : ""}`}
                      onClick={() => handleLanguageChange("English")}>
                      English
                    </div>
                    <div
                      className={`sub-dropdown-item ${selectedLanguage === "Arabic" ? "selected" : ""}`}
                      onClick={() => handleLanguageChange("Arabic")}>
                      العربية (Arabic)
                    </div>
                  </div>
                )}
              </div>

              {/* Currency Option */}
              <div className='dropdown-item-wrapper'>
                <div
                  className='dropdown-item'
                  onClick={() => {
                    setIsCurrencyOpen(!isCurrencyOpen);
                    setIsLanguageOpen(false);
                  }}>
                  <span className='item-label'>Currency</span>
                  <div className='item-value'>
                    <div className='currency-badge'>{selectedCurrency.symbol}</div>
                    <span>{selectedCurrency.code}</span>
                    {isCurrencyOpen ? (
                      <HiChevronDown className='chevron-icon' />
                    ) : (
                      <HiChevronRight className='chevron-icon' />
                    )}
                  </div>
                </div>
                {isCurrencyOpen && (
                  <div className='sub-dropdown'>
                    <div
                      className={`sub-dropdown-item ${selectedCurrency.code === "USD" ? "selected" : ""}`}
                      onClick={() => handleCurrencyChange("$", "USD")}>
                      <span className='currency-badge'>$</span> USD
                    </div>
                    <div
                      className={`sub-dropdown-item ${selectedCurrency.code === "EUR" ? "selected" : ""}`}
                      onClick={() => handleCurrencyChange("€", "EUR")}>
                      <span className='currency-badge'>€</span> EUR
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Selector */}
              <div className='theme-section'>
                <span className='item-label'>Theme</span>
                <div className='theme-buttons'>
                  <button
                    onClick={() => handleThemeChange("Light")}
                    className={`theme-btn ${
                      selectedTheme === "Light" ? "active" : ""
                    }`}>
                    Light
                  </button>
                  <button
                    onClick={() => handleThemeChange("Dark")}
                    className={`theme-btn ${
                      selectedTheme === "Dark" ? "active-dark" : ""
                    }`}>
                    Dark
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
