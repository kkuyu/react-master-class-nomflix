import { useMatch, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

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
  top: calc(50% - 35vw);
  left: calc(50% - 25vw);
  width: 50vw;
  height: 70vh;
  border: 1px solid red;
`;

function Movies() {
  const navigate = useNavigate();
  const moviesMatch = useMatch("/movies/:movieId");

  const onOverlayClick = () => {
    navigate(-1);
  };

  return (
    <AnimatePresence>
      {moviesMatch && (
        <>
          <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
          <BigMovie layoutId={`movieBox${moviesMatch.params.movieId}`}></BigMovie>
        </>
      )}
    </AnimatePresence>
  );
}

export default Movies;
