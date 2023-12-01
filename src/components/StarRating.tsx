import React from "react"
import styled from "styled-components";
import Star from "../images/star.svg"

interface IStarRating {
  rating: string
}

const StarRating = ({rating}: IStarRating) => {

  const totalFiveStarsWidth = 92;

  const calculateWidth = () => (totalFiveStarsWidth / 5 * +rating).toFixed(0);

  return (
    <StarOuterWrapper width={calculateWidth()}>
      <StarWrapper>
        {[...Array(5).keys()].map((_, i) => (
          <Star key={i} />
        ))}
      </StarWrapper>
    </StarOuterWrapper>
  )
}

const StarOuterWrapper = styled.div<{width: string}>`
  position: relative;
  height: 20px;
  width: ${({width}) => width}px;
  overflow: hidden;
`

const StarWrapper = styled.div`
  display: flex;
  position: absolute;
  svg {
    display: inline;
    width: 18px;
    height: auto;
    path {
      fill: var(--purple);
    }
  }
`

export default StarRating