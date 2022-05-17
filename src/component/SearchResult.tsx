import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

import { makeImagePath } from "../utils";

interface ISearchData {
  id: number;
  backdrop_path: string;
  poster_path: string;
  headline: string;
  overview: string;
}

interface ISearchResult {
  data: ISearchData[];
  status: "loading" | "success" | "error" | string;
}

function SearchResult({ data, status }: ISearchResult) {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  if (status === "loading") {
    return (
      <Container>
        <Empty>
          <p>Loading...</p>
        </Empty>
      </Container>
    );
  }

  if (!data.length) {
    return (
      <Container>
        <Empty>
          <p>No Result "{keyword}" :&#40;</p>
        </Empty>
      </Container>
    );
  }

  return (
    <Container>
      {data.map((product) => (
        <Item key={product.id}>
          <Cover>
            <img src={makeImagePath(product.backdrop_path || product.poster_path || "", "w500")} alt="" />
          </Cover>
          <Info>
            <strong>{product.headline}</strong>
            <p>{product.overview}</p>
          </Info>
        </Item>
      ))}
    </Container>
  );
}

const Container = styled.div`
  margin: 0 -20px;
  &:after {
    content: "";
    display: block;
    clear: both;
  }
`;

const Empty = styled.div`
  padding: 20px 0;
  text-align: center;
`;

const Item = styled.div`
  float: left;
  display: flex;
  width: 50%;
  padding: 0 20px;
  color: white;
  &:nth-child(2) ~ & {
    margin-top: 30px;
  }
  &:nth-child(2n + 1) {
    clear: both;
  }
`;

const Cover = styled.div`
  width: 30%;
  max-width: 200px;
  min-width: 150px;
  img {
    border-radius: 15px;
    width: 100%;
  }
`;

const Info = styled.div`
  flex: 1 1 0;
  padding-left: 20px;
  strong {
    font-size: 20px;
    font-weight: bold;
  }
  p {
    margin-top: 10px;
  }
`;

export default SearchResult;
