import React from 'react';
import { Database, ShieldCheck, Cpu, Code2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-red-600/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Database className="w-4 h-4 text-red-500" />
          <span>About FH6 Cars Platform</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl text-white">Public Car Database & REST API</h1>
        <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
          FH6 Cars provides a centralized, normalized repository of Forza Horizon 6 car statistics, base PI ratings, engine specs, and manufacturers.
        </p>
      </div>

      {/* Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="p-3 bg-red-600/10 text-red-400 rounded-xl w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">Standalone Static Database</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            This platform is strictly an informational database and public REST API. It does NOT implement telemetry, Socket.IO, game memory reading, or live racing calculations.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">Data Quality & Provenance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We prioritize accuracy. Missing or unverified statistics are stored as nulls rather than fabricated numbers. Every entry tracks its source and verification status.
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-2xl space-y-4">
        <h3 className="font-display font-bold text-xl text-white flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-red-500" />
          <span>Technology Stack</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
            Node.js / Express
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
            Prisma ORM & PostgreSQL
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
            React + Vite + Tailwind
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
            OpenAPI 3.0 / Swagger UI
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
            Zod & JWT Authentication
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
            TanStack Query
          </div>
        </div>
      </div>
    </div>
  );
};
