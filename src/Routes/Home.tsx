import { useState } from "react";
import { useNavigate, Outlet, useMatch } from "react-router-dom";
import { useQuery } from "react-query";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath, makeLineClampStyle } from "../utils";

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vh;
`;

const Banner = styled.div<{ $bgPhoto: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.$bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: bold;
  ${makeLineClampStyle(1.3, 3)}
`;

const Overview = styled.p`
  margin-top: 18px;
  width: 60%;
  font-size: 20px;
  ${makeLineClampStyle(1.4, 4)}
`;

const Slider = styled.div`
  position: relative;
  width: 100%;
  &:before {
    content: "";
    display: block;
    width: 100%;
    padding-bottom: 10%;
  }
  &:first-child {
    margin-top: -100px;
  }
`;

const Row = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  height: 100%;
`;

const Box = styled(motion.button)<{ $bgPhoto: string }>`
  display: flex;
  align-items: flex-end;
  font-size: 20px;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
`;

const Info = styled(motion.div)`
  flex: 1 1 0;
  padding: 8px;
  color: white;
  text-align: center;
  background-color: black;
  opacity: 0;
  strong {
    font-size: 10px;
    ${makeLineClampStyle(1.3, 2)}
  }
`;

const rowVariants = {
  hidden: {
    x: "calc(100vw + 10px)",
  },
  visible: {
    x: 0,
  },
  exit: {
    x: "calc(-100vw - 10px)",
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -25,
    zIndex: 1,
    transition: {
      delay: 0.3,
      duration: 0.2,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.4,
      duration: 0.4,
      type: "tween",
    },
  },
};

const offset = 6;

function Home() {
  const navigate = useNavigate();
  const moviesMatch = useMatch("/movies/:movieId");

  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const activeMovie = moviesMatch?.params.movieId && data?.results.find((movie) => `${movie.id}` === moviesMatch.params.movieId);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  return (
    <Wrapper>
      {isLoading && (
        <>
          <Loader>Loading...</Loader>
        </>
      )}
      {!isLoading && (
        <>
          <Banner onClick={increaseIndex} $bgPhoto={makeImagePath(data?.results[0].backdrop_path || data?.results[0].poster_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <div>
            <Slider>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: "tween", duration: 1 }} key={index}>
                  {data?.results
                    .slice(1)
                    .slice(offset * index, offset * (index + 1))
                    .map((movie, index) => (
                      <Box
                        key={movie.id}
                        layoutId={`movieBox${movie.id}`}
                        variants={boxVariants}
                        whileHover="hover"
                        initial="normal"
                        transition={{ type: "tween" }}
                        style={{ originX: index === 0 ? 0 : index === offset - 1 ? 1 : 0.5 }}
                        onClick={() => onBoxClicked(movie.id)}
                        $bgPhoto={makeImagePath(movie.backdrop_path || movie.poster_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <strong>{movie.title}</strong>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
          </div>
          <Outlet context={{ activeMovie }} />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
