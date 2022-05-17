import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { motion } from "framer-motion";
import styled from "styled-components";

import { IContentType } from "../core/api";
import { previewState } from "../core/atom";
import { makeImagePath, makeLineClampStyle } from "../utils";

interface ITopBannerData {
  id: number;
  backdrop_path: string;
  poster_path: string;
  headline: string;
  overview: string;
}

interface ITopBanner {
  modifyType: IContentType;
  modifyKey: string;
  data: ITopBannerData;
}

function TopBanner({ modifyType, modifyKey, data }: ITopBanner) {
  const navigate = useNavigate();
  const setPreview = useSetRecoilState(previewState);

  const moreClicked = (product: ITopBannerData) => {
    if (modifyType === "movie") {
      navigate(`/movies/${product.id}`);
    }
    if (modifyType === "tv") {
      navigate(`/tv/tvs/${product.id}`);
    }

    setPreview({
      modifyType: modifyType,
      modifyKey: modifyKey,
      id: product.id || 0,
      headline: product.headline || "",
      overview: product.overview || "",
      backdrop_path: product.backdrop_path || "",
      poster_path: product.poster_path || "",
    });
  };

  return (
    <Container $bgPhoto={makeImagePath(data.backdrop_path || data.poster_path || "")}>
      <Title>{data.headline}</Title>
      <Overview>{data.overview}</Overview>
      <MoreButton type="button" layoutId={`${modifyType}_${modifyKey}_${data.id}`} onClick={() => moreClicked(data)}>
        More information
      </MoreButton>
    </Container>
  );
}

const Container = styled.div<{ $bgPhoto: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 90vh;
  padding: 60px 4%;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.$bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  width: 55%;
  font-size: 36px;
  font-weight: bold;
  ${makeLineClampStyle(1.2, 3)}
`;

const Overview = styled.p`
  margin-top: 6px;
  width: 42%;
  font-size: 16px;
  ${makeLineClampStyle(1.4, 4)}
`;

const MoreButton = styled(motion.button)`
  margin-top: 18px;
  width: 180px;
  padding: 10px 16px;
  color: white;
  background-color: rgba(109, 109, 110, 0.7);
  border-radius: 8px;
`;

export default TopBanner;
