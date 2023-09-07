export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Tweets: {
        Row: {
          context: string;
          costCredits: number;
          createdAt: string;
          emotion: Database["public"]["Enums"]["Emotion"];
          generated: string;
          gptModel: string;
          id: string;
          instructions: string | null;
          isFavorited: boolean;
          isPublished: boolean;
          isShared: boolean;
          lang: Database["public"]["Enums"]["Lang"];
          negativeInstructions: string | null;
          sharedTemplateSlug: string | null;
          style: Database["public"]["Enums"]["Style"];
          target: Database["public"]["Enums"]["Target"];
          tone: Database["public"]["Enums"]["Tone"];
          tweetUrl: string | null;
          updatedAt: string;
          userId: string;
        };
        Insert: {
          context: string;
          costCredits: number;
          createdAt?: string;
          emotion: Database["public"]["Enums"]["Emotion"];
          generated: string;
          gptModel: string;
          id: string;
          instructions?: string | null;
          isFavorited?: boolean;
          isPublished?: boolean;
          isShared?: boolean;
          lang: Database["public"]["Enums"]["Lang"];
          negativeInstructions?: string | null;
          sharedTemplateSlug?: string | null;
          style: Database["public"]["Enums"]["Style"];
          target: Database["public"]["Enums"]["Target"];
          tone: Database["public"]["Enums"]["Tone"];
          tweetUrl?: string | null;
          updatedAt: string;
          userId: string;
        };
        Update: {
          context?: string;
          costCredits?: number;
          createdAt?: string;
          emotion?: Database["public"]["Enums"]["Emotion"];
          generated?: string;
          gptModel?: string;
          id?: string;
          instructions?: string | null;
          isFavorited?: boolean;
          isPublished?: boolean;
          isShared?: boolean;
          lang?: Database["public"]["Enums"]["Lang"];
          negativeInstructions?: string | null;
          sharedTemplateSlug?: string | null;
          style?: Database["public"]["Enums"]["Style"];
          target?: Database["public"]["Enums"]["Target"];
          tone?: Database["public"]["Enums"]["Tone"];
          tweetUrl?: string | null;
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Tweets_userId_fkey";
            columns: ["userId"];
            referencedRelation: "User";
            referencedColumns: ["id"];
          }
        ];
      };
      User: {
        Row: {
          credits: number;
          email: string;
          id: string;
          saveTweets: boolean;
        };
        Insert: {
          credits?: number;
          email: string;
          id: string;
          saveTweets?: boolean;
        };
        Update: {
          credits?: number;
          email?: string;
          id?: string;
          saveTweets?: boolean;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      [_ in never]: never
    };
    Enums: {
      Emotion:
        | "DEFAULT"
        | "ENTHUSIASM"
        | "MELANCHOLY"
        | "JOY"
        | "ANXIETY"
        | "CONFIDENCE"
        | "WONDER"
        | "ANGER"
        | "COMPASSION"
        | "EXHAUSTION"
        | "CRITICAL_THINKING";
      Lang:
        | "id"
        | "da"
        | "de"
        | "en_GB"
        | "en_US"
        | "es_ES"
        | "fr"
        | "hr"
        | "it"
        | "lt"
        | "hu"
        | "nl"
        | "no"
        | "pl"
        | "pt_BR"
        | "ro"
        | "fi"
        | "sv_SE"
        | "vi"
        | "tr"
        | "cs"
        | "el"
        | "bg"
        | "ru"
        | "uk"
        | "hi"
        | "th"
        | "zh_CN"
        | "ja"
        | "zh_TW"
        | "ko"
        | "ar";
      Style:
        | "DEFAULT"
        | "INFORMATIVE"
        | "POETIC"
        | "HUMOROUS"
        | "FORMAL"
        | "PERSUASIVE"
        | "DESCRIPTIVE"
        | "SCIENTIFIC"
        | "NARRATIVE"
        | "EDUCATIONAL";
      Target:
        | "ALL"
        | "ENTERPRISES"
        | "PROFESSIONALS"
        | "PARTICULARS"
        | "ENTREPRENEURS"
        | "STUDENTS"
        | "CHILDREN"
        | "TEENAGERS"
        | "ADULTS"
        | "SENIORS"
        | "PARENTS";
      Tone:
        | "DEFAULT"
        | "OPTIMISTIC"
        | "IRONIC"
        | "AUTHORITATIVE"
        | "EMPHATIC"
        | "DETACHED"
        | "SATIRICAL"
        | "REFLECTIVE"
        | "INTIMATE"
        | "ENGAGED"
        | "POSITIVE";
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
}