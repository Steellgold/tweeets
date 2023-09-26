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
      Invite: {
        Row: {
          createdAt: string;
          email: string;
          id: string;
          isVerified: boolean;
          updatedAt: string;
          used: number;
          userId: string;
          views: number;
        };
        Insert: {
          createdAt?: string;
          email: string;
          id: string;
          isVerified?: boolean;
          updatedAt: string;
          used?: number;
          userId: string;
          views?: number;
        };
        Update: {
          createdAt?: string;
          email?: string;
          id?: string;
          isVerified?: boolean;
          updatedAt?: string;
          used?: number;
          userId?: string;
          views?: number;
        };
        Relationships: [
          {
            foreignKeyName: "Invite_userId_fkey";
            columns: ["userId"];
            referencedRelation: "User";
            referencedColumns: ["id"];
          }
        ];
      };
      Payments: {
        Row: {
          amount: number;
          createdAt: string;
          currency: string;
          email: string | null;
          id: string;
          invoiceUrl: string | null;
          referenceId: string | null;
          status: Database["public"]["Enums"]["PAYMENT_STATUS"];
          updatedAt: string;
          userId: string;
        };
        Insert: {
          amount: number;
          createdAt?: string;
          currency: string;
          email?: string | null;
          id: string;
          invoiceUrl?: string | null;
          referenceId?: string | null;
          status?: Database["public"]["Enums"]["PAYMENT_STATUS"];
          updatedAt: string;
          userId: string;
        };
        Update: {
          amount?: number;
          createdAt?: string;
          currency?: string;
          email?: string | null;
          id?: string;
          invoiceUrl?: string | null;
          referenceId?: string | null;
          status?: Database["public"]["Enums"]["PAYMENT_STATUS"];
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Payments_userId_fkey";
            columns: ["userId"];
            referencedRelation: "User";
            referencedColumns: ["id"];
          }
        ];
      };
      Tweets: {
        Row: {
          context: string;
          createdAt: string;
          emotion: Database["public"]["Enums"]["Emotion"];
          generated: string;
          gpt: number;
          id: string;
          isShared: boolean;
          lang: Database["public"]["Enums"]["Lang"];
          sharedTemplateSlug: string | null;
          style: Database["public"]["Enums"]["Style"];
          target: Database["public"]["Enums"]["Target"];
          tone: Database["public"]["Enums"]["Tone"];
          updatedAt: string;
          userId: string;
          v: Database["public"]["Enums"]["TWEEETS_VERSION_GENERATED"];
        };
        Insert: {
          context?: string;
          createdAt?: string;
          emotion?: Database["public"]["Enums"]["Emotion"];
          generated?: string;
          gpt?: number;
          id: string;
          isShared?: boolean;
          lang?: Database["public"]["Enums"]["Lang"];
          sharedTemplateSlug?: string | null;
          style?: Database["public"]["Enums"]["Style"];
          target?: Database["public"]["Enums"]["Target"];
          tone?: Database["public"]["Enums"]["Tone"];
          updatedAt?: string;
          userId: string;
          v?: Database["public"]["Enums"]["TWEEETS_VERSION_GENERATED"];
        };
        Update: {
          context?: string;
          createdAt?: string;
          emotion?: Database["public"]["Enums"]["Emotion"];
          generated?: string;
          gpt?: number;
          id?: string;
          isShared?: boolean;
          lang?: Database["public"]["Enums"]["Lang"];
          sharedTemplateSlug?: string | null;
          style?: Database["public"]["Enums"]["Style"];
          target?: Database["public"]["Enums"]["Target"];
          tone?: Database["public"]["Enums"]["Tone"];
          updatedAt?: string;
          userId?: string;
          v?: Database["public"]["Enums"]["TWEEETS_VERSION_GENERATED"];
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
          arobase: string;
          createdAt: string;
          credits: number;
          email: string;
          id: string;
          invitedBy: string | null;
          isFreeCredit: boolean;
          pictureUrl: string | null;
          updatedAt: string;
          username: string;
        };
        Insert: {
          arobase: string;
          createdAt?: string;
          credits?: number;
          email: string;
          id: string;
          invitedBy?: string | null;
          isFreeCredit?: boolean;
          pictureUrl?: string | null;
          updatedAt?: string;
          username?: string;
        };
        Update: {
          arobase?: string;
          createdAt?: string;
          credits?: number;
          email?: string;
          id?: string;
          invitedBy?: string | null;
          isFreeCredit?: boolean;
          pictureUrl?: string | null;
          updatedAt?: string;
          username?: string;
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
      PAYMENT_STATUS: "PENDING" | "COMPLETED" | "FAILED";
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
      TWEEETS_VERSION_GENERATED: "V1" | "V2";
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
}