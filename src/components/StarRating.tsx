import React from "react"
import styled from "styled-components";
import Star from "../images/star.svg"

interface IStarRating {
  rating: number
}

const StarRating = ({rating}: IStarRating) => {

  return (
    <StarWrapper>
      {[...Array(rating).keys()].map((_, i) => (
        <Star key={i} />
      ))}
    </StarWrapper>
  )
}

const StarWrapper = styled.div`
  display: flex;
  gap: 2px;
  margin: 3px 0 10px; 
  svg {
    width: 18px;
    height: auto;
    path {
      fill: var(--purple);
    }
  }
`

export default StarRating