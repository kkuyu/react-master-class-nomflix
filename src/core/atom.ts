import { atom } from "recoil";
import { contentType, IContentType } from "./api";

export const resetPreviewData = {
  id: 0,
  modifyType: contentType["MOVIE"],
  modifyKey: "",
  headline: "",
  overview: "",
  backdrop_path: "",
  poster_path: "",
};

export type IPreviewInfo = {
  id: number;
  modifyType: IContentType;
  modifyKey: string;
  headline: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  runtime?: number;
  release_date?: string;
  homepage?: string;
  genres?: { id: number; name: string }[];
  first_air_date?: string;
  last_air_date?: string;
  vote_average?: number;
};

export const previewState = atom<IPreviewInfo>({
  key: "preview",
  default: {
    ...resetPreviewData,
  },
});
