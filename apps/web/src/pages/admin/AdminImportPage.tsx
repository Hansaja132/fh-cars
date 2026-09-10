import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { ImportSummary } from '@fh6-cars/shared';
import { FileSpreadsheet, UploadCloud, ArrowLeft, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link to="/admin" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </Link>

      <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl space-y-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Batch Data Ingestion</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-white">Import Cars (JSON / CSV)</h1>
          <p className="text-xs text-slate-400">
            Upload or paste formatted car data. Records will be validated before insertion.
          </p>
        </div>

        {/* Upload Zone */}
        <div className="border-2 border-dashed border-slate-700 hover:border-red-500/50 p-8 rounded-2xl text-center space-y-4 transition-colors bg-slate-950/40">
          <UploadCloud className="w-10 h-10 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <div className="text-sm font-bold text-white">Choose cars.json or cars.csv</div>
            <div className="text-xs text-slate-400">Supports array of JSON objects or CSV with headers</div>
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
            className="inline-block bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer border border-slate-700"
          >
            Select File
          </label>
          {fileName && <div className="text-xs font-mono text-emerald-400">Selected: {fileName}</div>}
        </div>

        {/* Format Selector & Textarea Fallback */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
            <span>Or Paste Raw Content Below</span>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => setFileType('json')}
                className={`px-2 py-0.5 rounded font-mono text-xs ${
                  fileType === 'json' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                JSON
              </button>
              <button
                type="button"
                onClick={() => setFileType('csv')}
                className={`px-2 py-0.5 rounded font-mono text-xs ${
                  fileType === 'csv' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
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
            className="w-full bg-slate-950 font-mono text-xs text-slate-200 p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-red-500"
          />
        </div>

        {errorMsg && (
          <div className="bg-red-950/60 border border-red-500/40 p-4 rounded-xl text-xs text-red-200">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleExecuteImport}
          disabled={isLoading || !fileContent.trim()}
          className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold text-xs py-3 rounded-xl shadow-lg disabled:opacity-50"
        >
          {isLoading ? 'Processing & Validating Data...' : 'Run Data Import Process'}
        </button>

        {/* Results Summary Box */}
        {summary && (
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="font-display font-bold text-lg text-white flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Import Summary Report</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-2xl font-bold text-white">{summary.total}</div>
                <div className="text-[10px] text-slate-400 uppercase">Total Records</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-2xl font-bold text-emerald-400">{summary.inserted}</div>
                <div className="text-[10px] text-slate-400 uppercase">Inserted</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-2xl font-bold text-amber-400">{summary.updated}</div>
                <div className="text-[10px] text-slate-400 uppercase">Updated</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-2xl font-bold text-rose-400">{summary.errors}</div>
                <div className="text-[10px] text-slate-400 uppercase">Errors</div>
              </div>
            </div>

            {summary.details && summary.details.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-300">Detailed Execution Logs:</div>
                <div className="bg-slate-900 p-3 rounded-xl text-[11px] font-mono text-slate-300 max-h-48 overflow-y-auto space-y-1">
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
