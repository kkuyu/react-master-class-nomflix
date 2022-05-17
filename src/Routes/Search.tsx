import { useSearchParams } from "react-router-dom";

function Search() {
  const [searchParams, _] = useSearchParams();
  const keyword = searchParams.get("keyword");

  return <div>Search keyword: {keyword}</div>;
}

export default Search;
