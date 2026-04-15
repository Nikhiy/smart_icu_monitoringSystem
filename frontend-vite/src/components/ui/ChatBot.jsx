// src/components/ui/ChatBot.jsx
import React, { useState, useRef, useEffect } from "react";
import socket from "@/api/socket";

const ChatBot = ({ patientData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "👋 Hi! I'm the ICU Assistant. Ask me about the patient's vitals, alerts, or clinical recommendations.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const backendUrls = [
        import.meta.env.VITE_BACKEND_URL,
        `http://${window.location.hostname}:5000`,
        `http://127.0.0.1:5000`,
        `http://localhost:5000`,
      ].filter(Boolean);

      console.log("[Chat] Backend URLs to try:", backendUrls);
      
      let response = null;
      let lastError = null;
      
      for (const backendHost of backendUrls) {
        try {
          console.log("[Chat] Attempting:", `${backendHost}/chat`);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timeout after 8s")), 8000)
          );
          
          const fetchPromise = fetch(`${backendHost}/chat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: input,
              patient_data: patientData || {},
            }),
          });
          
          response = await Promise.race([fetchPromise, timeoutPromise]);
          console.log("[Chat] Success! Connected to:", backendHost);
          break;
        } catch (err) {
          lastError = err;
          console.log("[Chat] Failed to reach", backendHost + ":", err.message);
        }
      }
      
      if (!response) {
        throw new Error(
          `Backend unreachable. Tried: ${backendUrls.join(", ")}. Last error: ${lastError?.message}`
        );
      }

      console.log("[Chat] Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[Chat] Error response:", errorData);
        throw new Error(`Backend returned HTTP ${response.status}: ${errorData.error || "Unknown error"}`);
      }

      const data = await response.json();
      console.log("[Chat] Response data:", data);

      const chatResponse = data.chat_response || {};

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        text: chatResponse.response || "I couldn't understand that. Please try again.",
        intent: chatResponse.intent,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("[Chat] Full error:", error);
      const errorMessage = {
        id: messages.length + 2,
        type: "bot",
        text: `❌ Error: ${error.message}. Make sure the backend is running at the correct URL.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
          color: "white",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          transition: "all 0.3s ease",
          transform: isOpen ? "scale(1.1)" : "scale(1)",
        }}
        title="Chat with Assistant"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "380px",
            height: "500px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            animation: "slideUp 0.3s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
              color: "white",
              padding: "16px",
              borderRadius: "12px 12px 0 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
                🤖 ICU Assistant
              </h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "12px", opacity: 0.9 }}>
                {patientData?.alert ? "🔴 Alert active" : "🟢 Normal"}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background:
                      msg.type === "user"
                        ? "#3b82f6"
                        : "#f0f0f0",
                    color: msg.type === "user" ? "white" : "#333",
                    fontSize: "14px",
                    lineHeight: "1.4",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "#f0f0f0",
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  ⏳ Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px", borderTop: "1px solid #e0e0e0" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about vitals..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid #d0d0d0",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  outline: "none",
                  opacity: isLoading ? 0.6 : 1,
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                style={{
                  padding: "8px 14px",
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  opacity: isLoading || !input.trim() ? 0.6 : 1,
                  transition: "all 0.2s ease",
                }}
              >
                Send
              </button>
            </div>
          </div>

          <style>{`
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default ChatBot;
