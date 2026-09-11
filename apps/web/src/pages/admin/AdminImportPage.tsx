import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { ImportSummary } from '@fh6-cars/shared';
import { FileSpreadsheet, UploadCloud, ArrowLeft, CheckCircle } from 'lucide-react';

export const AdminImportPage: React.FC = () => {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileType, setFileType] = useState<'json' | 'csv'>('json');
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const isCsv = file.name.endsWith('.csv');
    setFileType(isCsv ? 'csv' : 'json');

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent((event.target?.result as string) || '');
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = async () => {
    if (!fileContent.trim()) {
      setErrorMsg('Please select or paste valid JSON or CSV content.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    try {
      const res = await apiService.importCars(fileContent, fileType);
      setSummary(res);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'Failed to execute import.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors">
      <Link to="/admin" className="inline-flex items-center space-x-2 text-xs font-semibold text-text-muted hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </Link>

      <div className="bg-card border border-border p-8 rounded-3xl space-y-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-wider">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Batch Data Ingestion</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-foreground">Import Cars (JSON / CSV)</h1>
          <p className="text-xs text-text-muted">
            Upload or paste formatted car data. Records will be validated before insertion.
          </p>
        </div>

        {/* Upload Zone */}
        <div className="border-2 border-dashed border-border hover:border-primary p-8 rounded-2xl text-center space-y-4 transition-colors bg-surface/50">
          <UploadCloud className="w-10 h-10 text-text-muted mx-auto" />
          <div className="space-y-1">
            <div className="text-sm font-bold text-foreground">Choose cars.json or cars.csv</div>
            <div className="text-xs text-text-muted">Supports array of JSON objects or CSV with headers</div>
          </div>
          <input
            type="file"
            accept=".json,.csv,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="file-input-btn"
          />
          <label
            htmlFor="file-input-btn"
            className="inline-block bg-surface hover:bg-muted text-foreground font-bold text-xs px-4 py-2 rounded-xl cursor-pointer border border-border transition-colors shadow-sm"
          >
            Select File
          </label>
          {fileName && <div className="text-xs font-mono text-primary font-bold">Selected: {fileName}</div>}
        </div>

        {/* Format Selector & Textarea Fallback */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-text-secondary">
            <span>Or Paste Raw Content Below</span>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => setFileType('json')}
                className={`px-2 py-0.5 rounded font-mono text-xs transition-colors ${
                  fileType === 'json' ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted text-text-muted hover:text-foreground'
                }`}
              >
                JSON
              </button>
              <button
                type="button"
                onClick={() => setFileType('csv')}
                className={`px-2 py-0.5 rounded font-mono text-xs transition-colors ${
                  fileType === 'csv' ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted text-text-muted hover:text-foreground'
                }`}
              >
                CSV
              </button>
            </div>
          </div>
          <textarea
            rows={8}
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            placeholder='[{"year": 2022, "brand": "Toyota", "model": "GR Supra", "class": "A", "basePi": 742, "drivetrain": "RWD", "carType": "Sports Car"}]'
            className="w-full bg-surface font-mono text-xs text-foreground placeholder:text-text-muted p-4 rounded-xl border border-border focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {errorMsg && (
          <div className="bg-danger/10 border border-danger/30 p-4 rounded-xl text-xs text-danger">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleExecuteImport}
          disabled={isLoading || !fileContent.trim()}
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs py-3 rounded-xl shadow transition-transform active:scale-98 disabled:opacity-50"
        >
          {isLoading ? 'Processing & Validating Data...' : 'Run Data Import Process'}
        </button>

        {/* Results Summary Box */}
        {summary && (
          <div className="bg-surface border border-border p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-lg text-foreground flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>Import Summary Report</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
              <div className="bg-card p-3 rounded-xl border border-border">
                <div className="text-2xl font-bold text-foreground">{summary.total}</div>
                <div className="text-[10px] text-text-muted uppercase">Total Records</div>
              </div>
              <div className="bg-card p-3 rounded-xl border border-border">
                <div className="text-2xl font-bold text-success">{summary.inserted}</div>
                <div className="text-[10px] text-text-muted uppercase">Inserted</div>
              </div>
              <div className="bg-card p-3 rounded-xl border border-border">
                <div className="text-2xl font-bold text-warning">{summary.updated}</div>
                <div className="text-[10px] text-text-muted uppercase">Updated</div>
              </div>
              <div className="bg-card p-3 rounded-xl border border-border">
                <div className="text-2xl font-bold text-danger">{summary.errors}</div>
                <div className="text-[10px] text-text-muted uppercase">Errors</div>
              </div>
            </div>

            {summary.details && summary.details.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-bold text-text-secondary">Detailed Execution Logs:</div>
                <div className="bg-card p-3 rounded-xl text-[11px] font-mono text-text-secondary max-h-48 overflow-y-auto space-y-1 border border-border">
                  {summary.details.map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
