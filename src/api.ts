const API_KEY = "cb6371d33ed68513e62d37f350992128";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`).then(
    (res) => res.json()
  );
}
