"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
  Row, Col, Card, Input, Typography, Collapse, Tag, Button, Empty, Tooltip, Space, Badge,
} from "antd"
import {
  SearchOutlined, QuestionCircleOutlined, AppstoreOutlined, SafetyCertificateOutlined, MessageOutlined,
  BulbOutlined, RocketOutlined, MailOutlined, CheckCircleOutlined, ThunderboltOutlined,
  ArrowRightOutlined, FireOutlined, ArrowLeftOutlined, SunOutlined, MoonOutlined,
} from "@ant-design/icons"
import logo from "~/assets/images/OCC_LOGO.png"
import AuthAppBar from "~/components/shared/AuthAppBar"
import { InspectGuard } from "~/hooks/usePreventInspect";
import { useAppTheme } from "~/hooks/useAppTheme"
import ScrollProgressOrb from "../ScrollProgress/ScrollProgressOrb"
import "./styles";
import { CATEGORIES, FAQS } from "~/config/faqContent";
import { SITE } from "~/config/site";


const { Title, Text, Paragraph } = Typography
const { Panel } = Collapse



const FaqPublicPage = () => {
  const [revealed, setRevealed] = useState(false)
  const [activeCat, setActiveCat] = useState("all")
  const [query, setQuery] = useState("")

  const handleBackToLogin = () => {
    window.location.href = "/login";
    return;
  }


  // ============ THEME SYNC FROM FORMLOGIN ============
  // Now backed by the shared useAppTheme hook (same cookie + secureLocalStorage
  // + BroadcastChannel sync used by FormLogin), instead of a hand-rolled
  // localStorage listener.
  const { theme: currentTheme, toggleTheme } = useAppTheme();
  // ============ END THEME SYNC ============

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 60)
    return () => clearTimeout(t)
  }, [])

  // Same pattern as the currentView switch in FormLogin.js — set the
  // browser tab title for this public page.
  useEffect(() => {
    document.title = "Public FAQ | Opol Community College"
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FAQS.filter((f) => {
      const matchCat = activeCat === "all" || f.cat === activeCat
      if (!matchCat) return false
      if (!q) return true
      return (
        f.q.toLowerCase().includes(q) ||
        f.a.toLowerCase().includes(q) ||
        (f.tags || []).some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [activeCat, query])

  const countsByCat = useMemo(() => {
    const map = { all: FAQS.length }
    FAQS.forEach((f) => { map[f.cat] = (map[f.cat] || 0) + 1 })
    return map
  }, [])

  const highlight = (text) => {
    const q = query.trim()
    if (!q) return text
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig")
    const parts = text.split(re)
    return parts.map((p, i) =>
      re.test(p) ? (
        <mark key={i} className="faq-mark">{p}</mark>
      ) : (
        <React.Fragment key={i}>{p}</React.Fragment>
      ),
    )
  }

  return (
    <>
      <AuthAppBar />
      <InspectGuard />
      <div className="page-theme-toggle">
        <button
          type="button"
          className="page-theme-toggle__btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {currentTheme === "black" ? (
            <MoonOutlined />
          ) : (
            <SunOutlined />
          )}
        </button>
        <style>{`
        /* ============ Theme toggle (synced with FormLogin) ============ */
        .page-theme-toggle {
            position: fixed; top: 20px; right: 20px; z-index: 1000;
        }
        .page-theme-toggle__btn {
            width: 48px; height: 48px;
            border-radius: 50%;
            display: inline-flex; align-items: center; justify-content: center;
            cursor: pointer;
            border: 1px solid #cbd5e1;
            background: #ffffff;
            color: #4f46e5;
            box-shadow: 0 4px 14px rgba(2, 6, 23, 0.10);
            transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                        box-shadow 0.25s ease, border-color 0.2s;
        }
        .page-theme-toggle__btn:hover {
            transform: rotate(-8deg) scale(1.05);
            border-color: #4f46e5;
            box-shadow: 0 0 0 6px rgba(79, 70, 229, 0.10),
                        0 10px 28px rgba(2, 6, 23, 0.18);
        }
        .page-theme-toggle__btn .anticon { font-size: 20px; }
        [data-theme="black"] .page-theme-toggle__btn {
            background: #121620;
            border-color: #303746;
            color: #60a5fa;
            box-shadow: 0 4px 14px rgba(0,0,0,0.45);
        }
`}</style>
      </div>
      <div className={`faq-page ${revealed ? "is-revealed" : ""}`}>
        {/* <div className="faq-container"> */}
        {/* <div className="faq-wrapper">  */}
         <ScrollProgressOrb />

        <div className="back-to-login-section">
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToLogin}
            className="back-to-login-btn"
          >
            Back to Login
          </Button>
        </div>

        {/* ============ HERO ============ */}
        <section className="faq-hero">
          <div className="faq-hero__bg" aria-hidden>
            <span className="blob blob-1" />
            <span className="blob blob-2" />
            <span className="blob blob-3" />
            <div className="dot-grid" />
          </div>

          <div className="faq-hero__content">
            <div className="faq-hero__brand">
              <img src={logo} alt="OCC Logo" className="faq-hero__logo" />
              <div className="faq-hero__brand-meta">
                <Tag className="faq-chip" icon={<QuestionCircleOutlined />}>
                  HELP CENTER
                </Tag>
                <Text className="faq-hero__eyebrow">
                  Alumni Tracing Management System
                </Text>
              </div>
            </div>

            <Title className="faq-hero__title">
              Got a question?{" "}
              <span className="grad-text">We’ve got answers.</span>
            </Title>

            <Paragraph className="faq-hero__lead">
              Browse the most asked questions from fellow alumni — from
              registration and your profile to events, job posts, quizzes,
              and the gallery.
            </Paragraph>

            <div className="faq-search">
              <Input
                size="large"
                allowClear
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a question, keyword, or topic…"
                prefix={<SearchOutlined className="faq-search__icon" />}
                className="faq-search__input"
              />
              <Tag className="faq-search__hint">
                <ThunderboltOutlined /> {filtered.length} match
                {filtered.length === 1 ? "" : "es"}
              </Tag>
            </div>

            <div className="faq-pills">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  className={`faq-pill ${activeCat === c.key ? "is-active" : ""}`}
                  onClick={() => setActiveCat(c.key)}
                >
                  <span className="faq-pill__icon">{c.icon}</span>
                  <span className="faq-pill__label">{c.label}</span>
                  <Badge
                    count={countsByCat[c.key] || 0}
                    showZero
                    overflowCount={99}
                    className="faq-pill__badge"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ============ MAIN GRID ============ */}
        <section className="faq-section">
          <Row gutter={[24, 24]}>
            {/* Sidebar */}
            <Col xs={24} md={8} lg={7}>
              <Card className="faq-sidebar">
                <div className="faq-sidebar__header">
                  <Title level={5} className="faq-sidebar__title">
                    <AppstoreOutlined /> Categories
                  </Title>
                  <Text className="faq-sidebar__sub">
                    Filter by what you need.
                  </Text>
                </div>

                <ul className="faq-cats">
                  {CATEGORIES.map((c) => (
                    <li
                      key={c.key}
                      className={`faq-cat ${activeCat === c.key ? "is-active" : ""}`}
                      onClick={() => setActiveCat(c.key)}
                    >
                      <span className="faq-cat__icon">{c.icon}</span>
                      <span className="faq-cat__label">{c.label}</span>
                      <span className="faq-cat__count">
                        {countsByCat[c.key] || 0}
                      </span>
                      <ArrowRightOutlined className="faq-cat__arrow" />
                    </li>
                  ))}
                </ul>

                <div className="faq-tip">
                  <BulbOutlined className="faq-tip__icon" />
                  <div>
                    <Text strong className="faq-tip__title">Pro tip</Text>
                    <Text className="faq-tip__text">
                      Try keywords like “password”, “event”, or “job” for
                      faster results.
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Questions */}
            <Col xs={24} md={16} lg={17}>
              <div className="faq-list-header">
                <div>
                  <Tag className="section-chip">FREQUENTLY ASKED</Tag>
                  <Title level={3} className="faq-list-title">
                    {CATEGORIES.find((c) => c.key === activeCat)?.label || "All Topics"}
                  </Title>
                  <Text className="faq-list-sub">
                    {filtered.length} question
                    {filtered.length === 1 ? "" : "s"} found
                    {query ? ` for “${query}”` : ""}
                  </Text>
                </div>
                <Tooltip title="Reset filters">
                  <Button
                    className="faq-reset"
                    onClick={() => { setQuery(""); setActiveCat("all") }}
                  >
                    Reset
                  </Button>
                </Tooltip>
              </div>

              {filtered.length === 0 ? (
                <Card className="faq-empty-card">
                  <Empty
                    description={
                      <span>
                        No questions matched <b>“{query}”</b>. Try a
                        different keyword or category.
                      </span>
                    }
                  />
                </Card>
              ) : (
                <Collapse
                  accordion
                  bordered={false}
                  expandIconPosition="end"
                  className="faq-collapse"
                  defaultActiveKey={["k-0"]}
                >
                  {filtered.map((f, i) => (
                    <Panel
                      key={`k-${i}`}
                      header={
                        <div className="faq-panel-head">
                          <span className="faq-panel-num">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="faq-panel-q">
                            {highlight(f.q)}
                          </span>
                        </div>
                      }
                      className="faq-panel"
                    >
                      <Paragraph className="faq-answer">
                        {highlight(f.a)}
                      </Paragraph>
                      {f.tags?.length ? (
                        <Space wrap size={[6, 6]} className="faq-tags">
                          {f.tags.map((t) => (
                            <Tag key={t} className="faq-tag">#{t}</Tag>
                          ))}
                        </Space>
                      ) : null}
                    </Panel>
                  ))}
                </Collapse>
              )}
            </Col>
          </Row>
        </section>

        {/* ============ CONTACT CTA ============ */}
        <section className="faq-section faq-section--close">
          <Card className="faq-cta">
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={16}>
                <Tag className="section-chip section-chip--accent">
                  <FireOutlined /> STILL STUCK?
                </Tag>
                <Title level={3} className="faq-cta__title">
                  Can’t find the answer you’re looking for?
                </Title>
                <Paragraph className="faq-cta__text">
                  Reach out to the Alumni Office. Our team will get back to
                  you with the help you need — whether it’s account access,
                  event details, or technical issues.
                </Paragraph>
              </Col>
              <Col xs={24} md={8} className="faq-cta__actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<MailOutlined />}
                  className="btn-primary-grad"
                  href="/login"
                >
                  Contact Support
                </Button>
                <Button
                  size="large"
                  icon={<RocketOutlined />}
                  className="btn-ghost"
                  href="/public-about"
                >
                  Visit About Page
                </Button>
              </Col>
            </Row>

            <div className="faq-cta__meta">
              <span><CheckCircleOutlined /> Avg. reply within 24 hours</span>
              <span><SafetyCertificateOutlined /> Secure</span>
              <span><MessageOutlined /> {SITE.contactEmail}</span>
            </div>
          </Card>
        </section>

      </div>
      {/* </div> */}
      {/* </div>  */}
    </>
  )
}

export default FaqPublicPage