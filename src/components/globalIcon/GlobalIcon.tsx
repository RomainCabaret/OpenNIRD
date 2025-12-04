import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";

interface Props {
  alt: string;
  img: StaticImageData;
  className?: string;
  imgClassName?: string;
}

export const GlobalIcon = ({
  img,
  alt,
  className = "",
  imgClassName = "",
}: Props) => {
  return (
    <div className={cn("relative w-full h-full", className)}>
      <Image
        src={img}
        alt={alt}
        fill
        className={cn("object-cover", imgClassName)}
      />
    </div>
  );
};
