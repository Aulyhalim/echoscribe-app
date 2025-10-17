import { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ParticlesBackground from './components/ParticlesBackground';
import AudioUploader from './components/AudioUploader';
import TranscriptDisplay from './components/TranscriptDisplay';
import SummaryDisplay from './components/SummaryDisplay';
import Footer from './components/Footer'; // <-- 1. Import Footer
import { Toaster } from 'sonner';
import { TranscriptData } from './types';

function App() {
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleUploadStart = () => {
    setIsLoading(true);
    setShowResults(false);
    setTranscriptData(null);
  };

  const handleTranscriptReceived = (data: TranscriptData) => {
    setTranscriptData(data);
    setIsLoading(false);
    setShowResults(true);
  };

  const handleReset = () => {
    setTranscriptData(null);
    setIsLoading(false);
    setShowResults(false);
  };

  useEffect(() => {
    if (showResults) {
      setTimeout(() => {
        const summaryElement = document.getElementById('summary-section');
        summaryElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [showResults]);

  return (
    // 2. Gunakan Flexbox untuk "mendorong" footer ke bawah
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden flex flex-col">
      <ParticlesBackground />
      <Header />
      {/* 3. Buat main content bisa "tumbuh" untuk mengisi ruang */}
      <main className="pt-24 pb-12 relative z-10 flex-grow">
        <div className="container mx-auto px-4 space-y-16">
          {!showResults && <HeroSection />}
          
          <AudioUploader
            onUploadStart={handleUploadStart}
            onTranscriptReceived={handleTranscriptReceived}
            onReset={handleReset}
            isLoading={isLoading}
          />

          {showResults && transcriptData && (
            <div className="space-y-12 fade-in slide-up">
              <div id="summary-section">
                <SummaryDisplay summary={transcriptData.summary} />
              </div>
              <TranscriptDisplay
                fullTranscript={transcriptData.full_transcript}
                speakerTranscript={transcriptData.speaker_transcript}
              />
            </div>
          )}
        </div>
      </main>
      <Toaster richColors position="top-right" />
      <Footer /> {/* <-- 4. Tambahkan komponen Footer di sini */}
    </div>
  );
}

export default App;