"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  Upload,
  Play,
  Pause,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  StopCircle,
} from "lucide-react";

export default function VoiceRecorderPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  // Form State
  const [jiraProject, setJiraProject] = useState("PROJ");
  const [jiraType, setJiraType] = useState("Task");
  const [jiraPriority, setJiraPriority] = useState("Medium");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Cleanup URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/mp3" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      setStatus("idle");

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert(
        "Could not access microphone. Please ensure permissions are granted."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingDuration(0);
    setStatus("idle");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioBlob) return;

    setStatus("uploading");

    const formData = new FormData();
    // Fields matching your curl request
    formData.append("file", audioBlob, "meeting.mp3");
    formData.append("jira_project_key", jiraProject);
    formData.append("jira_issue_type", jiraType);
    formData.append("jira_priority", jiraPriority);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Upload failed", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-50 selection:text-indigo-600 font-sans text-slate-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-50 opacity-40 blur-[80px]"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <a
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Home
          </a>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            New Voice Note
          </h1>
        </div>

        <div className="grid gap-8">
          {/* Recorder Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden relative">
            <div className="p-8 md:p-12 text-center">
              {/* Timer */}
              <div
                className={`text-4xl font-mono font-medium mb-8 transition-colors ${
                  isRecording ? "text-indigo-600" : "text-slate-400"
                }`}
              >
                {formatTime(recordingDuration)}
              </div>

              {/* Record Button Area */}
              <div className="relative flex justify-center items-center h-32 mb-8">
                {isRecording && (
                  <div className="absolute w-32 h-32 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
                )}
                <div className="relative z-10">
                  {!isRecording && !audioBlob ? (
                    <button
                      onClick={startRecording}
                      className="w-24 h-24 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-indigo-300 hover:scale-105"
                    >
                      <Mic size={32} />
                    </button>
                  ) : isRecording ? (
                    <button
                      onClick={stopRecording}
                      className="w-24 h-24 bg-white border-4 border-red-500 text-red-500 rounded-full flex items-center justify-center transition-all shadow-lg hover:bg-red-50 hover:scale-105"
                    >
                      <Square size={32} fill="currentColor" />
                    </button>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        onClick={deleteRecording}
                        className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                        title="Discard Recording"
                      >
                        <Trash2 size={24} />
                      </button>
                      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center border border-indigo-100">
                        <CheckCircle2 size={24} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-slate-500 font-medium">
                {isRecording
                  ? "Listening..."
                  : audioBlob
                  ? "Recording Saved"
                  : "Tap to record"}
              </p>

              {/* Audio Player Preview */}
              {audioUrl && (
                <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <audio
                    controls
                    src={audioUrl}
                    className="w-full h-8 opacity-80"
                  />
                </div>
              )}
            </div>

            {/* Progress Bar (Visual only for now) */}
            {isRecording && (
              <div
                className="absolute bottom-0 left-0 h-1 bg-indigo-600 transition-all duration-1000"
                style={{ width: "100%" }}
              ></div>
            )}
          </div>

          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-8 transition-all duration-500 ${
              audioBlob
                ? "opacity-100 translate-y-0"
                : "opacity-50 translate-y-4 pointer-events-none grayscale"
            }`}
          >
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              Task Details
            </h3>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Project Key
                </label>
                <input
                  type="text"
                  value={jiraProject}
                  onChange={(e) => setJiraProject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm"
                  placeholder="PROJ"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Issue Type
                </label>
                <select
                  value={jiraType}
                  onChange={(e) => setJiraType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none text-slate-700"
                >
                  <option>Task</option>
                  <option>Bug</option>
                  <option>Story</option>
                  <option>Epic</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Priority
                </label>
                <div className="flex gap-4">
                  {["Low", "Medium", "High"].map((p) => (
                    <label
                      key={p}
                      className={`flex-1 cursor-pointer border rounded-lg p-3 text-center text-sm font-medium transition-all ${
                        jiraPriority === p
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={jiraPriority === p}
                        onChange={(e) => setJiraPriority(e.target.value)}
                        className="hidden"
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "uploading" || !audioBlob}
              className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
                status === "success"
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200"
                  : status === "error"
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-red-200"
                  : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200"
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {status === "uploading" ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle2 size={20} />
                  Sent to Jira
                </>
              ) : status === "error" ? (
                <>
                  <AlertCircle size={20} />
                  Failed - Try Again
                </>
              ) : (
                <>
                  Upload & Create Task
                  <Upload size={18} />
                </>
              )}
            </button>

            {status === "error" && (
              <p className="text-center text-red-500 text-sm mt-4">
                Is your backend running on port 8000?
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
