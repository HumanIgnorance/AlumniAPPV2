import "~/pages/admin/Home/styles";
import { Layout } from "~/components";
import { Divider } from "antd";
import React from "react";
import { HomeProvider } from "~/pages/admin/Home/home-page/HomeContext";
import useHomeController from "~/pages/admin/Home/home-page/hooks/useHomeController";
import HomeBrandLogoShowcase from "~/pages/admin/Home/home-page/parts/HomeBrandLogoShowcase";
import HomeHero from "~/pages/admin/Home/home-page/parts/HomeHero";
import HomeStats from "~/pages/admin/Home/home-page/parts/HomeStats";
import HomeQuickAccess from "~/pages/admin/Home/home-page/parts/HomeQuickAccess";
import HomeEventsJobs from "~/pages/admin/Home/home-page/parts/HomeEventsJobs";

function HomePage() {
    const ctx = useHomeController();
    const { revealed } = ctx;

    return (
        <HomeProvider value={ctx}>
            <Layout>
                <div className={`hp-root ${revealed ? "hp-revealed" : ""}`}>
                    {/* ── BRAND / LOGO SHOWCASE (toggled via the role badge) ── */}
                    <HomeBrandLogoShowcase />

                    {/* ── HERO ──────────────────────────────────────────────── */}
                    <HomeHero />

                    <Divider className="hp-hero-divider" />

                    {/* ── STATS ─────────────────────────────────────────────── */}
                    <HomeStats />

                    {/* ── QUICK ACCESS ──────────────────────────────────────── */}
                    <HomeQuickAccess />

                    {/* ── EVENTS + JOBS (+ Achievements for alumni) ────────── */}
                    <HomeEventsJobs />
                </div>
            </Layout>
        </HomeProvider>
    );
}

export default HomePage;
