import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import styled from "styled-components"

const IndexPage: React.FC<PageProps> = () => {
  return (
    <StyledWrapper>
      <StyledHeader>
        <StyledLogo>Golden Smiles</StyledLogo>
        <StyledButton>write a review</StyledButton>
      </StyledHeader>
      <StyledMain>
        <StyledHeading> Reviews </StyledHeading>
        {
          ["", "", "", "", "", "", "", "", "", "", "", ""].map(x => (
            <StyledReview>
              <StyledImage src="" alt="" />
              <StyledReviewTitle>title</StyledReviewTitle>
              <StyledReviewBody>body message</StyledReviewBody>
              <StyledHR />
              <StyledProcedureHeading>Went in for:</StyledProcedureHeading>
              <StyledProcedure> </StyledProcedure>
            </StyledReview>
          ))
        }
      </StyledMain>
    </StyledWrapper>
  )
}

const StyledReviewBody = styled.p`
  font-size: 16px;
`

const StyledHeading = styled.h1`
  flex: 100%;
  text-align: center;
  font-size: 55px;
  margin: 90px 0;
`

const StyledProcedureHeading = styled.p`
  color: #ADADAD;
`

const StyledReviewTitle = styled.p`
  color: var(--purple);
  font-size: 24px;
  font-weight: 600;
`

const StyledProcedure = styled.p``

const StyledHR = styled.hr`
  border: none;
  margin: 15px 0;
  border-bottom: solid 1px rgba(0,0,0,0.4);
  opacity: 0.3;
`

const StyledImage = styled.img`
  border: none;
  border-radius: 100px;
  padding: 50px;
  margin: 0 0 7px 0;
  border: solid 2px #fff;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
`

const StyledReview = styled.div`
  background-color: #fff;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
  flex: 1 0 32%;
`
const StyledMain = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 1010px;
  width: 100%;
  gap: 20px;
  margin: 0 auto;
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
