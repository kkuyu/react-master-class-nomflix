import { useMatch, useNavigate, useOutletContext } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { makeImagePath } from "../utils";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  top: calc(50% - 35vh);
  left: calc(50% - 25vw);
  display: flex;
  flex-direction: column;
  width: 50vw;
  height: 70vh;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.lighter};
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  &:before {
    content: "";
    display: block;
    padding-bottom: 46%;
  }
`;

const BigInfo = styled.div`
  padding: 20px;
  overflow-y: auto;
`;

const BigTitle = styled.h3`
  font-size: 30px;
  font-weight: bold;
  color: ${(props) => props.theme.white.lighter};
`;

const BigOverview = styled.p`
  margin-top: 10px;
  font-size: 16px;
  color: ${(props) => props.theme.white.lighter};
`;

interface IOutletContext {
  activeMovie: {
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
  };
}

function Movies() {
  const navigate = useNavigate();
  const moviesMatch = useMatch("/movies/:movieId");

  const context = useOutletContext<IOutletContext>();

  const onOverlayClick = () => {
    navigate(-1);
  };

  return (
    <AnimatePresence>
      {moviesMatch && (
        <>
          <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
          <BigMovie layoutId={`movieBox${moviesMatch.params.movieId}`}>
            <BigCover
              style={{
                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(context.activeMovie.backdrop_path || context.activeMovie.poster_path, "w500")})`,
              }}
            />
            <BigInfo>
              <BigTitle>{context.activeMovie.title}</BigTitle>
              <BigOverview>{context.activeMovie.overview}</BigOverview>
            </BigInfo>
          </BigMovie>
        </>
      )}
    </AnimatePresence>
  );
}

export default Movies;
