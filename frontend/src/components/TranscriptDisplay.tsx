import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Copy, Download, Users, FileText, Clock, CheckCircle } from 'lucide-react';
import { TranscriptDisplayProps } from '@/types';

export default function TranscriptDisplay({ fullTranscript, speakerTranscript }: TranscriptDisplayProps) {
  const [copied, setCopied] = useState(false);

  const speakerColors: { [key: string]: string } = {
    SPEAKER_00: 'border-blue-500',
    SPEAKER_01: 'border-purple-500',
    SPEAKER_02: 'border-green-500',
    SPEAKER_03: 'border-orange-500',
    SPEAKER_04: 'border-pink-500',
    SPEAKER_05: 'border-cyan-500',
  };

  const speakerBgColors: { [key: string]: string } = {
    SPEAKER_00: 'bg-blue-500',
    SPEAKER_01: 'bg-purple-500',
    SPEAKER_02: 'bg-green-500',
    SPEAKER_03: 'bg-orange-500',
    SPEAKER_04: 'bg-pink-500',
    SPEAKER_05: 'bg-cyan-500',
  }

  const formatTime = (seconds: string) => {
    const totalSeconds = parseFloat(seconds);
    if (isNaN(totalSeconds)) return "0:00";
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Tersalin!', { description: 'Transkrip telah disalin ke clipboard' });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Gagal menyalin', { description: 'Terjadi kesalahan saat menyalin transkrip' });
    }
  };

  const handleDownloadTranscript = () => {
    let content = '# Transkrip Lengkap EchoScribe\n\n';
    content += `Tanggal: ${new Date().toLocaleString('id-ID')}\n\n---\n\n`;
    speakerTranscript.forEach((item) => {
      content += `**${item.speaker}** [${formatTime(item.start)} - ${formatTime(item.end)}]\n`;
      content += `${item.text}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `echoscribe-transcript-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Download Berhasil', { description: 'Transkrip telah diunduh' });
  };

  return (
    <Card className="w-full glass-card hover-lift border-0 shadow-2xl slide-up">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text">Transkrip Lengkap</h2>
              <p className="text-gray-600">{speakerTranscript.length} segmen percakapan</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleDownloadTranscript} className="gap-2 hover-lift">
            <Download className="w-4 h-4" /> Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="speaker" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="speaker" className="gap-2"><Users className="w-4 h-4" /> Per Pembicara</TabsTrigger>
            <TabsTrigger value="full" className="gap-2"><FileText className="w-4 h-4" /> Teks Penuh</TabsTrigger>
          </TabsList>

          <TabsContent value="speaker">
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {speakerTranscript.map((item, index) => {
                const borderColor = speakerColors[item.speaker] || 'border-gray-500';
                const bgColor = speakerBgColors[item.speaker] || 'bg-gray-500';
                return (
                  <Card key={index} className={`border-l-4 ${borderColor} timeline-item`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}><Users className="w-4 h-4 text-white" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant="secondary" className="font-medium">{item.speaker.replace('_', ' ')}</Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500"><Clock className="w-3 h-3" /><span>{formatTime(item.start)} - {formatTime(item.end)}</span></div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="full">
            <Card className="relative glass-card">
              <CardContent className="p-6">
                <div className="absolute top-4 right-4 z-10">
                  <Button variant="outline" size="sm" onClick={() => handleCopy(fullTranscript)} className="gap-2">
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Tersalin!' : 'Salin'}
                  </Button>
                </div>
                <div className="max-h-96 overflow-y-auto pr-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{fullTranscript}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200"><p className="text-xs text-gray-500 text-center">Total karakter: {fullTranscript.length.toLocaleString('id-ID')}</p></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
