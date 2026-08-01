export interface Tutorial {
  id: string;
  title: string;
  category: "basic" | "rigging" | "animating" | "fx" | "rendering" | "resource";
  description: string;
  youtubeId: string;
  duration?: string;
  difficulty?: "Pemula" | "Menengah" | "Mahir";
  publishDate: string;
  bullets?: string[];
}

export interface Attachment {
  name: string;
  fileSize: string;
  fileType: string;
  downloadUrl: string;
  description: string;
  category: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "system";
  content: string;
  timestamp: Date;
  status?: "sending" | "sent" | "error";
}
