"use client";

import { useEffect, useState } from "react";
import { stringifyUnsplashImage, unsplash } from "@/lib/unsplash";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { BOARDS_DEFAULT_BACKGROUNDS } from "@/constants/board-backgrounds";
import Link from "next/link";
import { FormErrors } from "@/components/form/form-errors";

type FormPickerProps = {
  id: string;
  errors?: Record<string, string[] | undefined>;
};

export function FormPicker({ id, errors }: FormPickerProps) {
  const { pending } = useFormStatus();
  const [images, setImages] = useState<Array<Record<string, any>>>([]);

  const [selectedImageId, setSelectedImageId] = useState<string>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await unsplash.photos.getRandom({
          collectionIds: [TRELLO_ALBUMS_COLLECTION_ID],
          count: IMAGE_BATCH_SIZE,
        });
        if (res && res.response) {
          const newImages = res.response as typeof images;
          setImages(newImages);
        }
      } catch (e) {
        console.error(e);
        setImages(BOARDS_DEFAULT_BACKGROUNDS);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading || pending) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2Icon className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2">
        {images.map((i) => (
          <div
            key={i.id}
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
              { "opacity-50 hover:opacity-50 cursor-auto": pending },
            )}
            onClick={() => {
              if (pending) return;
              setSelectedImageId(i.id);
            }}
          >
            <Image
              src={i.urls.thumb}
              alt="Image"
              fill
              className="rounded-sm object-cover"
            />
            {selectedImageId === i.id && (
              <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                <CheckIcon className="h-4 w-4 text-white" />
              </div>
            )}
            <input
              id={id}
              type="radio"
              className="hidden"
              name={id}
              checked={selectedImageId === i.id}
              disabled={pending}
              value={stringifyUnsplashImage(i)}
              readOnly
            />
            <Link
              href={i.links.html}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/30"
            >
              {i.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors inputId="image" errors={errors} />
    </div>
  );
}

const IMAGE_BATCH_SIZE = 9;
const TRELLO_ALBUMS_COLLECTION_ID = "317099";
