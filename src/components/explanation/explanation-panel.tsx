"use client";

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  X,
  HelpCircle,
  Loader2,
  Info,
  BookOpen,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkPlus,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

// ExplanationPanel component
interface ExplanationPanelProps {
  content: string | null;
  isLoading: boolean;
  questionTitle: string;
  onClose: () => void;
  questionId?: number;
}

export function ExplanationPanel({
  content,
  isLoading,
  questionTitle,
  onClose,
  questionId,
}: ExplanationPanelProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    summary: true,
    details: false,
    tips: false,
  });

  const parsedContent = React.useMemo(() => {
    if (!content) return null;

    const sections = {
      summary: "",
      details: "",
      tips: "",
      conclusion: "",
    };

    const paragraphs = content.split("\n\n");

    if (paragraphs.length >= 1) {
      sections.summary = paragraphs[0];
    }

    if (paragraphs.length >= 3) {
      sections.details = paragraphs.slice(1, -1).join("\n\n");
      sections.conclusion = paragraphs[paragraphs.length - 1];
    } else if (paragraphs.length === 2) {
      sections.details = paragraphs[1];
    }

    const tipsRegex = /(tip|hint|remember|note|important):/i;
    paragraphs.forEach((p) => {
      if (tipsRegex.test(p)) {
        sections.tips += p + "\n\n";
      }
    });

    // Replace all instances of ** with <strong> tags
    Object.keys(sections).forEach((key) => {
      if (sections[key as keyof typeof sections]) {
        sections[key as keyof typeof sections] = sections[
          key as keyof typeof sections
        ].replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      }
    });

    return sections;
  }, [content]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    if (!bookmarked) {
      toast.success("Explanation saved to bookmarks", {
        icon: "🔖",
        duration: 2000,
      });
    } else {
      toast("Removed from bookmarks", {
        icon: "🗑️",
        duration: 2000,
      });
    }

    if (questionId) {
      const bookmarks = JSON.parse(
        localStorage.getItem("explanation_bookmarks") || "[]"
      );
      if (!bookmarked) {
        localStorage.setItem(
          "explanation_bookmarks",
          JSON.stringify([...bookmarks, { questionId, title: questionTitle }])
        );
      } else {
        localStorage.setItem(
          "explanation_bookmarks",
          JSON.stringify(
            bookmarks.filter((b: any) => b.questionId !== questionId)
          )
        );
      }
    }
  };

  const copyExplanation = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      toast.success("Explanation copied to clipboard", {
        icon: "📋",
        duration: 2000,
      });
    }
  };

  // Function to safely render HTML content with <strong> tags
  const renderWithStrongTags = (text: string) => {
    if (!text) return "";

    // Split the text by <strong> and </strong> tags
    const parts = text.split(/(<strong>.*?<\/strong>)/g);

    return parts.map((part, index) => {
      if (part.startsWith("<strong>") && part.endsWith("</strong>")) {
        // Extract the content between the tags
        const content = part.replace(/<strong>(.*?)<\/strong>/, "$1");
        return <strong key={index}>{content}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4 bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-full">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Question Explanation</h2>
            <p className="text-xs text-muted-foreground">
              AI-generated explanation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleBookmark}
            className={cn(
              "h-8 w-8 rounded-full transition-colors",
              bookmarked
                ? "text-primary bg-primary/10"
                : "text-muted-foreground"
            )}
          >
            {bookmarked ? (
              <Bookmark className="h-4 w-4" />
            ) : (
              <BookmarkPlus className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyExplanation}
            className="h-8 w-8 rounded-full text-muted-foreground"
            disabled={!content}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 h-[200px]">
        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                </div>
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">Generating explanation</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This may take a few moments...
                </p>
              </div>
            </div>
          </div>
        ) : content ? (
          <div className="space-y-4 p-4">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h3 className="select-none font-medium text-primary mb-2 line-clamp-2">
                {questionTitle}
              </h3>
              <p className="text-xs text-muted-foreground italic">
                The following explanation helps understand this question and its
                solution.
              </p>
            </div>

            {parsedContent ? (
              <div className="space-y-4">
                <ExplanationSection
                  title="Summary"
                  icon={<Info className="h-4 w-4" />}
                  expanded={expandedSections.summary}
                  onToggle={() => toggleSection("summary")}
                  badgeText="Key Points"
                  badgeVariant="default"
                >
                  <p className="text-sm leading-relaxed">
                    {renderWithStrongTags(parsedContent.summary)}
                  </p>
                </ExplanationSection>

                {parsedContent.details && (
                  <ExplanationSection
                    title="Detailed Explanation"
                    icon={<BookOpen className="h-4 w-4" />}
                    expanded={expandedSections.details}
                    onToggle={() => toggleSection("details")}
                    badgeText="In-Depth"
                    badgeVariant="outline"
                  >
                    <div className="space-y-3 text-sm leading-relaxed">
                      {parsedContent.details.split("\n\n").map((p, i) => (
                        <p key={i} className="text-muted-foreground">
                          {renderWithStrongTags(p)}
                        </p>
                      ))}
                    </div>
                  </ExplanationSection>
                )}

                {parsedContent.tips && (
                  <ExplanationSection
                    title="Tips & Hints"
                    icon={<Lightbulb className="h-4 w-4" />}
                    expanded={expandedSections.tips}
                    onToggle={() => toggleSection("tips")}
                    badgeText="Helpful"
                    badgeVariant="secondary"
                  >
                    <div className="space-y-2">
                      {parsedContent.tips.split("\n\n").map((tip, i) => (
                        <div
                          key={i}
                          className="rounded-md bg-muted/50 p-3 text-sm"
                        >
                          <p className="text-muted-foreground">
                            {renderWithStrongTags(tip)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ExplanationSection>
                )}

                {parsedContent.conclusion && (
                  <div className="rounded-md border-l-4 border-primary/50 bg-muted/30 p-3 mt-4">
                    <p className="text-sm font-medium">Conclusion</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {renderWithStrongTags(parsedContent.conclusion)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-sm leading-relaxed">
                {content.split("\n\n").map((paragraph, i) => {
                  // Replace ** with <strong> tags in the raw content
                  const processedParagraph = paragraph.replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong>$1</strong>"
                  );
                  return (
                    <p key={i} className="text-muted-foreground">
                      {renderWithStrongTags(processedParagraph)}
                    </p>
                  );
                })}
              </div>
            )}

            <div className="pt-4">
              <Separator />
              <div className="flex items-center justify-between pt-4">
                <Badge variant="outline" className="text-xs">
                  AI Generated
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    toast.success("Feedback submitted. Thank you!", {
                      duration: 2000,
                    });
                  }}
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  This was helpful
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-60 items-center justify-center p-4">
            <div className="flex flex-col items-center gap-2 text-center max-w-xs">
              <AlertTriangle className="h-10 w-10 text-muted-foreground/50" />
              <p className="font-medium text-muted-foreground">
                No explanation available
              </p>
              <p className="text-xs text-muted-foreground">
                Click the explain button on a question to get a detailed
                explanation.
              </p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// Helper component
interface ExplanationSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  badgeText?: string;
  badgeVariant?: "default" | "outline" | "secondary";
}

const ExplanationSection = ({
  title,
  icon,
  children,
  expanded,
  onToggle,
  badgeText,
  badgeVariant = "default",
}: ExplanationSectionProps) => {
  return (
    <Collapsible open={expanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between cursor-pointer select-none">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-muted/50 rounded-full">{icon}</div>
            <h4 className="font-semibold text-sm">{title}</h4>
            {badgeText && (
              <Badge variant={badgeVariant} className="text-[10px]">
                {badgeText}
              </Badge>
            )}
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">{children}</CollapsibleContent>
    </Collapsible>
  );
};
