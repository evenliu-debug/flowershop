"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Img = { src: string; alt: string };

export function ProductImageGallery({ images }: { images: Img[] }) {
  const [i, setI] = useState(0);
  if (!images.length) {
    return (
      <div className="relative aspect-square w-full bg-slate-100">
        <Image
          src="/placeholder-product.svg"
          alt=""
          fill
          className="object-contain p-8"
          unoptimized
        />
      </div>
    );
  }
  const main = images[Math.min(i, images.length - 1)];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        <Image
          src={main.src}
          alt={main.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          unoptimized={main.src.startsWith("http")}
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors duration-200 cursor-pointer",
                idx === i ? "border-blue-700" : "border-transparent hover:border-slate-300"
              )}
              aria-label={`Image ${idx + 1}`}
            >
              <Image
                src={img.src}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
                unoptimized={img.src.startsWith("http")}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
