import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout/DashboardLayout.jsx";
import StatCard from "../../components/common/StatCard/StatCard.jsx";
import StatusPill from "../../components/common/StatusPill/StatusPill.jsx";
import Button from "../../components/common/Button/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getTransactions, getTransactionStats } from "../../api/client.js";
import "./Transactions.css";

const TYPE_ICONS = {
  Airtime: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect
        x="6"
        y="2"
        width="12"
        height="20"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 18h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Data: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 12h18M12 3c2.5 2.7 2.5 14.3 0 18M12 3c-2.5 2.7-2.5 14.3 0 18"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
};

const FILTERS = ["All", "Airtime", "Data"];

function avatarColor(name) {
  return `hsl(${name.length * 41}, 60%, 55%)`;
}

function Transactions() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [mobileStatusFilter, setMobileStatusFilter] = useState("All");
  const [copyToast, setCopyToast] = useState(false);
  const [infoToast, setInfoToast] = useState("");
  const [allTransactions, setAllTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [transactionStats, setTransactionStats] = useState([]);

  useEffect(() => {
    getTransactions({ limit: 100 })
      .then((data) => {
        setAllTransactions(data.transactions);
        setTotalCount(data.totalCount);
      })
      .catch(() => {});

    getTransactionStats()
      .then((stats) => {
        setTransactionStats([
          {
            id: "ts-total",
            label: "Total Recharges",
            value: stats.totalRecharges,
          },
          {
            id: "ts-count",
            label: "Total Transactions",
            value: String(stats.totalTransactions),
          },
          { id: "ts-success", label: "Success Rate", value: stats.successRate },
        ]);
      })
      .catch(() => {});
  }, []);

  const showInfoToast = (message) => {
    setInfoToast(message);
    setTimeout(() => setInfoToast(""), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://${user?.linkUrl}`).catch(() => {});
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((txn) => {
      const matchesType = activeFilter === "All" || txn.type === activeFilter;
      const matchesStatus =
        mobileStatusFilter === "All" ||
        (mobileStatusFilter === "Successful" && txn.status === "success");
      const matchesSearch =
        !searchQuery.trim() ||
        txn.sponsor.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [allTransactions, activeFilter, mobileStatusFilter, searchQuery]);

  const mobileTotal = useMemo(() => {
    // Sum only the naira-denominated rows shown on this page, for a
    // realistic "Total" summary chip (data-only rows like "10GB"
    // aren't summable as currency).
    return filteredTransactions.reduce((sum, txn) => {
      const numeric = parseFloat(txn.amount.replace(/[^\d.]/g, ""));
      return txn.amount.includes("₦") ? sum + numeric : sum;
    }, 0);
  }, [filteredTransactions]);

  return (
    <DashboardLayout
      activeNavItem="transactions"
      activeTab="history"
      mobileLabel="Transaction History"
    >
      {/* ===================== DESKTOP ===================== */}
      <div className="hide-mobile">
        {infoToast && <p className="txn-toast">{infoToast}</p>}
        <div className="txn-header">
          <div>
            <h1 className="txn-header__title">Transaction History</h1>
            <p className="txn-header__subtitle">
              Monitor your incoming airtime and data
            </p>
          </div>
          <div className="txn-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path
                d="M21 21l-4-4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Quick search sponsor…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="txn-stats-row">
          {transactionStats.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              footnote=""
              compact
            />
          ))}
        </div>

        <div className="txn-toolbar">
          <div className="txn-filter-pills">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`txn-filter-pill ${activeFilter === filter ? "txn-filter-pill--active" : ""}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === "Airtime" && TYPE_ICONS.Airtime}
                {filter === "Data" && TYPE_ICONS.Data}
                {filter === "All" ? "All Records" : filter}
              </button>
            ))}
          </div>

          <div className="txn-filters-dropdown">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFiltersOpen((v) => !v)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                style={{ marginRight: "0.5rem" }}
              >
                <path
                  d="M4 6h16M7 12h10M10 18h4"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
              Filters
            </Button>
            {isFiltersOpen && (
              <div className="txn-filters-panel">
                <p className="txn-filters-panel__label">Date Range</p>
                <select className="txn-filters-panel__select" defaultValue="30">
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="all">All time</option>
                </select>
                <p className="txn-filters-panel__label">Network</p>
                <select
                  className="txn-filters-panel__select"
                  defaultValue="all"
                >
                  <option value="all">All networks</option>
                  <option value="MTN">MTN</option>
                  <option value="Airtel">Airtel</option>
                  <option value="Glo">Glo</option>
                  <option value="9mobile">9mobile</option>
                </select>
                <Button
                  variant="secondary"
                  size="sm"
                  className="txn-filters-panel__apply"
                  onClick={() => setIsFiltersOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="txn-table-wrap">
          <table className="txn-table">
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>Sponsor</th>
                <th>Type</th>
                <th>Network</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td>
                    <p className="txn-table__date">{txn.date}</p>
                    <p className="txn-table__time">{txn.time}</p>
                  </td>
                  <td>
                    <div className="txn-table__sponsor">
                      {txn.isAnonymous ? (
                        <span className="txn-table__avatar txn-table__avatar--anon">
                          AS
                        </span>
                      ) : (
                        <span
                          className="txn-table__avatar"
                          style={{ background: avatarColor(txn.sponsor) }}
                        >
                          {txn.sponsor.charAt(0)}
                        </span>
                      )}
                      <span
                        className={
                          txn.isAnonymous ? "txn-table__sponsor-name--anon" : ""
                        }
                      >
                        {txn.sponsor}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="txn-table__type">
                      {TYPE_ICONS[txn.type]}
                      {txn.type}
                    </span>
                  </td>
                  <td>
                    <span className="txn-network-pill">{txn.network}</span>
                  </td>
                  <td>
                    <span className="txn-table__amount">{txn.amount}</span>
                    {txn.valuedAt && (
                      <span className="txn-table__valued">
                        {" "}
                        (Valued at {txn.valuedAt})
                      </span>
                    )}
                  </td>
                  <td>
                    <StatusPill status={txn.status} />
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="txn-table__empty">
                    No transactions match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="txn-pagination">
          <p>
            Showing 1-{filteredTransactions.length} of {totalCount} transactions
          </p>
          <div className="txn-pagination__pager">
            <button
              type="button"
              className="txn-pagination__arrow"
              aria-label="Previous page"
              disabled
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="txn-pagination__page txn-pagination__page--active"
            >
              1
            </button>
            <button
              type="button"
              className="txn-pagination__page"
              onClick={() =>
                showInfoToast("This preview only includes page 1 of mock data.")
              }
            >
              2
            </button>
            <button
              type="button"
              className="txn-pagination__page"
              onClick={() =>
                showInfoToast("This preview only includes page 1 of mock data.")
              }
            >
              3
            </button>
            <button
              type="button"
              className="txn-pagination__arrow"
              aria-label="Next page"
              onClick={() =>
                showInfoToast("This preview only includes page 1 of mock data.")
              }
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="txn-tips-row">
          <div className="txn-tip-card txn-tip-card--purple">
            <span className="txn-tip-card__watermark" aria-hidden="true">
              <svg width="140" height="140" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 15l6-6M8 12l-2 2a3.5 3.5 0 004.9 4.9l2-2M16 12l2-2a3.5 3.5 0 00-4.9-4.9l-2 2"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </span>
            <h3 className="txn-tip-card__title">
              Pro-Tip: Boost Your Recharges
            </h3>
            <p className="txn-tip-card__text">
              Users who share their public recharge link on LinkedIn and Twitter
              receive 40% more airtime on average. Share yours today!
            </p>
            <Button variant="secondary" size="sm" onClick={handleCopyLink}>
              {copyToast ? "Copied!" : "Copy My Link"}
            </Button>
          </div>
          <div className="txn-tip-card txn-tip-card--teal">
            <h3 className="txn-tip-card__title txn-tip-card__title--teal">
              Tax Season Ready?
            </h3>
            <p className="txn-tip-card__text">
              Need an official statement for your records? Download a PDF report
              of all your transactions for any custom date range.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="txn-tip-card__download-btn"
              onClick={() =>
                showInfoToast(
                  "Report generation requires a connected backend — coming soon.",
                )
              }
            >
              Download Report
            </Button>
          </div>
        </div>

        <footer className="txn-footer">
          <p>
            &copy; {new Date().getFullYear()} Recharge4Me. All rights reserved.
          </p>
          <div className="txn-footer__links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </footer>
      </div>

      {/* ===================== MOBILE ===================== */}
      <div className="hide-desktop">
        {infoToast && <p className="txn-toast">{infoToast}</p>}
        <div className="txn-mobile-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="1.75"
            />
            <path
              d="M21 21l-4-4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by sponsor or description…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="txn-mobile-filters">
          <button
            type="button"
            className="txn-mobile-filter-icon"
            onClick={() => setIsFiltersOpen((v) => !v)}
            aria-label="More filters"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M7 12h10M10 18h4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {["All", "Airtime", "Data", "Successful"].map((filter) => (
            <button
              key={filter}
              type="button"
              className={`txn-mobile-filter-pill ${
                (filter === "All" || filter === "Successful"
                  ? mobileStatusFilter
                  : activeFilter) === filter
                  ? "txn-mobile-filter-pill--active"
                  : ""
              }`}
              onClick={() => {
                if (filter === "All" || filter === "Successful") {
                  setMobileStatusFilter(filter);
                  setActiveFilter("All");
                } else {
                  setActiveFilter(filter);
                  setMobileStatusFilter("All");
                }
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {isFiltersOpen && (
          <div className="txn-filters-panel txn-filters-panel--mobile">
            <p className="txn-filters-panel__label">Date Range</p>
            <select className="txn-filters-panel__select" defaultValue="30">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <p className="txn-filters-panel__label">Network</p>
            <select className="txn-filters-panel__select" defaultValue="all">
              <option value="all">All networks</option>
              <option value="MTN">MTN</option>
              <option value="Airtel">Airtel</option>
              <option value="Glo">Glo</option>
              <option value="9mobile">9mobile</option>
            </select>
            <Button
              variant="secondary"
              size="sm"
              className="txn-filters-panel__apply"
              onClick={() => setIsFiltersOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        )}

        <div className="txn-mobile-section-header">
          <p className="txn-mobile-section-label">Recent Activity</p>
          <span className="txn-mobile-total-pill">
            Total: ₦{mobileTotal.toLocaleString()}
          </span>
        </div>

        <div className="txn-mobile-list">
          {filteredTransactions.map((txn) => (
            <div key={txn.id} className="txn-mobile-item">
              <div className="txn-mobile-item__avatar-wrap">
                {txn.isAnonymous ? (
                  <span className="txn-table__avatar txn-table__avatar--anon">
                    AS
                  </span>
                ) : (
                  <span
                    className="txn-table__avatar"
                    style={{ background: avatarColor(txn.sponsor) }}
                  >
                    {txn.sponsor.charAt(0)}
                  </span>
                )}
                <span className="txn-mobile-item__type-badge">
                  {TYPE_ICONS[txn.type]}
                </span>
              </div>
              <div className="txn-mobile-item__main">
                <div className="txn-mobile-item__top">
                  <p
                    className={`txn-mobile-item__sponsor ${txn.isAnonymous ? "txn-table__sponsor-name--anon" : ""}`}
                  >
                    {txn.sponsor}
                  </p>
                  <p className="txn-mobile-item__amount">+{txn.amount}</p>
                </div>
                <p className="txn-mobile-item__desc">
                  {txn.network} {txn.type}{" "}
                  {txn.type === "Data" ? "Bundle" : "Recharge"}
                </p>
                <div className="txn-mobile-item__bottom">
                  <p className="txn-mobile-item__date">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="16"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M3 9h18M8 3v4M16 3v4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    {txn.date} • {txn.time}
                  </p>
                  <StatusPill status={txn.status} />
                </div>
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && (
            <p className="txn-mobile-empty">
              No transactions match your search.
            </p>
          )}
        </div>

        <div className="txn-mobile-pagination">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <p>1 of 12</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              showInfoToast("This preview only includes page 1 of mock data.")
            }
          >
            Next
          </Button>
        </div>
        <p className="txn-mobile-pagination-note">
          Showing {filteredTransactions.length} of {totalCount} transactions
        </p>
      </div>
    </DashboardLayout>
  );
}

export default Transactions;
