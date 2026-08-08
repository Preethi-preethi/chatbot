import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, File, Mic, Square, Volume2, Sparkles } from 'lucide-react';

const AudioChipPlayer = ({ file }) => {
  const [audioUrl, setAudioUrl] = useState('');
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!audioUrl) return null;
  return <audio controls src={audioUrl} className="chip-audio-player" />;
};

const ChatInput = ({ 

  onSend, 
  disabled, 
  onAttachClick, 
  pendingFiles = [], 
  onRemoveFile, 
  onPreviewFile,
  onVoiceRecordComplete 
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceError, setVoiceError] = useState('');
  
  const textareaRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch(e){}
      }
      if (recordingStreamRef.current) {
        try { recordingStreamRef.current.getTracks().forEach((track) => track.stop()); } catch(e){}
      }
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch(e){}
      }
    };
  }, []);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startVoiceRecording = async () => {
    setVoiceError('');
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setVoiceError('Microphone recording is not supported in this browser environment.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingStreamRef.current = stream;
      
      let mediaRecorder;
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/mp4' });
      } else {
        mediaRecorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        try {
          const mimeType = mediaRecorder.mimeType || 'audio/webm';
          const chunks = audioChunksRef.current;
          let audioBlob;
          
          if (chunks && chunks.length > 0) {
            audioBlob = new Blob(chunks, { type: mimeType });
          } else {
            audioBlob = new Blob([new Uint8Array([82,73,70,70,36,0,0,0,87,65,86,69,102,109,116,32,16,0,0,0,1,0,1,0,68,172,0,0,136,88,1,0,2,0,16,0,100,97,116,97,0,0,0,0])], { type: 'audio/wav' });
          }

          const now = new Date();
          const timeStr = `${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
          const ext = mimeType.includes('mp4') || mimeType.includes('m4a') ? 'm4a' : 'webm';
          const voiceFile = new File([audioBlob], `Voice_Note_${timeStr}.${ext}`, { type: audioBlob.type || 'audio/webm' });

          if (onVoiceRecordComplete) {
            onVoiceRecordComplete(voiceFile);
          }
        } catch (err) {
          console.error("Error creating voice file:", err);
        } finally {
          audioChunksRef.current = [];
        }
      };

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          const baseText = input ? input.trim() + ' ' : '';
          recognition.onresult = (e) => {
            let transcript = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
              transcript += e.results[i][0].transcript;
            }
            setInput(baseText + transcript);
          };
          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (err) {
          console.warn('Speech recognition error:', err);
        }
      }

      mediaRecorder.start(100);
      setIsRecording(true);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Microphone access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setVoiceError('Microphone permission denied. Please allow microphone access.');
      } else {
        setVoiceError('Could not access microphone.');
      }
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop(); } catch(e){}
    }

    const mr = mediaRecorderRef.current;
    if (mr) {
      try {
        if (mr.state === 'recording') {
          mr.requestData();
        }
        mr.stop();
      } catch (e) {
        console.warn('Error stopping MediaRecorder:', e);
      }
    }

    if (recordingStreamRef.current) {
      try {
        recordingStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch(e){}
    }
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const handleSend = () => {
    if (isRecording) {
      stopVoiceRecording();
    }
    if ((input.trim() || pendingFiles.length > 0) && !disabled) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isAudioFile = (file) => {
    if (!file) return false;
    return (file.type && file.type.startsWith('audio/')) || /\.(webm|wav|mp3|m4a|ogg)$/i.test(file.name);
  };

  return (
    <div className="input-area-wrapper">
      <div className="input-container glass-card">
        {isRecording && (
          <div className="voice-listening-indicator">
            <div className="pulse-dot" />
            <span>Recording Voice Note... <strong>{formatTime(recordingSeconds)}</strong></span>
            <div className="sound-wave-bars">
              <span /><span /><span /><span /><span />
            </div>
          </div>
        )}

        {voiceError && (
          <div className="voice-error-text">
            {voiceError}
          </div>
        )}

        {pendingFiles.length > 0 && (
          <div className="file-chips-container">
            {pendingFiles.map((file, idx) => {
              const audio = isAudioFile(file);
              return (
                <div key={idx} className={`file-chip glass-panel ${audio ? 'voice-file-chip' : ''}`}>
                  <div className="chip-content">
                    {audio ? (
                      <Volume2 size={15} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                    ) : (
                      <File size={14} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                    )}
                    <span className="truncate">{file.name}</span>
                  </div>

                  {audio && <AudioChipPlayer file={file} />}


                  <button 
                    type="button"
                    className="remove-file-btn" 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemoveFile(idx); }}
                    disabled={disabled}
                    title="Remove file"
                  >
                    <X size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="textarea-wrapper">
          <textarea
            ref={textareaRef}
            className="input-textarea"
            placeholder={isRecording ? "Recording your question..." : "Ask your CA doubt, query GST provisions, or analyze PDF modules..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={disabled}
          />
        </div>

        <div className="input-actions">
          <div className="action-buttons-group">
            <button 
              type="button"
              className="input-action-btn attach-btn" 
              title="Attach Document or Image" 
              disabled={disabled || isRecording}
              onClick={onAttachClick}
            >
              <Paperclip size={18} />
            </button>
            <button 
              type="button"
              className={`input-action-btn mic-btn ${isRecording ? 'mic-recording' : ''}`} 
              title={isRecording ? "Stop Recording" : "Record Voice Note"} 
              disabled={disabled}
              onClick={toggleVoiceRecording}
            >
              {isRecording ? <Square size={16} className="recording-stop-icon" /> : <Mic size={18} />}
            </button>
          </div>


          <button 
            type="button"
            className="send-btn" 
            onClick={handleSend}
            disabled={(!input.trim() && pendingFiles.length === 0) || disabled}
            title="Send message (Enter)"
          >
            <span>Send</span>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
