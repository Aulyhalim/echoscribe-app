import { Badge } from '@/components/ui/badge';
import { Sparkles, Mic, Users, Brain, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="mb-8 flex justify-center">
          <Badge 
            variant="secondary" 
            className="glass-card text-blue-700 px-6 py-3 text-sm font-medium hover-lift animate-pulse"
          >
            <Sparkles className="w-4 h-4 mr-2 sparkle-icon" />
            Powered by Whisper & Gemini AI
          </Badge>
        </div>

        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="hero-icon w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <h1 className="hero-title text-6xl md:text-8xl font-bold gradient-text">
            EchoScribe
          </h1>
        </div>

        <div className="mb-12 space-y-4">
          <p className="text-xl md:text-3xl text-gray-700 font-medium leading-relaxed max-w-4xl mx-auto slide-up">
            Transformasikan rekaman rapat Anda menjadi
          </p>
          <p className="text-xl md:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold slide-up">
            transkrip terstruktur dan ringkasan cerdas
          </p>
          <p className="text-lg md:text-xl text-gray-600 slide-up">
            dalam hitungan detik
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-12">
          <div className="flex items-center gap-3 glass-card rounded-full px-6 py-3 border border-green-200 hover-lift">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse" />
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Speaker Diarization</span>
          </div>
          <div className="flex items-center gap-3 glass-card rounded-full px-6 py-3 border border-blue-200 hover-lift" style={{ animationDelay: '0.2s' }}>
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            <Brain className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">AI Summary</span>
          </div>
          <div className="flex items-center gap-3 glass-card rounded-full px-6 py-3 border border-purple-200 hover-lift" style={{ animationDelay: '0.4s' }}>
            <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
            <Zap className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">Real-time Processing</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}
