import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { useMatch, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

import { getDetail, IMovieDetail, ITvDetail } from "../core/api";
import { previewState } from "../core/atom";
import { makeImagePath } from "../utils";

function InfoLayer() {
  const navigate = useNavigate();
  const moviesMatch = useMatch("/movies/:movieId");
  const tvsMatch = useMatch("/tv/tvs/:tvId");

  const [preview, setPreview] = useRecoilState(previewState);

  const { data: movieData } = useQuery(["detail", "movie"], () => getDetail<IMovieDetail>("movie", moviesMatch?.params.movieId || ""), {
    onSuccess: (newData) => {
      if (!moviesMatch) return;
      setPreview((prevData) => {
        return {
          modifyType: "movie",
          modifyKey: prevData?.modifyKey || "preview",
          headline: newData.title,
          ...newData,
        };
      });
    },
  });

  const { data: tvData } = useQuery(["detail", "tv"], () => getDetail<ITvDetail>("tv", tvsMatch?.params.tvId || ""), {
    onSuccess: (newData) => {
      if (!tvsMatch) return;
      setPreview((prevData) => {
        return {
          modifyType: "tv",
          modifyKey: prevData?.modifyKey || "preview",
          headline: newData.name,
          ...newData,
        };
      });
    },
  });

  const getRunTime = (time: number) => {
    if (!time) return null;
    var hours = time / 60;
    var minutes = (hours - Math.floor(hours)) * 60;
    return `${Math.floor(hours)}h ${Math.round(minutes)}m`;
  };

  const onOverlayClick = () => {
    navigate(-1);
  };

  return (
    <AnimatePresence>
      <Overlay key={`${preview.modifyType}_${preview.modifyKey}_${preview.id}_overlay`} onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <div>{`${preview.modifyType}_${preview.modifyKey}_${preview.id}_overlay`}</div>

      <Container key={`${preview.modifyType}_${preview.modifyKey}${preview.id}_layer`} layoutId={`${preview.modifyType}_${preview.modifyKey}_${preview.id}`}>
        <Cover isBackdrop={!!preview.backdrop_path}>
          <img src={makeImagePath(preview.backdrop_path || preview.poster_path || "", "w500")} alt="" />
        </Cover>

        <Inner>
          {/* Info */}
          <Info>
            <Title>{preview.headline || ""}</Title>
            <Overview>{preview.overview}</Overview>
          </Info>

          {/* Detail(movie) */}
          {preview.modifyType === "movie" && (
            <Detail>
              {preview.release_date && <li>Release Date: {preview.release_date.replaceAll("-", "/")}</li>}
              {preview.runtime && <li>Runtime: {getRunTime(preview.runtime || 0)}</li>}
              {preview.vote_average && <li>Vote Average: {preview.vote_average}</li>}
              {preview.genres && (
                <li>
                  Genres:{" "}
                  {preview.genres.map((genre) => (
                    <span key={genre.id}>{genre.name}</span>
                  ))}
                </li>
              )}
              {preview.homepage && (
                <li>
                  Homepage:{" "}
                  <a href={preview.homepage} target="_blank">
                    {preview.homepage}
                  </a>
                </li>
              )}
            </Detail>
          )}
          {/* Detail(tv) */}
          {preview.modifyType === "tv" && (
            <Detail>
              {preview.first_air_date && <li>First Air Date: {preview.first_air_date.replaceAll("-", "/")}</li>}
              {preview.last_air_date && <li>Last Air Date: {preview.last_air_date.replaceAll("-", "/")}</li>}
              {preview.vote_average && <li>Vote Average: {preview.vote_average}</li>}
            </Detail>
          )}
        </Inner>
      </Container>
    </AnimatePresence>
  );
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const Container = styled(motion.div)`
  position: fixed;
  top: calc(50% - 35vh);
  left: calc(50% - 25vw);
  display: flex;
  flex-direction: column;
  width: 50vw;
  height: 70vh;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.lighter};
`;

const Cover = styled.div<{ isBackdrop: boolean }>`
  margin: -40px auto 0;
  width: ${(props) => (props.isBackdrop ? "90%" : "40%")};
  img {
    border-radius: 15px;
    width: 100%;
  }
`;

const Inner = styled.div`
  padding: 20px 5%;
  overflow-y: auto;
`;

const Info = styled.div``;

const Title = styled.h3`
  font-size: 30px;
  font-weight: bold;
  color: ${(props) => props.theme.white.lighter};
`;

const Overview = styled.p`
  margin-top: 10px;
  font-size: 16px;
  color: ${(props) => props.theme.white.lighter};
`;

const Detail = styled.ul`
  margin-top: 15px;
  li {
    padding-left: 10px;
    text-indent: -10px;
  }
  li + li {
    margin-top: 5px;
  }
  li:before {
    content: "- ";
  }
  a {
    text-decoration: underline;
  }
  span + span:before {
    content: ", ";
  }
`;

export default InfoLayer;
