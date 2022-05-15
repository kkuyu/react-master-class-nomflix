export function getMovies() {
  return fetch(`${process.env.REACT_APP_API_BASE_PATH}/movie/now_playing?api_key=${process.env.REACT_APP_API_KEY}`).then((response) => response.json());
}
