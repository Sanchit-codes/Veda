"use client";

import { useState } from "react";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="relative w-10 h-6 rounded-full transition-colors cursor-pointer shrink-0"
      style={{ background: checked ? "#181818" : "#dadada" }}
    >
      <span
        className="absolute top-1 left-1 size-4 rounded-full bg-white transition-transform"
        style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }}
      />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden" style={{ boxShadow: "0px 2px 8px rgba(0,0,0,0.06)" }}>
      <div className="px-6 py-4 border-b border-[#f0f0f0]">
        <h2 className="text-[15px] font-bold text-[#181818]" style={{ letterSpacing: "-0.6px" }}>
          {title}
        </h2>
      </div>
      <div className="divide-y divide-[#f6f6f6]">{children}</div>
    </div>
  );
}

function SettingRow({
  label,
  description,
  right,
}: {
  label: string;
  description?: string;
  right: React.ReactNode;
}) {
  return (
    <div className="px-6 py-4 flex items-center justify-between gap-6">
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-[14px] font-semibold text-[#303030]" style={{ letterSpacing: "-0.56px" }}>
          {label}
        </span>
        {description && (
          <span className="text-[13px] text-[#a9a9a9]" style={{ letterSpacing: "-0.48px" }}>
            {description}
          </span>
        )}
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}

function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 px-4 rounded-full text-[14px] text-[#303030] outline-none w-[220px]"
      style={{ background: "#f6f6f6", letterSpacing: "-0.52px" }}
    />
  );
}

export default function SettingsContent() {
  const [schoolName, setSchoolName] = useState("Delhi Public School");
  const [teacherName, setTeacherName] = useState("Lakshya Sharma");
  const [email, setEmail] = useState("lakshya.sharma@dps.edu.in");
  const [city, setCity] = useState("Bokaro Steel City");
  const [board, setBoard] = useState("CBSE");

  const [notifAssignment, setNotifAssignment] = useState(true);
  const [notifGeneration, setNotifGeneration] = useState(true);
  const [notifUpdates, setNotifUpdates] = useState(false);
  const [notifReports, setNotifReports] = useState(true);

  const [aiModel, setAiModel] = useState("Gemma 4 (Local)");
  const [streamOutput, setStreamOutput] = useState(true);
  const [showBloomsLevel, setShowBloomsLevel] = useState(true);
  const [showDifficulty, setShowDifficulty] = useState(true);

  return (
    <div className="relative min-h-[calc(100vh-82px)] flex flex-col">

      {/* Page header */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="size-3.5 rounded-full bg-[#5e5e5e] shrink-0" />
          <h1
            className="text-[26px] font-bold text-[#181818] leading-none"
            style={{ letterSpacing: "-1.04px" }}
          >
            Settings
          </h1>
        </div>
        <p className="text-[15px] text-[#5e5e5e] ml-[24px]" style={{ letterSpacing: "-0.48px" }}>
          Manage your account, school, and app preferences.
        </p>
      </div>

      <div className="px-8 pb-16 flex flex-col gap-5">

        {/* Profile */}
        <Section title="Profile">
          <SettingRow
            label="Teacher Name"
            description="Displayed on generated papers"
            right={<TextInput value={teacherName} onChange={setTeacherName} />}
          />
          <SettingRow
            label="Email Address"
            right={<TextInput value={email} onChange={setEmail} />}
          />
        </Section>

        {/* School */}
        <Section title="School Details">
          <SettingRow
            label="School Name"
            description="Printed on the exam header"
            right={<TextInput value={schoolName} onChange={setSchoolName} />}
          />
          <SettingRow
            label="City"
            right={<TextInput value={city} onChange={setCity} />}
          />
          <SettingRow
            label="Curriculum Board"
            right={
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="h-9 pl-4 pr-8 rounded-full text-[14px] text-[#303030] outline-none appearance-none cursor-pointer"
                style={{ background: "#f6f6f6", letterSpacing: "-0.52px" }}
              >
                <option>CBSE</option>
                <option>ICSE</option>
                <option>State Board</option>
                <option>IB</option>
              </select>
            }
          />
        </Section>

        {/* AI Generation */}
        <Section title="AI & Generation">
          <SettingRow
            label="AI Model"
            description="Provider used for question generation"
            right={
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="h-9 pl-4 pr-8 rounded-full text-[14px] text-[#303030] outline-none appearance-none cursor-pointer"
                style={{ background: "#f6f6f6", letterSpacing: "-0.52px" }}
              >
                <option>Gemma 4 (Local)</option>
                <option>Gemini 2.5 Pro</option>
                <option>GPT-4o</option>
              </select>
            }
          />
          <SettingRow
            label="Stream output live"
            description="Show questions as they're generated"
            right={<Toggle checked={streamOutput} onChange={() => setStreamOutput((v) => !v)} />}
          />
          <SettingRow
            label="Show Bloom's level badges"
            description="Display taxonomy level on each question"
            right={<Toggle checked={showBloomsLevel} onChange={() => setShowBloomsLevel((v) => !v)} />}
          />
          <SettingRow
            label="Show difficulty badges"
            description="Display easy / medium / hard on each question"
            right={<Toggle checked={showDifficulty} onChange={() => setShowDifficulty((v) => !v)} />}
          />
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <SettingRow
            label="Assignment created"
            right={<Toggle checked={notifAssignment} onChange={() => setNotifAssignment((v) => !v)} />}
          />
          <SettingRow
            label="Generation completed"
            right={<Toggle checked={notifGeneration} onChange={() => setNotifGeneration((v) => !v)} />}
          />
          <SettingRow
            label="Reports ready"
            right={<Toggle checked={notifReports} onChange={() => setNotifReports((v) => !v)} />}
          />
          <SettingRow
            label="Product updates & tips"
            right={<Toggle checked={notifUpdates} onChange={() => setNotifUpdates((v) => !v)} />}
          />
        </Section>

        {/* Account */}
        <Section title="Account">
          <SettingRow
            label="Plan"
            description="Current subscription"
            right={
              <span
                className="px-3 py-1 rounded-full text-[13px] font-semibold text-white"
                style={{ background: "#ff5623", letterSpacing: "-0.48px" }}
              >
                Pro — Free Trial
              </span>
            }
          />
          <SettingRow
            label="Sign out"
            right={
              <button
                type="button"
                className="flex items-center gap-2 px-4 h-9 rounded-full border border-[#e8e8e8] text-[13px] font-semibold text-[#e03131] hover:bg-red-50 transition-colors cursor-pointer"
                style={{ letterSpacing: "-0.48px" }}
              >
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M7 17H3V3H7M13 14L17 10L13 6M17 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign Out
              </button>
            }
          />
        </Section>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="button"
            className="px-8 h-11 rounded-full bg-[#181818] text-white text-[14px] font-semibold hover:bg-[#2b2b2b] transition-colors cursor-pointer"
            style={{ letterSpacing: "-0.52px" }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
