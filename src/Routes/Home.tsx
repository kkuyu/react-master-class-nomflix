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

const Banner = styled.div<{ bgPhoto: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgPhoto});
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
  height: 200px;
  overflow: hidden;
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

const Box = styled(motion.div)`
  font-size: 20px;
  color: red;
  background-color: white;
`;

const rowVariants = {
  hidden: {
    x: "100vw",
  },
  visible: {
    x: 0,
  },
  exit: {
    x: "-100vw",
  },
};

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);

  const [index, setIndex] = useState(0);
  const increaseIndex = () => setIndex((prev) => prev + 1);

  return (
    <Wrapper>
      {isLoading && (
        <>
          <Loader>Loading...</Loader>
        </>
      )}
      {!isLoading && (
        <>
          <Banner onClick={increaseIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence>
              <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: "tween", duration: 1 }} key={index}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Box key={i}>{i}</Box>
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
