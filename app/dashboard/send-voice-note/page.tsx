"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square, ArrowLeft, Send, User } from "lucide-react";
import Link from "next/link";

export default function SendVoiceNote() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [transcription, setTranscription] = useState("");
  const [extractedTask, setExtractedTask] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        await processRecording(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    // Simulate API call - Replace with actual API endpoint
    setTimeout(() => {
      // Mock transcription
      const mockTranscription = "Hey, can you please complete the user authentication feature by the end of this week? Thanks!";
      setTranscription(mockTranscription);
      
      // Mock extracted task
      const mockTask = "Complete the user authentication feature by end of this week";
      setExtractedTask(mockTask);
      setIsProcessing(false);
    }, 2000);
  };

  const sendVoiceNote = async () => {
    if (!recipientEmail) {
      alert("Please enter recipient email");
      return;
    }

    if (!extractedTask) {
      alert("Please record a voice note first");
      return;
    }

    // Simulate sending and syncing to Trello/Jira
    alert(`Voice note sent to ${recipientEmail}! Task will be added to their Trello/Jira. (This is a demo - connect your API endpoints)`);
    
    // Reset form
    setRecipientEmail("");
    setTranscription("");
    setExtractedTask("");
    setRecordingTime(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Send Voice Note</h1>

          {/* Recipient Input */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Recipient Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Recording Interface */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Record Your Message</h2>
            <div className="text-center">
              {!isRecording && !isProcessing && transcription === "" && (
                <div>
                  <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mic className="w-16 h-16 text-purple-600" />
                  </div>
                  <button
                    onClick={startRecording}
                    className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg"
                  >
                    Start Recording
                  </button>
                </div>
              )}

              {isRecording && (
                <div>
                  <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Square className="w-16 h-16 text-red-600" />
                  </div>
                  <div className="text-4xl font-mono font-bold text-gray-900 mb-6">
                    {formatTime(recordingTime)}
                  </div>
                  <button
                    onClick={stopRecording}
                    className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg"
                  >
                    Stop Recording
                  </button>
                </div>
              )}

              {isProcessing && (
                <div>
                  <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="w-16 h-16 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-lg text-gray-600">Processing voice note and extracting task...</p>
                </div>
              )}
            </div>
          </div>

          {/* Transcription */}
          {transcription && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Transcription</h2>
              <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap">{transcription}</p>
              </div>
            </div>
          )}

          {/* Extracted Task */}
          {extractedTask && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Extracted Task</h2>
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-gray-700 font-medium">{extractedTask}</p>
              </div>
            </div>
          )}

          {/* Send Button */}
          {extractedTask && recipientEmail && (
            <div className="flex justify-end">
              <button
                onClick={sendVoiceNote}
                className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
              >
                <Send className="w-5 h-5" />
                <span>Send Voice Note</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

