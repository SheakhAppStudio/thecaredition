import HeroVideoDialog from "@/components/magicui/hero-video-dialog";

export function AboutUsVideo({video ,logo}) {
  return (
    <div className="relative">
      <HeroVideoDialog
        className="block dark:hidden"
        animationStyle="top-in-bottom-out"
        videoSrc={video}
        thumbnailSrc={logo}
        thumbnailAlt="About Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="top-in-bottom-out"
        videoSrc={video}
        thumbnailSrc={logo}
        thumbnailAlt="About Video"
      />
    </div>
  );
}
