import Image from "next/image";

type PixelAgentProps = {
  size: number;
  decorative?: boolean;
};

export function PixelAgent({ size, decorative = false }: PixelAgentProps) {
  return (
    <Image
      className="pixel-agent"
      src="/agent/azhu.png"
      width={size}
      height={size}
      sizes={`${size}px`}
      alt={decorative ? "" : "阿竹像素机器人"}
      draggable={false}
    />
  );
}
