"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out";

interface HeroVideoProps {
  animationStyle?: AnimationStyle;
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt?: string;
  className?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1";
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
};

const aspectRatioClasses = {
  "16/9": "aspect-w-16 aspect-h-9",
  "4/3": "aspect-w-4 aspect-h-3",
  "1/1": "aspect-w-1 aspect-h-1",
};

export function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
  aspectRatio = "16/9",
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const selectedAnimation = animationVariants[animationStyle];

  const toggleVideo = () => setIsVideoOpen(!isVideoOpen);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Thumbnail with play button */}
      <button
        onClick={toggleVideo}
        className="group relative block w-full cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`Play video: ${thumbnailAlt}`}
      >
        <div className={cn("relative", aspectRatioClasses[aspectRatio])}>
          <Image
            src={thumbnailSrc}
            alt={thumbnailAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-black/30 p-6 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-black/40">
            <Play className="h-8 w-8 fill-white text-white" />
          </div>
        </div>
      </button>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg"
            onClick={toggleVideo}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              {...selectedAnimation}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative mx-4 w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={toggleVideo}
                className="absolute -top-12 right-0 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition-all hover:bg-white/20"
                aria-label="Close video"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Video Container */}
              <div className={cn("relative", aspectRatioClasses[aspectRatio])}>
                <iframe
                  src={`${videoSrc}?autoplay=1`}
                  className="absolute inset-0 h-full w-full rounded-lg shadow-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Video player"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}