import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath, makeLineClampStyle } from "../utils";
import { useState } from "react";

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
  margin-top: -100px;
  width: 100%;
`;

const Row = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  font-size: 20px;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  &:before {
    content: "";
    display: block;
    width: 100%;
    padding-bottom: 56%;
  }
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
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
    y: -20,
    transition: {
      delay: 0.3,
      duration: 0.2,
      type: "tween",
    },
  },
};

const offset = 6;

function Home() {
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
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: "tween", duration: 1 }} key={index}>
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * (index + 1))
                  .map((movie) => (
                    <Box
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      key={movie.id}
                      $bgPhoto={makeImagePath(movie.backdrop_path || movie.poster_path, "w500")}
                    />
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
