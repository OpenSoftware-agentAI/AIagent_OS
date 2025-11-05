import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function StartPage() {
  const navigate = useNavigate();

  const handleStartChat = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-teal-300 to-blue-400 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* 헤더 섹션 */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-2">🤖 AI 비서</h1>
          <p className="text-teal-100 text-lg">
            학생 데이터 분석 및 피드백 생성 도우미
          </p>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="p-8">
          
          {/* 소개 */}
          <div className="text-center mb-8">
            <p className="text-gray-700 text-lg leading-relaxed">
              엑셀 파일을 업로드하고 AI와 대화하며<br />
              학생별 맞춤 피드백을 자동으로 생성하세요
            </p>
          </div>

          {/* 주요 기능 */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-800 mb-2">파일 분석</h3>
              <p className="text-sm text-gray-600">
                엑셀, CSV, PDF 파일을 업로드하여 자동 분석
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-semibold text-gray-800 mb-2">AI 대화</h3>
              <p className="text-sm text-gray-600">
                자연스러운 대화로 데이터 질의 및 분석
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">✍️</div>
              <h3 className="font-semibold text-gray-800 mb-2">피드백 생성</h3>
              <p className="text-sm text-gray-600">
                학생별 맞춤형 피드백 자동 생성 및 SMS 발송
              </p>
            </div>
          </div>

          {/* 사용 방법 */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              📖 사용 방법
            </h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm font-semibold">1</span>
                <div>
                  <strong>채팅 시작</strong>
                  <p className="text-sm text-gray-600">아래 버튼을 클릭하여 AI 채팅을 시작하세요</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm font-semibold">2</span>
                <div>
                  <strong>파일 업로드</strong>
                  <p className="text-sm text-gray-600">학생 데이터가 담긴 엑셀 파일을 업로드하세요</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm font-semibold">3</span>
                <div>
                  <strong>AI와 대화</strong>
                  <p className="text-sm text-gray-600">원하는 분석이나 작업을 AI에게 요청하세요</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm font-semibold">4</span>
                <div>
                  <strong>결과 확인</strong>
                  <p className="text-sm text-gray-600">생성된 피드백을 확인하고 필요시 SMS로 발송하세요</p>
                </div>
              </li>
            </ol>
          </div>

          {/* 시작 버튼 */}
          <div className="text-center">
            <Button
              onClick={handleStartChat}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              🚀 채팅 시작하기
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              * 첫 실행 시 웹소켓 연결까지 몇 초 소요될 수 있습니다
            </p>
          </div>

          {/* 푸터 정보 */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              © 2025 Toribossamdan(토리보쌈단) | ISC License
            </p>
            <p className="text-xs text-gray-500 mt-2">
              2025 오픈소스 개발자대회 출품작
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
