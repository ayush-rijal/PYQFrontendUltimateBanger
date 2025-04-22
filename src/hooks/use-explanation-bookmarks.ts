"use client";

import { useState, useEffect } from "react";

interface BookmarkedExplanation {
  questionId: number;
  title: string;
}

export function useExplanationBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedExplanation[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("explanation_bookmarks");
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error("Failed to parse bookmarks:", e);
        // Reset if corrupted
        localStorage.setItem("explanation_bookmarks", "[]");
      }
    }
  }, []);

  // Check if a question is bookmarked
  const isBookmarked = (questionId: number) => {
    return bookmarks.some((bookmark) => bookmark.questionId === questionId);
  };

  // Add a bookmark
  const addBookmark = (questionId: number, title: string) => {
    const newBookmarks = [...bookmarks, { questionId, title }];
    setBookmarks(newBookmarks);
    localStorage.setItem("explanation_bookmarks", JSON.stringify(newBookmarks));
    return true;
  };

  // Remove a bookmark
  const removeBookmark = (questionId: number) => {
    const newBookmarks = bookmarks.filter(
      (bookmark) => bookmark.questionId !== questionId
    );
    setBookmarks(newBookmarks);
    localStorage.setItem("explanation_bookmarks", JSON.stringify(newBookmarks));
    return true;
  };

  // Toggle bookmark status
  const toggleBookmark = (questionId: number, title: string) => {
    if (isBookmarked(questionId)) {
      return removeBookmark(questionId);
    } else {
      return addBookmark(questionId, title);
    }
  };

  return {
    bookmarks,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
  };
}
