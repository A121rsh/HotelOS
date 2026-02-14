"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  label?: string;
}

export default function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
  label = "Upload Image"
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex flex-wrap justify-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[180px] h-[120px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
            <div className="z-10 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
                className="h-8 w-8 rounded-lg"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
            />
          </div>
        ))}
      </div>

      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset="hotel_os"
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              onClick={onClick}
              className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-[#b5f347] hover:text-black hover:border-[#b5f347] transition-all font-black uppercase text-[10px] tracking-widest"
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              {label}
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}