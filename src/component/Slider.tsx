import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

import { IContentType } from "../core/api";
import { previewState } from "../core/atom";
import { makeImagePath, makeLineClampStyle } from "../utils";

interface ISliderData {
  id: number;
  backdrop_path: string;
  poster_path: string;
  headline: string;
  overview: string;
}

interface ISlider {
  modifyType: IContentType;
  modifyKey: string;
  data: ISliderData[];
}

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

function Slider({ modifyType, modifyKey, data }: ISlider) {
  const navigate = useNavigate();
  const setPreview = useSetRecoilState(previewState);

  const rowSize = 5;

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const increaseIndex = () => {
    if (!data) return;
    if (leaving) return;
    toggleLeaving();
    const totalMovies = data.length - 1;
    const maxIndex = Math.floor(totalMovies / rowSize) - 1;
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };
  const decreaseIndex = () => {
    if (!data) return;
    if (leaving) return;
    toggleLeaving();
    const totalMovies = data.length - 1;
    const maxIndex = Math.floor(totalMovies / rowSize) - 1;
    setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const onBoxClicked = (product: ISliderData) => {
    if (modifyType === "movie") {
      navigate(`/movies/${product.id}`);
    }
    if (modifyType === "tv") {
      navigate(`/tv/tvs/${product.id}`);
    }

    setPreview({
      modifyType: modifyType,
      modifyKey: modifyKey,
      id: product.id,
      headline: product.headline || "",
      overview: product.overview || "",
      backdrop_path: product.backdrop_path || "",
      poster_path: product.poster_path || "",
    });
  };

  if (!data || !data.length) {
    return null;
  }

  return (
    <Container>
      <ControlButton type="button" onClick={decreaseIndex}>
        <svg role="img" aria-label="prev" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z" />
        </svg>
      </ControlButton>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: "tween", duration: 1 }} key={index}>
          {data.slice(rowSize * index, rowSize * (index + 1)).map((product, index) => (
            <Item
              key={product.id}
              layoutId={`${modifyType}_${modifyKey}_${product.id}`}
              variants={boxVariants}
              whileHover="hover"
              initial="normal"
              transition={{ type: "tween" }}
              style={{ originX: index === 0 ? 0 : index === rowSize - 1 ? 1 : 0.5 }}
              onClick={() => onBoxClicked(product)}
              $bgPhoto={makeImagePath(product.backdrop_path || product.poster_path || "", "w500")}
            >
              <Info variants={infoVariants}>
                <strong>{product.headline || ""}</strong>
              </Info>
            </Item>
          ))}
        </Row>
      </AnimatePresence>
      <ControlButton type="button" onClick={increaseIndex}>
        <svg role="img" aria-label="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
        </svg>
      </ControlButton>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  margin-top: 16px;
  &:before {
    content: "";
    display: block;
    width: 100%;
    padding-bottom: 10%;
  }
`;

const ControlButton = styled.button`
  position: absolute;
  top: 0;
  left: auto;
  right: 100%;
  margin: 0 0.5% 0 0;
  width: 3.5%;
  max-width: 32px;
  height: 100%;
  background-color: rgba(109, 109, 110, 0.7);
  opacity: 0.4;
  &:hover,
  &:focus {
    opacity: 1;
  }
  &:last-child {
    margin: 0 0 0 0.5%;
    left: 100%;
    right: auto;
  }
  svg {
    margin: 0 auto;
    width: 60%;
    fill: black;
  }
`;

const Row = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(5, 1fr);
  width: 100%;
  height: 100%;
`;

const Item = styled(motion.button)<{ $bgPhoto: string }>`
  display: flex;
  align-items: flex-end;
  font-size: 20px;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  border-radius: 4px;
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

export default Slider;
