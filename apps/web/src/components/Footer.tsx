import React from 'react';
import { Link } from 'react-router-dom';
import { Gauge, Code, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border text-text-secondary py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center shadow-md">
                <Gauge className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-lg text-foreground">
                FH6<span className="text-primary">CARS</span>
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Standalone Forza Horizon 6 Car Database and public REST API for websites, tools, and automotive enthusiasts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-display font-semibold text-sm mb-3">Database</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/cars" className="hover:text-primary transition-colors">Browse All Cars</Link></li>
              <li><Link to="/brands" className="hover:text-primary transition-colors">Manufacturers</Link></li>
              <li><Link to="/compare" className="hover:text-primary transition-colors">Car Comparison</Link></li>
              <li><Link to="/cars?isDlc=true" className="hover:text-primary transition-colors">DLC Cars</Link></li>
            </ul>
          </div>

          {/* Developer API */}
          <div>
            <h4 className="text-foreground font-display font-semibold text-sm mb-3">Developers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/api" className="hover:text-primary transition-colors flex items-center space-x-1"><Code className="w-3.5 h-3.5"/><span>REST API Overview</span></Link></li>
              <li><a href="/api/docs" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center space-x-1"><Database className="w-3.5 h-3.5"/><span>Swagger UI Docs</span></a></li>
              <li><a href="/api/v1/statistics" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">API Statistics JSON</a></li>
            </ul>
          </div>

          {/* Legal / Information */}
          <div>
            <h4 className="text-foreground font-display font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-primary transition-colors">About & Sources</Link></li>
              <li className="text-text-muted pt-2 text-[11px]">Not affiliated with Playground Games or Turn 10 Studios.</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border/60 text-center text-xs text-text-muted">
          © {new Date().getFullYear()} FH6 Cars Platform. Open REST API for Forza Horizon 6.
        </div>
      </div>
    </footer>
  );
};
