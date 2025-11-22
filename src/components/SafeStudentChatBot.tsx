import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Sparkles, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export const SafeStudentChatBot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        text: `Chào ${user?.full_name || 'bạn'}! Mình là trợ lý ảo của SafeStudent đây.\n\nBạn cần hỗ trợ gì về việc phân tích tin nhắn, bảo vệ an toàn trực tuyến, hay các tính năng khác của ứng dụng không?`,
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [user, messages.length]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    const userMsg: Message = {
      text: userMessage,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const systemPrompt = `Bạn là chatbot AI của SafeStudent - ứng dụng bảo vệ học sinh khỏi nguy hiểm trực tuyến.

THÔNG TIN SAFESTUDENT:
- Mục đích: Bảo vệ học sinh khỏi các nguy hiểm trực tuyến như bắt nạt, lừa đảo, nội dung không phù hợp
- Tính năng chính:
  + Phân tích tin nhắn tự động để phát hiện nguy hiểm
  + Cảnh báo phụ huynh khi phát hiện rủi ro
  + Theo dõi hoạt động trò chuyện của học sinh
  + Báo cáo chi tiết về mức độ an toàn

CÁCH NÓI CHUYỆN:
- Tone thân thiện, gần gũi như bạn bè
- Sử dụng ngôn ngữ đơn giản, dễ hiểu
- KHÔNG sử dụng markdown formatting như **bold**, *italic*, backtick code
- Chỉ sử dụng text thuần và emoji thông thường
- Trả lời ngắn gọn, thân thiện`;

      const conversationHistory = messages
        .filter(msg => !msg.isTyping)
        .map(msg => ({
          role: msg.isBot ? 'assistant' : 'user',
          content: msg.text
        }));

      const response = await fetch(
        `https://v98store.com/v1/chat/completions`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-LWQpkAwZ8DDsOZGI1ltmFhxBlliQBvl3trzGOrUPwgy0FR2J'
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              ...conversationHistory,
              { role: 'user', content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 200,
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      setIsTyping(false);
      
      const botResponse = data.choices?.[0]?.message?.content || 'Xin lỗi, bạn không hiểu. Em có thể hỏi lại được không? 😊';
      
      // Add typing effect
      const fullText = botResponse;
      let currentText = '';
      
      for (let i = 0; i < fullText.length; i++) {
        setTimeout(() => {
          currentText += fullText[i];
          const isLastChar = i === fullText.length - 1;
          
          setMessages(prev => {
            const withoutTyping = prev.filter(msg => !msg.isTyping);
            return [...withoutTyping, { 
              text: currentText, 
              isBot: true, 
              timestamp: new Date(),
              isTyping: !isLastChar 
            }];
          });
        }, i * 30);
      }
      
    } catch (error) {
      console.error('API Error:', error);
      setIsTyping(false);
      const errorMsg: Message = {
        text: 'Xin lỗi em, bạn gặp lỗi rồi. Em thử lại sau nhé! 😊',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const quickReplies = ["Cách sử dụng", "Thông tin tài khoản", "Phân tích tin nhắn", "Cảnh báo nguy hiểm"];

  // Only show chatbot if user is logged in
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-[60]">
        <div className="relative">
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-800 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-800"></span>
            </span>
          )}
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-2xl hover:shadow-gray-800/50 transition-all hover:scale-110 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed inset-0 w-full h-full max-w-none bottom-0 right-0 rounded-none md:inset-auto md:bottom-24 md:right-6 md:w-96 md:max-w-[calc(100vw-3rem)] md:h-[550px] md:rounded-2xl bg-background shadow-2xl border-2 border-gray-200 flex flex-col animate-in slide-in-from-bottom-8 duration-300 z-50">
          {/* Header */}
          <div className="relative p-4 pt-12 md:pt-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-t-none md:rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/50">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base flex items-center gap-2">
                  SafeStudent Assistant
                  <Sparkles className="h-4 w-4" />
                </h3>
                <p className="text-xs text-white/90 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Bạn của em 24/7
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="flex md:hidden h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/5 to-background">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.isBot ? "justify-start" : "justify-end"} animate-in slide-in-from-bottom-2`}
              >
                <div className={`max-w-[85%] ${msg.isBot ? "order-1" : "order-2"}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-md ${
                      msg.isBot
                        ? "bg-white border border-gray-200 text-gray-800"
                        : "bg-gradient-to-br from-gray-800 to-gray-700 text-white"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 px-2">
                    {msg.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {quickReplies.map((reply, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant="outline"
                  className="text-xs whitespace-nowrap border-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-colors flex-shrink-0"
                  onClick={() => {
                    setInput(reply);
                    setTimeout(() => handleSend(), 0);
                  }}
                >
                  {reply}
                </Button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 pb-8 md:pb-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                placeholder="Nhập câu hỏi của bạn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border-2 focus:border-gray-800"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 shadow-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
