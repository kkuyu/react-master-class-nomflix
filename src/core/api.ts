export const contentType = {
  MOVIE: "movie",
  TV: "tv",
} as const;

export type IContentType = typeof contentType[keyof typeof contentType];

const movieType = {
  POPULAR: "popular",
  NOW_PLAYING: "now_playing",
  UPCOMING: "upcoming",
  TOP_RATED: "top_rated",
} as const;

type IMovieType = typeof movieType[keyof typeof movieType];

const tvType = {
  POPULAR: "popular",
  ON_THE_AIR: "on_the_air",
  AIRING_TODAY: "airing_today",
  TOP_RATED: "top_rated",
} as const;

type ITvType = typeof tvType[keyof typeof tvType];

export type IMovieDetail = {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  runtime: number;
  release_date: string;
  vote_average: number;
  homepage: string;
  genres: { id: number; name: string }[];
};

export type ITvDetail = {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
};

export type IProductList<T> = {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export function getMovies<T extends IMovieDetail>(type: IMovieType): Promise<IProductList<T>> {
  return fetch(`${process.env.REACT_APP_API_BASE_PATH}/movie/${type}?api_key=${process.env.REACT_APP_API_KEY}`).then((response) => response.json());
}

export function getTvs<T extends ITvDetail>(type: ITvType): Promise<IProductList<T>> {
  return fetch(`${process.env.REACT_APP_API_BASE_PATH}/tv/${type}?api_key=${process.env.REACT_APP_API_KEY}`).then((response) => response.json());
}

export function getSearchs<T extends IMovieDetail | ITvDetail>(type: "movie" | "tv", query: string, page: number): Promise<IProductList<T>> {
  return fetch(`${process.env.REACT_APP_API_BASE_PATH}/search/${type}?query=${query}&page=${page}&api_key=${process.env.REACT_APP_API_KEY}`).then((response) => response.json());
}

export function getDetail<T extends IMovieDetail | ITvDetail>(type: "movie" | "tv", id: string): Promise<T> {
  return fetch(`${process.env.REACT_APP_API_BASE_PATH}/${type}/${id}?api_key=${process.env.REACT_APP_API_KEY}`).then((response) => response.json());
}
