import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  preview?: string;
  onClear?: () => void;
}

export const UploadDropzone = ({ onFileSelect, preview, onClear }: UploadDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <Card className={`relative overflow-hidden transition-all ${isDragging ? 'border-primary bg-primary/5' : ''}`}>
      {preview ? (
        <div className="relative group">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-96 object-contain bg-muted"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <div className="rounded-full bg-primary/10 p-6 mb-4">
            <Upload className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Tải ảnh tin nhắn lên</h3>
          <p className="text-muted-foreground mb-4">
            Kéo thả ảnh vào đây hoặc nhấp để chọn file
          </p>
          <label htmlFor="file-upload">
            <Button variant="outline" asChild>
              <span>
                <ImageIcon className="mr-2 h-4 w-4" />
                Chọn ảnh
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      )}
    </Card>
  );
};
