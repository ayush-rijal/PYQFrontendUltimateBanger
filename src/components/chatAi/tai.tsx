"use client";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  X,
  Maximize2,
  Minimize2,
  ChevronDown,
  Copy,
  Share,
  Sparkles,
  MoreHorizontal,
  Trash2,
  Clock,
  Keyboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { answerStudentPrompt } from "@/ai/flows/answer-student-prompt";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  id: string;
}

// LocalStorage keys and configuration
const STORAGE_KEY = "tai_chat_messages";
const STORAGE_TIMESTAMP_KEY = "tai_chat_timestamp";
const STORAGE_EXPIRY = 60 * 60 * 24 * 1000; // 24 our in milliseconds

export default function Aimessage() {
  const { data: user } = useRetrieveUserQuery()
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [expiryTime, setExpiryTime] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const expiryTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const loadMessages = () => {
      try {
        const storedTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
        const storedMessages = localStorage.getItem(STORAGE_KEY);

        if (!storedTimestamp || !storedMessages) return;

        const timestamp = Number.parseInt(storedTimestamp, 10);
        const now = Date.now();

        // Check if stored messages are still valid (less than 1 hour old)
        if (now - timestamp < STORAGE_EXPIRY) {
          const parsedMessages = JSON.parse(storedMessages).map(
            (msg: Partial<Message>) => ({
              ...msg,
              timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
            })
          );

          setMessages(parsedMessages);
          toast.success("Previous conversation loaded", { id: "load-success" });

          // Set unread count if chat is not open
          if (!isOpen && parsedMessages.length > 0) {
            const aiMessages = parsedMessages.filter(
              (msg: Message) => !msg.isUser
            );
            setUnreadCount(aiMessages.length);
          }

          // Calculate and set expiry time
          updateExpiryTime(timestamp);
        } else {
          // Clear expired messages
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
          toast("Previous conversation has expired", {
            id: "expired-info",
            icon: "ℹ️",
          });
        }
      } catch (error) {
        console.error("Error loading messages from localStorage:", error);
        toast.error("Failed to load previous conversation", {
          id: "load-error",
        });
      }
    };

    loadMessages();

    // Start expiry timer
    startExpiryTimer();

    return () => {
      if (expiryTimerRef.current) {
        clearInterval(expiryTimerRef.current);
      }
    };
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        const timestamp = Date.now();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        localStorage.setItem(STORAGE_TIMESTAMP_KEY, timestamp.toString());

        // Update expiry time
        updateExpiryTime(timestamp);
      } catch (error) {
        console.error("Error saving messages to localStorage:", error);
        toast.error("Failed to save conversation", { id: "save-error" });
      }
    }
  }, [messages]);

  // Update expiry time display
  const updateExpiryTime = (timestamp: number) => {
    const expiryTimestamp = timestamp + STORAGE_EXPIRY;
    const now = Date.now();
    const remaining = Math.max(0, expiryTimestamp - now);

    if (remaining <= 0) {
      setExpiryTime(null);
      return;
    }

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    setExpiryTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };

  // Start timer to update expiry time
  const startExpiryTimer = () => {
    if (expiryTimerRef.current) {
      clearInterval(expiryTimerRef.current);
    }

    expiryTimerRef.current = setInterval(() => {
      const storedTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
      if (storedTimestamp) {
        updateExpiryTime(Number.parseInt(storedTimestamp, 10));
      } else {
        setExpiryTime(null);
        if (expiryTimerRef.current) {
          clearInterval(expiryTimerRef.current);
        }
      }
    }, 1000);
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior, block: "end" });
      setHasNewMessages(false);
    }
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date(),
      id: generateId(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // const sendingToast = toast.loading("Sending message...", { id: "sending" })

    try {
      // Scroll immediately after user sends a message
      setTimeout(() => scrollToBottom("auto"), 50);

      const aiResponse = await answerStudentPrompt({ prompt: input });

      const aiMessage = {
        text: aiResponse.answer,
        isUser: false,
        timestamp: new Date(),
        id: generateId(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      //   toast.success("Message sent successfully", { id: sendingToast })

      // Scroll to bottom after AI responds
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I couldn't process your request. Please try again.",
          isUser: false,
          timestamp: new Date(),
          id: generateId(),
        },
      ]);
      //   toast.error("Failed to get response", { id: sendingToast })
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
    setExpiryTime(null);
    toast.success("Conversation cleared");
  };

  // Handle scroll events to detect if user has scrolled up
  const handleScroll = () => {
    if (!scrollAreaRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;

    if (!isAtBottom && !hasNewMessages && messages.length > 0) {
      setHasNewMessages(true);
    } else if (isAtBottom && hasNewMessages) {
      setHasNewMessages(false);
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date for message groups
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      setTimeout(() => {
        scrollToBottom("auto");
        textareaRef.current?.focus();
      }, 100);
    }
  };

  // Toggle expanded view
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setTimeout(() => scrollToBottom("auto"), 100);
  };

  // Adjust textarea height
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = [];

    messages.forEach((message) => {
      const dateStr = formatDate(new Date(message.timestamp));
      const existingGroup = groups.find((group) => group.date === dateStr);

      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        groups.push({ date: dateStr, messages: [message] });
      }
    });

    return groups;
  };

  // Scroll to bottom on initial load
  useEffect(() => {
    if (isOpen) {
      scrollToBottom("auto");
    }
  }, [isOpen]);

  // Adjust textarea height when input changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  // Get message groups
  const messageGroups = groupMessagesByDate();
  const profilePicSrc = user?.profilePicture || null
  return (
    <>
      <TooltipProvider>
        {/* Chat toggle button */}
        {!isOpen && (
          <Button
            onClick={toggleChat}
            className="fixed bottom-6 right-6 rounded-full shadow-xl p-4 h-16 w-16 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 border-2 border-primary/20 "
            aria-label="Open chat" 
          >
            <div
              className="absolute inset-0 rounded-full bg-white/10 animate-pulse"
              style={{ animationDuration: "3s" }}
            ></div>
            <Sparkles className="h-7 w-7 text-primary-foreground" />

            {/* Unread message indicator */}
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-background">
                {unreadCount}
              </div>
            )}
          </Button>
        )}

        {/* Chat dialog */}
        {isOpen && (
          <div
            className={cn(
              "fixed bottom-6 right-6 bg-gradient-to-b from-background to-background/95 border border-border/50 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 z-50 backdrop-blur-sm",
              isExpanded
                ? "w-[90vw] h-[90vh] max-w-5xl"
                : "w-[380px] sm:w-[420px] h-[600px]"
            )}
            style={{
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Chat header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-primary-foreground/20">
                    <AvatarImage src="/logo.svg" alt="AI Avatar" />
                    <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">
                      AI
                    </AvatarFallback>

                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-primary"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    PYQ&apos;s Study Hub
                  </h3>
                  <div className="flex items-center text-xs text-primary-foreground/80">
                    <p>AI-powered learning assistant</p>
                    {expiryTime && (
                      <div className="flex items-center ml-2 bg-primary-foreground/10 px-2 py-0.5 rounded-full">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{expiryTime} Mintues</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowKeyboardHelp(true)}
                      className="h-8 w-8 text-primary-foreground hover:bg-primary/90 rounded-full"
                      aria-label="Keyboard shortcuts"
                    >
                      <Keyboard className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    Keyboard shortcuts
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleExpanded}
                      className="h-8 w-8 text-primary-foreground hover:bg-primary/90 rounded-full"
                      aria-label={isExpanded ? "Minimize" : "Maximize"}
                    >
                      {isExpanded ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    {isExpanded ? "Minimize" : "Maximize"}
                  </TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary-foreground hover:bg-primary/90 rounded-full"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => scrollToBottom()}>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Scroll to bottom
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={clearConversation}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear conversation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleChat}
                      className="h-8 w-8 text-primary-foreground hover:bg-primary/90 rounded-full"
                      aria-label="Close chat"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Close</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 relative overflow-hidden">
              <ScrollArea
                className="h-full w-full p-4"
                onScroll={handleScroll}
                ref={scrollAreaRef}
              >
                <div className="space-y-6 pb-2">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                      <div className="bg-primary/5 p-6 rounded-full mb-4">
                        <Sparkles className="h-10 w-10 text-primary/50" />
                      </div>
                      <p className="text-center font-medium">
                        Ask me anything to get started!
                      </p>
                      <p className="text-center text-sm mt-1 max-w-[250px]">
                        I&apos;m here to help with your studies and answer your
                        questions.
                      </p>
                    </div>
                  )}

                  {messageGroups.map((group) => (
                    <div key={group.date} className="space-y-4">
                      <div className="flex items-center justify-center my-4">
                        <div className="bg-muted/50 px-3 py-1 rounded-full text-xs text-muted-foreground">
                          {group.date}
                        </div>
                      </div>

                      {group.messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-3 max-w-[95%]",
                            message.isUser ? "ml-auto justify-end" : "mr-auto"
                          )}
                        >
                          {!message.isUser && (
                            <div className="relative mt-1">
                              <Avatar className="h-8 w-8 border border-border shadow-sm">
                                <AvatarImage src="/logo.svg" alt="AI Avatar" />

                                <AvatarFallback>Tai</AvatarFallback>
                              </Avatar>
                              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border border-background"></span>
                            </div>
                          )}

                          {!message.isUser ? (
                            <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col relative group">
                              {/* Gradient overlay for visual appeal */}
                              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-30 rounded-2xl pointer-events-none"></div>

                              {/* Dialog header */}
                              <div className="px-4 pt-3 pb-1 border-b border-border/40 flex items-center justify-between">
                                <Badge
                                  variant="outline"
                                  className="bg-primary/10 text-xs font-normal px-2 py-0 h-5"
                                >
                                  Tai Response
                                </Badge>

                                {/* Action buttons */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-full"
                                        onClick={() =>
                                          handleCopyMessage(message.text)
                                        }
                                      >
                                        <Copy className="h-3.5 w-3.5" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" align="center">
                                      Copy
                                    </TooltipContent>
                                  </Tooltip>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-full"
                                      >
                                        <MoreHorizontal className="h-3.5 w-3.5" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="w-40"
                                    >
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleCopyMessage(message.text)
                                        }
                                      >
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy text
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Share className="h-4 w-4 mr-2" />
                                        Share
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>

                              {/* Scrollable content area */}
                              <ScrollArea
                                className="max-h-[300px] w-full overflow-auto"
                                scrollHideDelay={100}
                              >
                                <div className="p-4">
                                  <div className="whitespace-pre-wrap text-sm break-words leading-relaxed">
                                    {message.text}
                                  </div>
                                </div>
                              </ScrollArea>

                              {/* Dialog footer */}
                              <div className="px-4 py-2 text-xs text-muted-foreground flex items-center justify-end bg-muted/20">
                                {formatTime(new Date(message.timestamp))}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-accent text-accent-foreground rounded-2xl p-4 shadow-sm relative">
                              <div className="whitespace-pre-wrap text-sm break-words">
                                {message.text}
                              </div>
                              <div className="text-xs mt-2 opacity-70 text-right">
                                {formatTime(new Date(message.timestamp))}
                              </div>
                            </div>
                          )}

                          {message.isUser && (
                            <Avatar className="h-8 w-8 mt-1 border border-border shadow-sm">
                              <AvatarImage src={profilePicSrc || ""} alt='userName' />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-start gap-3 max-w-[80%] mr-auto">
                      <div className="relative mt-1">
                        <Avatar className="h-8 w-8 border border-border shadow-sm">
                          <AvatarImage src="/logo.svg" alt="AI Avatar" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border border-background"></span>
                      </div>

                      <div className="bg-card border rounded-2xl p-4 shadow-sm min-w-[120px]">
                        <div className="flex space-x-2 items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"></div>
                          <div
                            className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>
              </ScrollArea>

              {/* Scroll to bottom button */}
              {hasNewMessages && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute bottom-4 right-4 rounded-full shadow-lg p-2 h-10 w-10 bg-primary/90 text-primary-foreground hover:bg-primary"
                  onClick={() => scrollToBottom()}
                  aria-label="Scroll to bottom"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Chat input */}
            <div className="p-4 border-t">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 resize-none  rounded-xl px-4 py-3 border-muted"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className=" p-4 items-center text-center justify-center rounded-xl bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-center text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-lg">
                    <kbd className="px-1.5 py-0.5 bg-background rounded border text-xs font-mono">
                      Enter
                    </kbd>
                    <span>to send</span>
                    <span className="mx-1">•</span>
                    <kbd className="px-1.5 py-0.5 bg-background rounded border text-xs font-mono">
                      Shift+Enter
                    </kbd>
                    <span>for new line</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </TooltipProvider>

      {/* Keyboard shortcuts dialog */}
      <Dialog open={showKeyboardHelp} onOpenChange={setShowKeyboardHelp}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              Use these keyboard shortcuts to navigate the chat interface more
              efficiently.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded border text-xs font-mono">
                  Enter
                </kbd>
                <span className="text-sm">Send message</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Send your message
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded border text-xs font-mono">
                  Shift+Enter
                </kbd>
                <span className="text-sm">New line</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Add a line break
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded border text-xs font-mono">
                  Esc
                </kbd>
                <span className="text-sm">Close chat</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Minimize the chat window
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* React Hot Toast container */}
      <Toaster position="bottom-center" />
    </>
  );
}
