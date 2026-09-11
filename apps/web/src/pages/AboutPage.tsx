import React from 'react';
import { Database, ShieldCheck, Cpu, Code2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 transition-colors">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
          <Database className="w-4 h-4 text-primary" />
          <span>About FH6 Cars Platform</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl text-foreground">Public Car Database & REST API</h1>
        <p className="text-text-secondary text-sm max-w-2xl mx-auto leading-relaxed">
          FH6 Cars provides a centralized, normalized repository of Forza Horizon 6 car statistics, base PI ratings, engine specs, and manufacturers.
        </p>
      </div>

      {/* Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-sm">
          <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-lg text-foreground">Standalone Static Database</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            This platform is strictly an informational database and public REST API. It does NOT implement telemetry, Socket.IO, game memory reading, or live racing calculations.
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-sm">
          <div className="p-3 bg-success/10 text-success rounded-xl w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-lg text-foreground">Data Quality & Provenance</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            We prioritize accuracy. Missing or unverified statistics are stored as nulls rather than fabricated numbers. Every entry tracks its source and verification status.
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-card border border-border p-8 rounded-2xl space-y-4 shadow-sm">
        <h3 className="font-display font-bold text-xl text-foreground flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-primary" />
          <span>Technology Stack</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-surface p-3 rounded-xl border border-border text-foreground">
            Node.js / Express
          </div>
          <div className="bg-surface p-3 rounded-xl border border-border text-foreground">
            Prisma ORM & PostgreSQL
          </div>
          <div className="bg-surface p-3 rounded-xl border border-border text-foreground">
            React + Vite + Tailwind
          </div>
          <div className="bg-surface p-3 rounded-xl border border-border text-foreground">
            OpenAPI 3.0 / Swagger UI
          </div>
          <div className="bg-surface p-3 rounded-xl border border-border text-foreground">
            Zod & JWT Authentication
          </div>
          <div className="bg-surface p-3 rounded-xl border border-border text-foreground">
            TanStack Query
          </div>
        </div>
      </div>
    </div>
  );
};
