"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square, Play, Pause, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RecordMeeting() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [extractedTasks, setExtractedTasks] = useState<string[]>([]);
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
      const mockTranscription = "John said he will complete the report by Monday. Sarah mentioned she'll review the design by Wednesday. Mike will update the database schema next Friday.";
      setTranscription(mockTranscription);
      
      // Mock extracted tasks
      const mockTasks = [
        "John: Complete the report by Monday",
        "Sarah: Review the design by Wednesday",
        "Mike: Update the database schema by next Friday"
      ];
      setExtractedTasks(mockTasks);
      setIsProcessing(false);
    }, 2000);
  };

  const syncToTrelloJira = async () => {
    // Simulate syncing to Trello/Jira
    alert("Tasks synced to Trello/Jira! (This is a demo - connect your API endpoints)");
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Record Meeting</h1>

          {/* Recording Interface */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="text-center">
              {!isRecording && !isProcessing && transcription === "" && (
                <div>
                  <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mic className="w-16 h-16 text-blue-600" />
                  </div>
                  <button
                    onClick={startRecording}
                    className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
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
                  <p className="text-lg text-gray-600">Processing audio and extracting tasks...</p>
                </div>
              )}
            </div>
          </div>

          {/* Transcription */}
          {transcription && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Transcription</h2>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap">{transcription}</p>
              </div>
            </div>
          )}

          {/* Extracted Tasks */}
          {extractedTasks.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Extracted Tasks</h2>
                <button
                  onClick={syncToTrelloJira}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
                >
                  Sync to Trello/Jira
                </button>
              </div>
              <div className="space-y-3">
                {extractedTasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500"
                  >
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 flex-1">{task}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {transcription && (
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setTranscription("");
                  setExtractedTasks([]);
                  setRecordingTime(0);
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Record New Meeting
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

