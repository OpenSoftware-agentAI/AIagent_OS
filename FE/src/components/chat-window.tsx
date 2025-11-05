"use client"

import React, { useState, useRef, useEffect } from "react"
import io from "socket.io-client";
import { Button } from "@/components/ui/button"

//  환경변수에서 백엔드 URL 가져오기
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 
                    'http://localhost:3000';

console.log('🔧 프론트엔드 설정:');
console.log(`   - 백엔드 URL: ${BACKEND_URL}`);

interface Message {
  id: number
  text: string
  isUser: boolean
  isProcessing?: boolean
}

interface ProgressUpdate {
  type: "student_processing" | "student_completed" | "all_completed" | "error"
  current?: number
  total?: number
  studentName?: string
  status?: "processing" | "success" | "failed"
  comment?: string
  error?: string
  failedStudents?: string[]
  success?: number
  failed?: number
  message?: string
  timestamp?: Date
}

export default function ChatWindow() {
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("")
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<any>(null); // ✅ socket을 ref로 관리
  const fileInputRef = useRef<HTMLInputElement>(null)

  //  Socket 초기화 (컴포넌트 마운트 시 한 번만)
  useEffect(() => {
    console.log('🚀 ChatWindow 마운트됨, Socket 연결 시작');

    // 새로운 socket 인스턴스 생성
    const newSocket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socketRef.current = newSocket;

    //  연결 이벤트 등록
    newSocket.on('connect', () => {
      console.log('✅ 웹소켓 연결 완료:', newSocket.id);
      setIsConnected(true);
      setConnectionAttempts(0);
    
    });

    // 연결 해제
    newSocket.on('disconnect', () => {
      console.log('❌ 웹소켓 연결 해제됨');
      setIsConnected(false);
    });

    // 연결 에러
    newSocket.on('connect_error', (error) => {
      console.error('❌ 웹소켓 연결 오류:', error);
      setIsConnected(false);
      setConnectionAttempts(prev => {
        const newAttempts = prev + 1;
        
        // 3회 이상 실패 시 에러 메시지 표시
        if (newAttempts >= 3) {
          const errorMessage: Message = {
            id: Date.now(),
            text: `⚠️ 서버 연결에 실패했습니다.\n\n문제 해결 방법:\n1. 백엔드 서버가 실행 중인지 확인하세요\n   (npm run dev)\n2. 포트 번호가 올바른지 확인하세요\n   (현재: ${BACKEND_URL})\n3. 페이지를 새로고침해주세요\n\n오류: ${error.message}`,
            isUser: false,
          };
          setMessages(prev => [...prev, errorMessage]);
        }
        
        return newAttempts;
      });
    });

    // 재연결 시도
    newSocket.on('reconnect_attempt', () => {
      console.log('🔄 웹소켓 재연결 시도 중...');
    });

    // progressUpdate 이벤트
    newSocket.on('progressUpdate', (data: ProgressUpdate) => {
      console.log('📊 진행 상황 수신:', data);

      let messageText = '';

      if (data.type === 'student_processing') {
        messageText = `⏳ [${data.current}/${data.total}] ${data.studentName} 처리 중...`;
      }

      if (data.type === 'student_completed') {
        if (data.status === 'success') {
          messageText = `✅ [${data.current}/${data.total}] ${data.studentName} 완료\n\n${data.comment}`;
        } else {
          messageText = `❌ [${data.current}/${data.total}] ${data.studentName} 실패\n오류: ${data.error}`;
        }
      }

      if (data.type === 'all_completed') {
        messageText = `\n🎉 **전체 완료!**\n✅ 성공: ${data.success}명 / ❌ 실패: ${data.failed}명`;
        if (data.failedStudents && data.failedStudents.length > 0) {
          messageText += `\n\n실패한 학생:\n${data.failedStudents.join("\n")}`;
        }
      }

      if (data.type === 'error') {
        messageText = `🚨 **오류 발생**\n${data.message}`;
      }

      if (messageText) {
        const newMessage: Message = {
          id: Date.now() + Math.random(),
          text: messageText,
          isUser: false,
          isProcessing: data.type === 'student_processing',
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
    });

    // receiveMessage 이벤트
    newSocket.on('receiveMessage', (receivedData: any) => {
      console.log('📨 백엔드로부터 메시지 수신:', receivedData);
      
      try {
        let messageText: string;
        
        if (typeof receivedData === 'string') {
          messageText = receivedData;
        } else if (receivedData && typeof receivedData.text === 'string') {
          messageText = receivedData.text;
        } else {
          console.error('❌ 알 수 없는 메시지 형식:', receivedData);
          messageText = '메시지를 표시할 수 없습니다.';
        }
        
        const newMessage: Message = {
          id: Date.now() + Math.random(),
          text: messageText,
          isUser: false,
          isProcessing: messageText.includes('생성 중')
        };
        
        setMessages(prevMessages => [...prevMessages, newMessage]);
        
      } catch (error) {
        console.error('❌ 메시지 처리 중 오류:', error);
        const errorMessage: Message = {
          id: Date.now(),
          text: '메시지 처리 중 오류가 발생했습니다.',
          isUser: false,
        };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    });

    // ✅ 컴포넌트 언마운트 시 정리
    return () => {
      console.log('🧹 ChatWindow 언마운트됨, Socket 정리');
      
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.off('connect_error');
      newSocket.off('reconnect_attempt');
      newSocket.off('progressUpdate');
      newSocket.off('receiveMessage');
      
      // 연결 유지를 위해 disconnect 하지 않음
      // newSocket.disconnect();
    };
  }, []); // ✅ 빈 배열: 마운트 시에만 실행

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages]);

  // ✅ 메시지 전송
  const handleSend = () => {
    if (!isConnected) {
      alert('🔌 서버에 아직 연결되지 않았습니다.\n잠시 후 다시 시도해주세요.');
      return;
    }

    if (inputText.trim()) {
      console.log('📤 백엔드로 메시지 전송:', inputText);
      
      const myMessage: Message = {
        id: Date.now(),
        text: inputText,
        isUser: true,
      };
      setMessages(prevMessages => [...prevMessages, myMessage]);
      socketRef.current.emit('sendMessage', inputText);
      setInputText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleExit = () => {
    if (window.confirm("채팅을 종료하시겠습니까?\n내용은 저장되지 않습니다")) {
      try {
        setMessages([]);
        setInputText("");
        
        if (socketRef.current) {
          socketRef.current.disconnect();
          console.log('🔌 웹소켓 연결 해제됨');
        }
        
        alert("채팅이 종료되었습니다.");
        window.location.href = "/";
      } catch (error) {
        console.error('❌ 종료 처리 중 오류:', error);
      }
    }
  };

  const handleFileButtonClick = () => {
    if (!isConnected) {
      alert('🔌 서버에 연결되지 않았습니다.\n파일 업로드가 불가능합니다.');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        console.log('📎 파일 업로드 시작:', file.name);
        
        const uploadingMessage: Message = {
          id: Date.now(),
          text: `📎 파일 업로드 중: ${file.name}...`,
          isUser: true,
        };
        setMessages(prevMessages => [...prevMessages, uploadingMessage]);

        const formData = new FormData();
        formData.append('file', file);

        const uploadUrl = `${BACKEND_URL}/api/file/upload`;
        console.log('📤 파일 업로드 URL:', uploadUrl);

        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          console.log('✅ 파일 업로드 성공:', result.file);
          
          const successMessage: Message = {
            id: Date.now() + 1,
            text: `✅ 파일 업로드 완료: ${result.file.originalName}`,
            isUser: false,
          };
          setMessages(prevMessages => [...prevMessages, successMessage]);

          const analyzingMessage: Message = {
            id: Date.now() + 2,
            text: `⏳ 파일 분석 중입니다. 잠시만 기다려주세요...`,
            isUser: false,
            isProcessing: true
          };
          setMessages(prevMessages => [...prevMessages, analyzingMessage]);

          if (result.aiAnalysis) {
            console.log('📊 백엔드 분석 결과:', result.aiAnalysis);
            
            const aiMessage: Message = {
              id: Date.now() + 3,
              text: result.aiAnalysis,
              isUser: false,
            };
            
            setTimeout(() => {
              setMessages(prevMessages => {
                const filtered = prevMessages.filter(msg => !msg.isProcessing);
                return [...filtered, aiMessage];
              });
            }, 1000);
          }

        } else {
          throw new Error(result.message);
        }

      } catch (error) {
        console.error('❌ 파일 업로드 실패:', error);
        
        const errorMessage: Message = {
          id: Date.now() + 2,
          text: `❌ 파일 업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
          isUser: false,
        };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    }
  };

  const handleOpenLicense = () => {
    const licenseWindow = window.open(
      '/license',
      'License',
      'width=800,height=600,scrollbars=yes,resizable=yes'
    );
    
    if (!licenseWindow) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-2xl mx-auto bg-white shadow-lg">
      {/* Header */}
      <div className="flex-shrink-0 bg-teal-400 px-5 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-white font-semibold text-sm">EduMate</div>
          {/* 연결 상태 표시 */}
          <div 
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              isConnected 
                ? 'bg-green-300 animate-pulse' 
                : 'bg-red-300'
            }`}
            title={isConnected ? '연결됨' : '연결 안됨'}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="bg-white/80 text-gray-800 hover:bg-white px-4 py-1.5 rounded-md font-medium text-xs transition-colors"
            onClick={handleOpenLicense}
          >
            라이선스
          </Button>
          
          <Button
            variant="secondary"
            className="bg-white/90 text-gray-800 hover:bg-white px-4 py-1.5 rounded-md font-medium text-xs transition-colors"
            onClick={handleExit}
          >
            Exit
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50">
        {/* 연결 대기 중 표시 */}
        {!isConnected && messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">서버에 연결 중...</p>
              <p className="text-gray-500 text-xs mt-2">백엔드 서버가 실행 중인지 확인하세요</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                message.isUser
                  ? "bg-blue-300 text-gray-800 rounded-br-sm"
                  : message.isProcessing
                    ? "bg-yellow-300 text-gray-800 rounded-bl-sm animate-pulse"
                    : "bg-purple-300 text-gray-800 rounded-bl-sm"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-teal-400 p-5">
        <div
          onClick={handleFileButtonClick}
          className={`rounded-full p-3 mb-3 text-center font-medium cursor-pointer text-xs transition-colors ${
            isConnected
              ? 'bg-teal-200/60 text-gray-700 hover:bg-teal-200'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          📎 파일 첨부 또는 검색
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isConnected}
              placeholder={isConnected ? "메시지를 입력하세요..." : "연결 대기 중..."}
              className="w-full px-4 py-2.5 rounded-full border-0 bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={!isConnected}
            className="bg-white/90 text-gray-800 hover:bg-white px-5 py-2.5 rounded-md font-medium text-sm disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            전송
          </Button>
        </div>
      </div>
    </div>
  )
}
