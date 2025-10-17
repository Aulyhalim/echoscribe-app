import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Github, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EchoScribe
            </h1>
            <Badge variant="secondary" className="text-xs">
              v1.0
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Info className="w-4 h-4" />
                Info
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tentang EchoScribe</DialogTitle>
                <DialogDescription className="space-y-2 pt-2">
                  <p>Platform transkripsi rapat otomatis dengan AI.</p>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Teknologi yang Digunakan:</h4>
                    <ul className="text-sm list-disc list-inside space-y-1">
                      <li>Speaker Diarization dengan Pyannote</li>
                      <li>Transkripsi Akurat dengan Whisper AI</li>
                      <li>Ringkasan Cerdas dengan Gemini</li>
                    </ul>
                  </div>
                  <p className="text-xs text-muted-foreground pt-4">
                    Dibuat dengan React + FastAPI
                  </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <a href="https://github.com/Aulyhalim/echoscribe-app" target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
