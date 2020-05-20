import React from "react";
import { styled } from "./styled-component";

type TestProps = {
  isRed: boolean;
  isBig: boolean;
};

const Test = styled.div<TestProps>`
  width: ${({ isBig }) => (isBig ? "200px" : "100px")};
  height: 100px;
  background-color: ${({ isRed }) => (isRed ? "red" : "blue")};
`;

const App = () => {
  return (
    <Test isBig={true} isRed={true}>
      Je suis un contenu test
    </Test>
  );
};

export default App;
