'use client';

import { useState } from "react";
import { CasesSection } from "./cases/CasesSection";
import { SimilarCasesForm } from "./similar/SimilarCasesForm";
import { Tabs } from "./Tabs";

export function MainContents() {
    const [activeTab, setActiveTab] = useState("similar");

    const tabs = [
        { id: "similar", label: "類似案件検索" },
        { id: "cases", label: "案件管理" },
    ];

    return (
        <>
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

            <div className="mt-8">
                {activeTab === "similar" && <SimilarCasesForm />}
                {activeTab === "cases" && <CasesSection />}
            </div>
        </>
    );
}
