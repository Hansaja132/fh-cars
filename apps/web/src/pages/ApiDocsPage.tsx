import React, { useState } from 'react';
import { Code, ExternalLink, Copy, Check, Terminal } from 'lucide-react';

export const ApiDocsPage: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const jsSnippet = `const response = await fetch("http://localhost:5000/api/v1/cars?brand=Toyota&class=A");
const data = await response.json();
console.log(data);`;

  const pythonSnippet = `import requests

url = "http://localhost:5000/api/v1/cars"
params = {"brand": "Toyota", "class": "A"}

response = requests.get(url, params=params)
data = response.json()
print(data)`;

  const curlSnippet = `curl -X GET "http://localhost:5000/api/v1/cars?page=1&limit=10" \\
  -H "Accept: application/json"`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 transition-colors">
      {/* Header */}
      <div className="bg-card border border-border p-8 rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-wider">
          <Code className="w-4 h-4" />
          <span>Public REST API Portal</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground">
          FH6 Cars REST API
        </h1>
        <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
          Access structured Forza Horizon 6 car statistics, base PI, engine specs, and manufacturers programmatically using standard HTTP JSON endpoints.
        </p>

        <div className="pt-2 flex flex-wrap gap-4">
          <a
            href="/api/docs"
            target="_blank"
            rel="noreferrer"
            className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs px-5 py-2.5 rounded-xl shadow flex items-center space-x-1.5 transition-transform active:scale-95"
          >
            <span>Open Swagger UI Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="/api/v1/statistics"
            target="_blank"
            rel="noreferrer"
            className="bg-surface hover:bg-muted text-foreground font-bold text-xs px-5 py-2.5 rounded-xl border border-border transition-colors shadow-sm"
          >
            Live JSON Stats Endpoint
          </a>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-xl text-foreground flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-primary" />
          <span>Core Public Endpoints</span>
        </h2>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm divide-y divide-border">
          <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div className="flex items-center space-x-3">
              <span className="bg-primary/10 text-primary font-mono text-xs px-2.5 py-1 rounded font-bold border border-primary/30">
                GET
              </span>
              <code className="font-mono text-sm text-foreground font-semibold">/api/v1/cars</code>
            </div>
            <span className="text-xs text-text-muted">Get paginated list of cars with filters (brand, class, PI, year, drivetrain)</span>
          </div>

          <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div className="flex items-center space-x-3">
              <span className="bg-primary/10 text-primary font-mono text-xs px-2.5 py-1 rounded font-bold border border-primary/30">
                GET
              </span>
              <code className="font-mono text-sm text-foreground font-semibold">/api/v1/cars/:id</code>
            </div>
            <span className="text-xs text-text-muted">Get complete details, ratings, engine, and images for a car</span>
          </div>

          <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div className="flex items-center space-x-3">
              <span className="bg-primary/10 text-primary font-mono text-xs px-2.5 py-1 rounded font-bold border border-primary/30">
                GET
              </span>
              <code className="font-mono text-sm text-foreground font-semibold">/api/v1/cars/search?q=supra</code>
            </div>
            <span className="text-xs text-text-muted">Search cars across model, manufacturer, and country</span>
          </div>

          <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div className="flex items-center space-x-3">
              <span className="bg-primary/10 text-primary font-mono text-xs px-2.5 py-1 rounded font-bold border border-primary/30">
                GET
              </span>
              <code className="font-mono text-sm text-foreground font-semibold">/api/v1/brands</code>
            </div>
            <span className="text-xs text-text-muted">Get list of manufacturers and car counts</span>
          </div>

          <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div className="flex items-center space-x-3">
              <span className="bg-primary/10 text-primary font-mono text-xs px-2.5 py-1 rounded font-bold border border-primary/30">
                GET
              </span>
              <code className="font-mono text-sm text-foreground font-semibold">/api/v1/statistics</code>
            </div>
            <span className="text-xs text-text-muted">Get overall database breakdown and class distribution</span>
          </div>
        </div>
      </div>

      {/* Code Examples (Dark Technical Appearance across all modes) */}
      <div className="space-y-6">
        <h2 className="font-display font-bold text-xl text-foreground">Integration Code Snippets</h2>

        {/* JavaScript */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-xs font-bold text-text-secondary">
            <span>JavaScript (Fetch / Node.js / React)</span>
            <button
              onClick={() => copyToClipboard(jsSnippet, 1)}
              className="text-text-muted hover:text-foreground flex items-center space-x-1 transition-colors"
            >
              {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 1 ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="bg-[#0B0F14] text-[#22D3EE] p-4 rounded-xl text-xs font-mono border border-[#263341] overflow-x-auto shadow-inner">
            {jsSnippet}
          </pre>
        </div>

        {/* Python */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-xs font-bold text-text-secondary">
            <span>Python (requests)</span>
            <button
              onClick={() => copyToClipboard(pythonSnippet, 2)}
              className="text-text-muted hover:text-foreground flex items-center space-x-1 transition-colors"
            >
              {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 2 ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="bg-[#0B0F14] text-[#7DD3FC] p-4 rounded-xl text-xs font-mono border border-[#263341] overflow-x-auto shadow-inner">
            {pythonSnippet}
          </pre>
        </div>

        {/* cURL */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-xs font-bold text-text-secondary">
            <span>cURL Command Line</span>
            <button
              onClick={() => copyToClipboard(curlSnippet, 3)}
              className="text-text-muted hover:text-foreground flex items-center space-x-1 transition-colors"
            >
              {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 3 ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="bg-[#0B0F14] text-[#22C55E] p-4 rounded-xl text-xs font-mono border border-[#263341] overflow-x-auto shadow-inner">
            {curlSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
