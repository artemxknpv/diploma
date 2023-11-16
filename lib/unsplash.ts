import { createApi } from "unsplash-js";

export const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!,
  fetch,
});

export const stringifyUnsplashImage = (unsplashImage: Record<string, any>) => {
  return `${unsplashImage.id}|${unsplashImage.urls.thumb}|${unsplashImage.urls.full}|${unsplashImage.links.html}|${unsplashImage.user.name}`;
};

export const parseUnsplashImage = (stringifiedImage: string) => {
  const [id, thumbUrl, fullUrl, htmlLink, userName] =
    stringifiedImage.split("|");

  return {
    id,
    thumbUrl,
    fullUrl,
    htmlLink,
    userName,
  };
};
