import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Upload, 
  FileAudio, 
  X, 
  RefreshCw, 
  Target, 
  Users, 
  Sparkles,
  CheckCircle,
  Loader2 
} from 'lucide-react';
import { AudioUploaderProps } from '@/types';
import { transcribeAudio, validateAudioFile } from '@/lib/api';

export default function AudioUploader({ 
  onTranscriptReceived, 
  onUploadStart, 
  onReset, 
  isLoading 
}: AudioUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (selectedFile: File) => {
    const validation = validateAudioFile(selectedFile);
    if (!validation.isValid) {
      toast.error('Format File Tidak Valid', {
        description: validation.error ?? "Unknown error",
      });
      return;
    }

    setFile(selectedFile);
    toast.success('File Terpilih', {
      description: `${selectedFile.name} siap diproses`,
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Tidak Ada File', {
        description: 'Mohon pilih file audio terlebih dahulu',
      });
      return;
    }

    onUploadStart();
    setUploadProgress(0);

    try {
      toast.loading('Memproses Audio', {
        description: 'Sedang melakukan transkripsi dan diarisasi speaker...',
        id: 'upload-toast',
      });

      const data = await transcribeAudio(file, setUploadProgress);
      
      toast.success('Berhasil!', {
        description: 'Transkripsi dan ringkasan AI telah selesai dibuat',
        id: 'upload-toast',
      });

      onTranscriptReceived(data);
      setUploadProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal', {
        description: 'Terjadi kesalahan saat memproses audio. Silakan coba lagi.',
        id: 'upload-toast',
      });
      onReset();
      setUploadProgress(0);
    }
  };

  const handleLocalReset = () => {
    setFile(null);
    setUploadProgress(0);
    onReset();
  };

  return (
    <div className="upload-float">
      <Card className="w-full max-w-2xl mx-auto glass-card hover-lift border-0 shadow-2xl">
        <CardContent className="p-8">
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl hero-icon">
                <FileAudio className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-3">
                Upload File Audio Rapat
              </h2>
              <p className="text-gray-600 text-lg">
                Kami mendukung format WAV, MP3, M4A, dan OGG (maks. 100MB)
              </p>
            </div>

            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50 scale-105' 
                  : file 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
              }`}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            >
              <div className="text-center">
                <div className="mb-4">
                  {dragActive ? (
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500 flex items-center justify-center animate-bounce"><Upload className="w-8 h-8 text-white" /></div>
                  ) : file ? (
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-green-500 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-white" /></div>
                  ) : (
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center"><Upload className="w-8 h-8 text-white" /></div>
                  )}
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {dragActive ? 'Lepaskan file di sini...' : file ? 'File siap diproses!' : 'Drag & drop file audio atau klik untuk browse'}
                </p>
                <p className="text-sm text-gray-500">
                  Format yang didukung: WAV, MP3, M4A, OGG
                </p>
              </div>
              <input type="file" accept="audio/*" onChange={handleInputChange} disabled={isLoading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
            </div>

            {file && (
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 slide-up">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center"><FileAudio className="w-6 h-6 text-white" /></div>
                      <div>
                        <p className="font-semibold text-gray-800 truncate max-w-[200px] sm:max-w-xs md:max-w-sm">{file.name}</p>
                        <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}</p>
                      </div>
                    </div>
                    {!isLoading && (<Button variant="ghost" size="sm" onClick={handleLocalReset} className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"><X className="w-5 h-5" /></Button>)}
                  </div>
                </CardContent>
              </Card>
            )}

            {isLoading && (
              <div className="space-y-4 slide-up">
                <div className="relative overflow-hidden rounded-full"><Progress value={uploadProgress} className="h-4" /><div className="progress-glow" /></div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin text-blue-500" /><span className="text-sm font-medium text-gray-700">{uploadProgress < 100 ? 'Mengupload dan memproses...' : 'Menyelesaikan transkripsi...'}</span></div>
                  <span className="text-sm font-bold text-blue-600">{uploadProgress}%</span>
                </div>
                <div className="text-center"><p className="text-xs text-gray-500">Proses ini mungkin memerlukan beberapa menit tergantung ukuran file</p></div>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" disabled={!file || isLoading} onClick={handleUpload} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl hover-lift px-8 py-3 text-lg font-semibold">
                {isLoading ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />Memproses...</>) : (<><Sparkles className="w-5 h-5 mr-2" />Mulai Transkripsi AI</>)}
              </Button>

              {file && !isLoading && (
                <Button variant="outline" size="lg" onClick={handleLocalReset} className="border-red-200 text-red-600 hover:bg-red-50 hover-lift px-6"><RefreshCw className="w-5 h-5 mr-2" />Reset</Button>
              )}
            </div>

            {!file && !isLoading && (
              <Card className="glass-card border-gray-200"><CardContent className="p-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center hover-lift"><div className="flex items-center justify-center gap-2 mb-3"><Target className="w-5 h-5 text-blue-500" /><Badge variant="secondary" className="bg-blue-100 text-blue-700 font-semibold">AKURAT</Badge></div><p className="text-sm text-gray-600 font-medium">Powered by Whisper AI</p><p className="text-xs text-gray-500 mt-1">Akurasi tinggi untuk berbagai bahasa</p></div>
                    <div className="text-center hover-lift"><div className="flex items-center justify-center gap-2 mb-3"><Users className="w-5 h-5 text-purple-500" /><Badge variant="secondary" className="bg-purple-100 text-purple-700 font-semibold">MULTI-SPEAKER</Badge></div><p className="text-sm text-gray-600 font-medium">Identifikasi pembicara</p><p className="text-xs text-gray-500 mt-1">Pisahkan percakapan per speaker</p></div>
                    <div className="text-center hover-lift"><div className="flex items-center justify-center gap-2 mb-3"><Sparkles className="w-5 h-5 text-pink-500 sparkle-icon" /><Badge variant="secondary" className="bg-pink-100 text-pink-700 font-semibold">SMART SUMMARY</Badge></div><p className="text-sm text-gray-600 font-medium">Ringkasan oleh Gemini</p><p className="text-xs text-gray-500 mt-1">Ekstrak poin penting otomatis</p></div>
              </div></CardContent></Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
