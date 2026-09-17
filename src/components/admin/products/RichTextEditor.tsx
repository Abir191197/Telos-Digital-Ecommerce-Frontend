"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Minus,
  RemoveFormatting,
  Undo,
  Redo,
  Code,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write detailed product specifications, highlights, box contents...",
  minHeight = "180px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState(value || "");

  // Sync internal content with external value when value changes externally
  useEffect(() => {
    setHtmlContent(value || "");
    if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const executeCommand = (command: string, arg?: string) => {
    if (isHtmlMode) return;
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setHtmlContent(newContent);
      onChange(newContent);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setHtmlContent(newContent);
      onChange(newContent);
    }
  };

  const handleAddLink = () => {
    if (isHtmlMode) return;
    const url = prompt("Enter link URL (e.g. https://...):");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHtmlContent(val);
    onChange(val);
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-background overflow-hidden shadow-xs focus-within:border-amber-500 transition-colors">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-1 p-2 bg-muted/30 border-b border-border/60">
        <div className="flex items-center flex-wrap gap-1">
          {/* Text Styling */}
          <button
            type="button"
            onClick={() => executeCommand("bold")}
            disabled={isHtmlMode}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-40 cursor-pointer"
            title="Bold"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("italic")}
            disabled={isHtmlMode}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-40 cursor-pointer"
            title="Italic"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("underline")}
            disabled={isHtmlMode}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-40 cursor-pointer"
            title="Underline"
          >
            <Underline className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("strikeThrough")}
            disabled={isHtmlMode}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-40 cursor-pointer"
            title="Strikethrough"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </button>

          <div className="h-4 w-px bg-border/80 mx-1" />

          {/* Headings */}
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "<h2>")}
            disabled={isHtmlMode}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-40 cursor-pointer"
            title="Heading 2"
          >
            <Heading2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "<h3>")}
            disabled={isHtmlMode}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-40 cursor-pointer"
            title="Heading 3"
          >
            <Heading3 className="h-3.5 w-3.5" />
          </button>

          <div className="h-4 w-px bg-border/80 mx-1" />

          {/* Lists & Quotes */}
          <button
            type="button"
            onClick={() => executeCommand("insertUnorderedList")}
            disabled={isHtmlMode}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-40 cursor-pointer"
            title="Bullet List"
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertOrderedList")}
            disabled={isHtmlMode}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-40 cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "<blockquote>")}
            disabled={isHtmlMode}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-40 cursor-pointer"
            title="Quote Block"
          >
            <Quote className="h-3.5 w-3.5" />
          </button>

          <div className="h-4 w-px bg-border/80 mx-1" />

          {/* Links & Rules */}
          <button
            type="button"
            onClick={handleAddLink}
            disabled={isHtmlMode}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-40 cursor-pointer"
            title="Insert Link"
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertHorizontalRule")}
            disabled={isHtmlMode}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-40 cursor-pointer"
            title="Horizontal Divider"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("removeFormat")}
            disabled={isHtmlMode}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-40 cursor-pointer"
            title="Clear Formatting"
          >
            <RemoveFormatting className="h-3.5 w-3.5" />
          </button>

          <div className="h-4 w-px bg-border/80 mx-1" />

          {/* History */}
          <button
            type="button"
            onClick={() => executeCommand("undo")}
            disabled={isHtmlMode}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-40 cursor-pointer"
            title="Undo"
          >
            <Undo className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("redo")}
            disabled={isHtmlMode}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-40 cursor-pointer"
            title="Redo"
          >
            <Redo className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mode Toggle (Visual vs Raw HTML) */}
        <button
          type="button"
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
            isHtmlMode
              ? "bg-amber-500 text-zinc-950 font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {isHtmlMode ? (
            <>
              <Eye className="h-3.5 w-3.5" />
              <span>Visual</span>
            </>
          ) : (
            <>
              <Code className="h-3.5 w-3.5" />
              <span>HTML</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Body */}
      {isHtmlMode ? (
        <textarea
          value={htmlContent}
          onChange={handleHtmlChange}
          placeholder="<p>Enter raw HTML content here...</p>"
          style={{ minHeight }}
          className="w-full bg-background p-4 text-xs font-mono text-foreground focus:outline-none resize-y border-none"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          style={{ minHeight }}
          data-placeholder={placeholder}
          className={cn(
            "w-full bg-background p-4 text-xs sm:text-sm text-foreground focus:outline-none overflow-y-auto leading-relaxed",
            "prose prose-sm dark:prose-invert max-w-none",
            "[&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1",
            "[&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-2.5 [&_h3]:mb-1",
            "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2",
            "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2",
            "[&_blockquote]:border-l-2 [&_blockquote]:border-amber-500 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-2",
            "[&_hr]:my-3 [&_hr]:border-border",
            "[&_a]:text-amber-500 [&_a]:underline",
            // Empty placeholder styling
            "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/60 empty:before:pointer-events-none"
          )}
        />
      )}
    </div>
  );
}
