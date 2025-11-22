"use client";

import React, { useState, useEffect } from "react";
import {
  Mic,
  Bot,
  Trello,
  ArrowRight,
  CheckCircle2,
  Play,
  Zap,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

export default function App() {
  // Mock auth state for visual demonstration
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-50 selection:text-indigo-600 relative overflow-hidden font-sans text-slate-900">
      {/* Background Pattern - Technical Grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 opacity-20 blur-[100px]"></div>
      </div>

      {/* Navbar */}
      <nav
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md border-b border-slate-100 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-xl tracking-tight">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Zap size={18} fill="currentColor" />
            </div>
            MeetAction
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              About
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-medium bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-slate-600">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-40 pb-20">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-24 relative">
          {/* Decorative blur behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-100/50 blur-[100px] -z-10 rounded-full opacity-50"></div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 text-xs font-medium mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v2.0 Now Available with Jira Sync
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight leading-[1.1]">
            Turn conversations into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 animate-gradient-x">
              actionable tasks.
            </span>
          </h1>

          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Stop taking notes. Our AI records meetings, extracts key decisions,
            and automatically creates tickets in your favorite project
            management tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/sign-up"
              className="group px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1 flex items-center gap-2"
            >
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm hover:shadow-md">
              <Play className="w-4 h-4 fill-current" />
              Watch Demo
            </button>
          </div>

          {/* Social Proof / Tech Stack */}
          <div className="mt-16 pt-10 border-t border-slate-100/60">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-6">
              Trusted by teams at
            </p>
            <div className="flex flex-wrap gap-8 md:gap-12 justify-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              {/* Simple text representation for logos to keep it light */}
              <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
                <Trello size={24} className="text-blue-500" /> Trello
              </div>
              <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
                <Zap size={24} className="text-blue-600" /> Jira
              </div>
              <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
                <Bot size={24} className="text-purple-500" /> Slack
              </div>
              <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
                <CheckCircle2 size={24} className="text-emerald-500" /> Asana
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="group p-8 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-4px_rgba(99,102,241,0.1)] hover:border-indigo-100 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10 border border-blue-100">
              <Mic size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">
              Smart Recording
            </h3>
            <p className="text-slate-500 leading-relaxed relative z-10">
              Crystal clear audio capture with speaker identification. We handle
              the transcription so you can focus on the conversation.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-8 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-4px_rgba(168,85,247,0.1)] hover:border-purple-100 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10 border border-purple-100">
              <Bot size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">
              AI Extraction
            </h3>
            <p className="text-slate-500 leading-relaxed relative z-10">
              Our LLM parses context to identify deadlines, assignees, and
              action items, filtering out the small talk automatically.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-8 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-4px_rgba(16,185,129,0.1)] hover:border-emerald-100 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10 border border-emerald-100">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">
              One-Click Sync
            </h3>
            <p className="text-slate-500 leading-relaxed relative z-10">
              Push tasks directly to your team's board. Supports fields for
              priority, tags, and due dates right from the transcript.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
