import styled, { keyframes } from "styled-components";

export const H1 = styled.h1`
  color: black;
  font-size: 1.3rem;
  text-align: center;
  text-shadow: 1px 1px grey;
`;
const fadeIn = keyframes`
  0% { color: lightgrey; }
  50% { color: pink; }
  100% { color: black; }
`;
export const P = styled.p`
  animation: ${fadeIn} 2s ease-in-out;
  color: black;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  animation: ;
`;
export const Ul = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0.5rem;
  // background-color: grey;
  // border: 0.1px solid black;
  cursor: pointer;
  &:hover {
    background: lightpink;
    border-radius: 15px;
  }
`;
export const Li = styled.li`
  color: black;
  font-weight: bold;
`;
