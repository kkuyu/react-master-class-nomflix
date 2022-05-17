import styled from "styled-components";

function Footer() {
  return <Foot>© {new Date().getFullYear()} netflix</Foot>;
}

const Foot = styled.footer`
  margin-top: 35px;
  padding-bottom: 20px;
  font-size: 16px;
  text-align: center;
  opacity: 0.45;
`;

export default Footer;
