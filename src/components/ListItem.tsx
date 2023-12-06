import React, { useEffect, useState } from "react"
import styled from "styled-components"

export default function Layout({ children }: any) {

  return (
    <StyledWrapper>
      <StyledHeader>
        <StyledLogo>Golden Smiles</StyledLogo>
        <WriteAReview
          target="_blank"
          href="https://bu9ylzbcyhu.typeform.com/to/ehW2GX7Y"
        >
          write a review
        </WriteAReview>
      </StyledHeader>
      <StyledMain>
        {children}
      </StyledMain>
    </StyledWrapper>
  )
}

const StyledMain = styled.section`
  display: flex;
  max-width: 1010px;
  width: 100%;
  gap: 20px;
  margin: 0 auto;
  flex-direction: column;
  .open {
    transform: translateX(30vw);
  }
`

const StyledWrapper = styled.div`
  max-width: 1280px;
  padding: 0 30px;
  margin: 0 auto;
  width: 100%;
`

const StyledLogo = styled.div`
  padding: 10px;
`

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
` 

const WriteAReview = styled.a`
  background: #fff;
  text-decoration: none;
  border: solid 0.13em var(--purple);
  border-radius: 6px;
  padding: 11px 16px;
  font-weight: 600;
  color: var(--purple);
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
  &:hover {
    opacity: 0.8;
  }
`