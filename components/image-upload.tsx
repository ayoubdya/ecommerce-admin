"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { ImageIcon, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  values: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  values,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {values.map((imageUrl) => (
          <div
            key={imageUrl}
            className="relative overflow-hidden w-[200px] h-[200px] rounded-md"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(imageUrl)}
                variant="destructive"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <Image alt="Image" src={imageUrl} fill className="object-cover" />
          </div>
        ))}
      </div>
      <CldUploadWidget
        onUpload={(res: any) => onChange(res.info.secure_url)}
        uploadPreset="yjsbrxcl"
      >
        {({ open }) => {
          return (
            <Button
              type="button"
              variant="secondary"
              disabled={disabled}
              onClick={() => open()}
            >
              <ImageIcon className="mr-2 w-4 h-4" />
              Upload an image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
