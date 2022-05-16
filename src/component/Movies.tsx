import { useMatch } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

function Movies() {
  const moviesMatch = useMatch("/movies/:movieId");
  return (
    <div>
      <AnimatePresence>
        {moviesMatch && (
          <motion.div layoutId={`movieBox${moviesMatch.params.movieId}`} style={{ position: "absolute", top: "50%", left: "50%", width: "50px", height: "50px", background: "red" }}></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Movies;
