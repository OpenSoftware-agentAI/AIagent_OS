import React from 'react';

export default function LicenseModal() {
  const licenseText = `ISC License

Copyright (c) 2025, Toribossamdan(토리보쌈단)

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        {/* 제목 */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          라이선스
        </h1>

        <hr className="mb-6" />

        {/* 라이선스 텍스트 */}
        <div className="bg-gray-50 p-6 rounded border border-gray-200 mb-6">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono overflow-auto">
            {licenseText}
          </pre>
        </div>

        {/* 닫기 버튼 */}
        <div className="text-center mb-6">
          <button
            onClick={() => window.close()}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-2 rounded transition-colors"
          >
            닫기
          </button>
        </div>

        {/* 푸터 */}
        <p className="text-center text-xs text-gray-500">
          © 2025 Toribossamdan(토리보쌈단)
        </p>
      </div>
    </div>
  );
}
