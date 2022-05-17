import { Outlet } from "react-router-dom";
import { useQuery } from "react-query";
import styled from "styled-components";

import { contentType, getMovies, IMovieDetail } from "../core/api";
import TopBanner from "../component/TopBanner";
import Slider from "../component/Slider";

function Home() {
  const modifyType = contentType["MOVIE"];

  const { data: nowData, isLoading } = useQuery(["movies", "now_playing"], () => getMovies("now_playing"));
  const { data: topRatedData } = useQuery(["movies", "top_rated"], () => getMovies("top_rated"));
  const { data: popularData } = useQuery(["movies", "popular"], () => getMovies("popular"));
  const { data: upcomingData } = useQuery(["movies", "upcoming"], () => getMovies("upcoming"));

  const setSliderData = (data: IMovieDetail[]) => {
    return data.map((item) => ({ ...item, headline: item.title }));
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Loader>Loading...</Loader>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {/* TopBanner */}
      {nowData?.results.length && (
        <>
          <TopBanner modifyType={modifyType} modifyKey="top_banner" data={{ ...nowData.results[0], headline: nowData.results[0].title }} />
        </>
      )}

      {/* Slider */}
      <section>
        {nowData?.results.length && (
          <Inner>
            <h2>Now Playing</h2>
            <Slider modifyType={modifyType} modifyKey="now_playing" data={setSliderData(nowData.results.slice(1))} />
          </Inner>
        )}
        {topRatedData?.results.length && (
          <Inner>
            <h2>Top Rated</h2>
            <Slider modifyType={modifyType} modifyKey="top_rated" data={setSliderData(topRatedData.results)} />
          </Inner>
        )}
        {popularData?.results.length && (
          <Inner>
            <h2>Popular</h2>
            <Slider modifyType={modifyType} modifyKey="popular" data={setSliderData(popularData.results)} />
          </Inner>
        )}
        {upcomingData?.results.length && (
          <Inner>
            <h2>Upcoming</h2>
            <Slider modifyType={modifyType} modifyKey="upcoming" data={setSliderData(upcomingData.results)} />
          </Inner>
        )}
      </section>

      {/* Outlet */}
      <Outlet context={{}} />
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vh;
`;

const Inner = styled.div`
  margin-top: 35px;
  padding: 0 4%;
  &:first-child {
    margin-top: -120px;
  }
  h2 {
    font-size: 20px;
    font-weight: bold;
  }
`;

export default Home;
