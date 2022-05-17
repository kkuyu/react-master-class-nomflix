import { useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import { getSearchs, IMovieDetail, ITvDetail } from "../core/api";
import SearchResult from "../component/SearchResult";
import SearchNavigation from "../component/SearchNavigation";

function Search() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const modifyType = searchParams.get("type") || "";
  const keyword = searchParams.get("keyword") || "";
  const currentPage = searchParams.get("page") || "";

  const { data: movieData, status: movieStatus } = useQuery(["search", "movie", keyword, currentPage], () => getSearchs("movie", keyword, +currentPage));
  const { data: tvData, status: tvStatus } = useQuery(["search", "tv", keyword, currentPage], () => getSearchs("tv", keyword, +currentPage));

  const isMovieDetail = (arg: any): arg is IMovieDetail => {
    return arg && arg.title && typeof arg.title == "string";
  };
  const setSearchData = (data: (IMovieDetail | ITvDetail)[]) => {
    return data.map((item) => {
      return { ...item, headline: isMovieDetail(item) ? item.title : item.name };
    });
  };

  useEffect(() => {
    // check keyword
    if (!keyword || keyword.length < 2) {
      navigate("/", { replace: true });
      return;
    }
    // check initial params
    const initialParams = {
      type: modifyType || "",
      keyword: keyword || "",
      page: currentPage || "",
    };
    const newParams = {
      type: initialParams.type !== "tv" ? "movie" : "tv",
      keyword: initialParams.keyword || "",
      page: !isNaN(+initialParams.page) && +initialParams.page > 0 ? initialParams.page : "1",
    };
    if (JSON.stringify(initialParams) !== JSON.stringify(newParams)) {
      setSearchParams({ ...newParams }, { replace: true });
      return;
    }
    // check maximum page
    if (modifyType === "movie" && movieData?.total_pages) {
      if (+currentPage > movieData.total_pages) {
        setSearchParams({ ...newParams, page: movieData.total_pages.toString() }, { replace: true });
      }
    }
    if (modifyType === "tv" && tvData?.total_pages) {
      if (+currentPage > tvData.total_pages) {
        setSearchParams({ ...newParams, page: tvData.total_pages.toString() }, { replace: true });
      }
    }
    // scroll to top
    window.scrollTo(0, 0);
  }, [navigate, setSearchParams, modifyType, keyword, currentPage, movieData, tvData]);

  return (
    <Wrapper>
      <Tabs>
        <Tab type="button" isActive={modifyType === "movie"} onClick={() => setSearchParams({ type: "movie", keyword, page: currentPage })}>
          Movie{movieData && `(${movieData?.total_results})`}
        </Tab>
        <Tab type="button" isActive={modifyType === "tv"} onClick={() => setSearchParams({ type: "tv", keyword, page: currentPage })}>
          Tv{tvData && `(${tvData?.total_results})`}
        </Tab>
      </Tabs>

      {modifyType === "movie" ? (
        <>
          <SearchResult data={setSearchData(movieData?.results || [])} status={movieStatus} />
          <SearchNavigation page={movieData?.page || 1} totalPages={movieData?.total_pages || 1} />
        </>
      ) : (
        <>
          <SearchResult data={setSearchData(tvData?.results || [])} status={tvStatus} />
          <SearchNavigation page={tvData?.page || 1} totalPages={tvData?.total_pages || 1} />
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 75px 4% 0;
`;

const Tabs = styled.div`
  margin-bottom: 30px;
`;

const Tab = styled.button<{ isActive: boolean }>`
  font-size: 25px;
  font-weight: bold;
  color: white;
  opacity: ${(props) => (props.isActive ? "1" : "0.5")};
  & + & {
    margin-left: 20px;
  }
`;

export default Search;
