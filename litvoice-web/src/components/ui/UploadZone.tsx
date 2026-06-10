"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isLoading?: boolean;
}

export function UploadZone({
  onFilesSelected,
  isLoading = false,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportedFormats = [".txt", ".md"];

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      setError(null);
      onFilesSelected(fileArray);
    },
    [onFilesSelected],
  );

  // Drag & Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // Reset input so same file can be selected again
      e.target.value = "";
    },
    [handleFiles],
  );

  return (
    <Card className="p-8 border-2 border-dashed transition-colors hover:border-amber-500">
      <div
        className={`flex flex-col items-center justify-center text-center rounded-xl p-8 transition-colors
          ${isDragOver ? "border-amber-500 bg-amber-950/50" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        <div
          className={`mb-6 p-6 rounded-full ${isDragOver ? "bg-amber-500/10 text-amber-500" : "bg-muted"}`}>
          <Upload className="w-12 h-12" />
        </div>

        <h3 className="text-2xl font-semibold mb-3">Upload your books</h3>
        <p className="text-muted-foreground mb-8 max-w-md">
          Drag & drop your .txt or .md files here, or click to browse
        </p>

        <Button
          size="lg"
          disabled={isLoading}
          onClick={() => document.getElementById("file-input")?.click()}>
          <FileText className="mr-2 h-5 w-5" />
          Browse Files
        </Button>

        <input
          id="file-input"
          type="file"
          multiple
          accept=".txt,.md"
          className="hidden"
          onChange={handleFileInput}
        />

        <p className="text-xs text-muted-foreground mt-8">
          Supported: {supportedFormats.join(", ")}
        </p>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </div>
    </Card>
  );
}
