"use client"
import React, { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  symbol: string;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${props.symbol}",
        "interval": "H",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      }`;
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [props.symbol]);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default memo(TradingViewWidget);
