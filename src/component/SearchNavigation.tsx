import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

type ISearchNavigation = {
  page: number;
  totalPages: number;
};

function SearchNavigation({ page, totalPages }: ISearchNavigation) {
  const [searchParams, setSearchParams] = useSearchParams();
  const modifyType = searchParams.get("type") || "";
  const keyword = searchParams.get("keyword") || "";

  const btnArr = (() => {
    const rowSize = 4;
    const startPage = rowSize * Math.floor((page - 1) / rowSize) + 1;
    const endPage = startPage + rowSize - 1 < totalPages ? startPage + rowSize - 1 : totalPages;

    const prevBtn = {
      type: "prev",
      displayText: `prev(${startPage - 1})`,
      isVisible: startPage !== 1,
      onClick: () => setSearchParams({ type: modifyType, keyword, page: (startPage - 1).toString() }),
    };

    const nextBtn = {
      type: "next",
      displayText: `next(${endPage + 1})`,
      isVisible: endPage !== totalPages,
      onClick: () => setSearchParams({ type: modifyType, keyword, page: (endPage + 1).toString() }),
    };

    const numberBtn = Array.from({ length: endPage - startPage + 1 }, (_, i) => {
      const num = startPage + i;
      return {
        type: "number",
        displayText: startPage + i,
        isVisible: true,
        onClick: () => setSearchParams({ type: modifyType, keyword, page: num.toString() }),
      };
    });

    return [prevBtn, ...numberBtn, nextBtn];
  })();

  return (
    <Container>
      {btnArr
        .filter((info) => info.isVisible)
        .map((info) => (
          <button key={info.displayText} onClick={info.onClick} style={{ textDecoration: info.displayText === page ? "underline" : "none" }}>
            {info.type === "number" && info.displayText}
            {info.type === "prev" && (
              <svg role="img" aria-label={info.displayText.toString()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
                <path d="M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l137.4 137.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448z" />
              </svg>
            )}
            {info.type === "next" && (
              <svg role="img" aria-label={info.displayText.toString()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
                <path d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z" />
              </svg>
            )}
          </button>
        ))}
    </Container>
  );
}

const Container = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
  button {
    width: 25px;
    font-size: 16px;
    color: white;
  }
  svg {
    margin: 0 auto;
    width: 8px;
    fill: white;
  }
`;

export default SearchNavigation;
