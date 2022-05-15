interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${process.env.REACT_APP_API_BASE_PATH}/movie/now_playing?api_key=${process.env.REACT_APP_API_KEY}`).then((response) => response.json());
}
