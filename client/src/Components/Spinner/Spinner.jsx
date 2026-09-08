import { Spinner } from "@chakra-ui/react";
import React from "react";

const SpinnerCard = () => {
  return (
    <div>
      <Spinner
        thickness="3px"
        speed="0.7s"
        emptyColor="rgba(255,255,255,0.12)"
        color="#C9A36A"
        size="xl"
      />
    </div>
  );
};

export default SpinnerCard;
