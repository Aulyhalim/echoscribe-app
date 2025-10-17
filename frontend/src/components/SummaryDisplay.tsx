import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Download, Sparkles, Lightbulb, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SummaryDisplayProps } from '@/types';

export default function SummaryDisplay({ summary }: SummaryDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast.success('Tersalin!', { description: 'Ringkasan telah disalin ke clipboard' });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Gagal menyalin', { description: 'Terjadi kesalahan saat menyalin ringkasan' });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `echoscribe-summary-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Download Berhasil', { description: 'Ringkasan telah diunduh' });
  };

  return (
    <Card className="w-full shadow-2xl bg-white/90 backdrop-blur-sm border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Ringkasan AI</h2>
              <p className="text-blue-100 text-sm">Dibuat oleh Gemini AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy} className="text-white hover:bg-white/20 backdrop-blur-sm">
              {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Tersalin!' : 'Salin'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload} className="text-white hover:bg-white/20 backdrop-blur-sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
        <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-blue-50 rounded-lg">
          <Lightbulb className="w-4 h-4 text-blue-500" />
          <p className="text-xs text-gray-600 text-center">
            Ringkasan ini dibuat otomatis oleh Gemini AI berdasarkan transkrip rapat.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
