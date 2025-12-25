import React from "react";

export default function Docs() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-10 font-[Inter]">

      <h1 className="text-4xl font-bold text-blue-400 text-center mb-8">
        🚀 Your AI API Documentation
      </h1>

      <div className="max-w-3xl mx-auto space-y-6">

        {/* Auth */}
        <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-2">🔑 Authentication</h2>
          <pre className="bg-black/40 p-3 rounded text-sm">
{`x-api-key: YOUR_API_KEY_HERE`}
          </pre>
        </section>

        {/* Base URL */}
        <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-2">🌍 Base URL</h2>
          <pre className="bg-black/40 p-3 rounded text-sm">
{`http://localhost:7000/api`}
          </pre>
        </section>

        {/* Generate Text */}
        <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-3">🚀 Generate Text</h2>

          <span className="text-green-400 text-sm bg-green-900/40 px-2 py-1 rounded">
            POST /generate
          </span>

          <div className="mt-3 space-y-3">

            <p>Request Body:</p>
            <pre className="bg-black/40 p-3 rounded text-sm">
{String.raw`{
  "prompt": "Give me toy sale offer",
  "system": "Catchy style with emoji (optional)"
}`}
            </pre>

            <p>Response Example:</p>
            <pre className="bg-black/40 p-3 rounded text-sm">
{String.raw`{
  "status": "success",
  "result": "🎉 Big toy sale! 50% OFF today!"
}`}
            </pre>
          </div>
        </section>

        {/* Postman */}
        <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-2">🧪 Postman Test</h2>
          <pre className="bg-black/40 p-3 rounded text-sm">
{String.raw`POST http://localhost:7000/api/generate

Headers:
  Content-Type: application/json
  x-api-key: YOUR_KEY

Body:
{
  "prompt": "Write teddy bear offer 💝"
}`}
          </pre>
        </section>

        {/* Example Prompts */}
        <section className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-2">💡 Example Prompts</h2>
          <pre className="bg-black/40 p-3 rounded text-sm">
{String.raw`"Toy sale 1 line caption"
"Kids story about rabbit"
"Rewrite professional job summary"
"Product description for toy car"
"Title ideas (10 options)"
`}
          </pre>
        </section>

      </div>

      <footer className="text-center opacity-60 mt-10">
        Powered by Your AI Server © 2025
      </footer>
    </div>
  );
}
