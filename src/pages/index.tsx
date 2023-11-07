import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import styled from "styled-components"
import reviewsData from "../content/reviews_data.json"
import Star from "../images/star.svg"

interface IReview {
  name: string;
  yourVisit: string;
  rating: number;
  procedure: string;
  title: string;
  consultant: string;
  dentistName: string;
  date: string;
}

const IndexPage: React.FC<PageProps> = () => {

  const formatJSON = (): IReview[] => {
    return reviewsData.map(data => {
      return {
        name: data["Hello, what's your name?"],
        yourVisit: data["How was your visit to the dentist you went to?"],
        rating: data["What rating would you give it out of 5?"],
        procedure: data["What operation/ procedure did you go in for?"],
        title: data["Give your review a title"],
        consultant: data["What was the name of the consultant you saw?"],
        dentistName: data["Which dentist did you visit?"],
        date: data["Submitted At"]
      }
    })
  }


  return (
    <StyledWrapper>
      <StyledHeader>
        <StyledLogo>Golden Smiles</StyledLogo>
        <StyledButton>write a review</StyledButton>
      </StyledHeader>
      <StyledMain>
        <StyledHeading> Reviews </StyledHeading>
        <ReviewsWrapper>
          {
            formatJSON().map(x => (
              <Review>
                <ReviewHeader>
                  <StyledImage src="https://placehold.co/50x50" alt="" />
                  <ReviewBody>
                    <StyledReviewTitle>{x.title}</StyledReviewTitle>
                    <StarWrapper>
                      {
                        [...Array(x.rating).keys()].map(_ => <Star />)
                      }
                    </StarWrapper>
                    <ReviewDescription>{x.yourVisit}</ReviewDescription>
                  </ReviewBody>
                </ReviewHeader>
                <StyledHR />
                <MetaWrapper>
                  <ReviewMeta>Visited: <span>{x.dentistName}</span> </ReviewMeta>
                  <ReviewMeta>Treated by: <span>{x.consultant}</span> </ReviewMeta>
                  <ReviewMeta>Went in for: <span>{x.procedure}</span> </ReviewMeta>
                </MetaWrapper>
              </Review>
            ))
          }
        </ReviewsWrapper>
        <Sidebar>
          sidebar
        </Sidebar>
      </StyledMain>
    </StyledWrapper>
  )
}

const StarWrapper = styled.div`
  display: flex;
  gap: 2px;
  margin: 3px 0; 
  svg {
    width: 18px;
    height: auto;
    path {
      fill: var(--purple);
    }
  }
`

const ReviewHeader = styled.div`
  display: flex;
  gap: 20px;
`

const ReviewBody = styled.div`
  display: flex;
  flex-direction: column;
  p {
    text-align: left;
  }
`

const ReviewsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Sidebar = styled.aside`

`

const ReviewDescription = styled.p`
  font-size: 16px;
`

const StyledHeading = styled.h1`
  flex: 100%;
  text-align: center;
  font-size: 55px;
  margin: 90px 0;
  grid-column: 1 / 3;

`

const MetaWrapper = styled.div`
  display: flex;
  gap: 13px;
`

const ReviewMeta = styled.p`
  color: #ADADAD;
  font-size: 14.5px;
  span {
    color: #000;
  }
`

const StyledReviewTitle = styled.p`
  color: var(--purple);
  font-size: 24px;
  font-weight: 600;
`


const StyledHR = styled.hr`
  border: none;
  margin: 15px 0;
  border-bottom: solid 1px rgba(0,0,0,0.4);
  opacity: 0.3;
`

const StyledImage = styled.img`
  border: none;
  border-radius: 100px;
  margin: 0 0 7px 0;
  height: max-content;
  border: solid 2px #fff;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
`

const Review = styled.div`
  background-color: #fff;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
`
const StyledMain = styled.div`
  display: flex;
  max-width: 1010px;
  width: 100%;
  gap: 20px;
  margin: 0 auto;
  @media only screen and (min-width: 760px) {
    display: grid;
    grid-template-columns: 70% 1fr;
  }
`

const StyledLogo = styled.div`
  padding: 10px;
`

const StyledWrapper = styled.div`
  max-width: 1280px;
  padding: 0 30px;
  margin: 0 auto;
  width: 100%;
`

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
` 

const StyledButton = styled.button`
  background: #fff;
  border: solid 0.13em var(--purple);
  border-radius: 6px;
  padding: 11px 16px;
  font-weight: 600;
  color: var(--purple);
  cursor: pointer;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
`

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
