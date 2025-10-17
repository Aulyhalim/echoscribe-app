import { Mic, Heart, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-white/50 backdrop-blur-sm border-t border-slate-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mic className="w-5 h-5 text-blue-500" />
            <span>&copy; {currentYear} EchoScribe. Dibuat dengan Aulyyu</span>
            <Heart className="w-5 h-5 text-red-500" />
            <span>di Indonesia.</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/Aulyhalim/echoscribe-app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>Lihat di GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;