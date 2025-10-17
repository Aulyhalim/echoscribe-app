// Interface untuk data transkrip yang diterima dari backend
export interface TranscriptData {
  full_transcript: string;
  speaker_transcript: SpeakerSegment[];
  summary: string;
}

// Interface untuk segmen speaker
export interface SpeakerSegment {
  speaker: string;
  start: string;
  end: string;
  text: string;
}

// Props untuk AudioUploader component
export interface AudioUploaderProps {
  onTranscriptReceived: (data: TranscriptData) => void;
  onUploadStart: () => void;
  onReset: () => void;
  isLoading: boolean;
}

// Props untuk TranscriptDisplay component
export interface TranscriptDisplayProps {
  fullTranscript: string;
  speakerTranscript: SpeakerSegment[];
}

// Props untuk SummaryDisplay component
export interface SummaryDisplayProps {
  summary: string;
}