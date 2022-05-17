import { Outlet } from "react-router-dom";
import { useQuery } from "react-query";
import styled from "styled-components";

import { contentType, getTvs, ITvDetail } from "../core/api";
import TopBanner from "../component/TopBanner";
import Slider from "../component/Slider";

function Tv() {
  const modifyType = contentType["TV"];

  const { data: todayData, isLoading } = useQuery(["tvs", "airing_today"], () => getTvs("airing_today"));
  const { data: onTheAirData } = useQuery(["tvs", "on_the_air"], () => getTvs("on_the_air"));
  const { data: popularData } = useQuery(["tvs", "popular"], () => getTvs("popular"));
  const { data: topRatedData } = useQuery(["tvs", "top_rated"], () => getTvs("top_rated"));

  const setSliderData = (data: ITvDetail[]) => {
    return data.map((item) => ({ ...item, headline: item.name }));
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
      {todayData?.results.length && (
        <>
          <TopBanner modifyType={modifyType} modifyKey="top_banner" data={{ ...todayData?.results[0], headline: todayData?.results[0].name }} />
        </>
      )}

      {/* Slider */}
      <section>
        {todayData?.results.length && (
          <Inner>
            <h2>Airing Today</h2>
            <Slider modifyType={modifyType} modifyKey="today" data={setSliderData(todayData.results.slice(1))} />
          </Inner>
        )}
        {onTheAirData?.results.length && (
          <Inner>
            <h2>On The Air</h2>
            <Slider modifyType={modifyType} modifyKey="on_the_air" data={setSliderData(onTheAirData.results)} />
          </Inner>
        )}
        {popularData?.results.length && (
          <Inner>
            <h2>Popular</h2>
            <Slider modifyType={modifyType} modifyKey="popular" data={setSliderData(popularData.results)} />
          </Inner>
        )}
        {topRatedData?.results.length && (
          <Inner>
            <h2>Top Rated</h2>
            <Slider modifyType={modifyType} modifyKey="top_rated" data={setSliderData(topRatedData.results)} />
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

export default Tv;
