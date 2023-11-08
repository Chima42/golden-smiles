import React, { useState } from "react"
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
  isVisible: boolean;
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
        date: data["Submitted At"],
        isVisible: true
      }
    })
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ratingsFilter, setRatingsFilter] = useState([{
    filter: "all",
    selected: true
  },
  {
    filter: "1",
    selected: false
  },
  {
    filter: "2",
    selected: false
  },
  {
    filter: "3",
    selected: false
  },
  {
    filter: "4",
    selected: false
  },
  {
    filter: "5",
    selected: false
  }])
  const [dentistFilter] = useState([{
    name: "all",
    selected: true
  }, ...formatJSON().map(x => ({
    name: x.dentistName,
    selected: false
  }))])

  const [reviewList, setReviewList] = useState<IReview[]>(formatJSON());

  const filterByRating = (rating: string) => {
    setRatingsFilter(ratingsFilter.map(x => {
      x.selected = x.filter === rating;
      return x;
    }))
    setReviewList(reviewList.map(x => {
      if (rating === "all") {
        x.isVisible = true;
        return x;
      }
      x.isVisible = `${x.rating}` === rating;
      return x;
    }))
  }

  const filterByDentist = (event: any) => {
    const dentist = event.target.value;
    setReviewList(reviewList.map(x => {
      if (dentist === "all") {
        x.isVisible = true;
        return x;
      }
      x.isVisible = x.dentistName === dentist;
      return x;
    }))
  }

  const handleFilterClick = () => {
    let copy = !sidebarOpen;
    setSidebarOpen(copy)
  }

  return (
    <StyledWrapper>
      <StyledHeader>
        <StyledLogo>Golden Smiles</StyledLogo>
        <WriteAReview target="_blank" href="https://bu9ylzbcyhu.typeform.com/to/ehW2GX7Y">write a review</WriteAReview>
      </StyledHeader>
      {
        sidebarOpen &&
        <BlackBg onClick={handleFilterClick} />
      }
      <StyledMain>
        <StyledHeading> Reviews </StyledHeading>
        <FilterButton onClick={handleFilterClick}>Filter</FilterButton>
        <ReviewsWrapper>
          {reviewList.map((x) => (
            <Review className={x.isVisible ? "" : "hide"}>
              <ReviewHeader>
                <StyledImage src="https://placehold.co/50x50" alt="" />
                <ReviewBody>
                  <StyledReviewTitle>{x.title}</StyledReviewTitle>
                  <StarWrapper>
                    {[...Array(x.rating).keys()].map((_) => (
                      <Star />
                    ))}
                  </StarWrapper>
                  <ReviewDescription>{x.yourVisit}</ReviewDescription>
                </ReviewBody>
              </ReviewHeader>
              <StyledHR />
              <MetaWrapper>
                <ReviewMeta>
                  Visited: <span>{x.dentistName}</span>{" "}
                </ReviewMeta>
                <ReviewMeta>
                  Treated by: <span>{x.consultant}</span>{" "}
                </ReviewMeta>
                <ReviewMeta>
                  Went in for: <span>{x.procedure}</span>{" "}
                </ReviewMeta>
              </MetaWrapper>
            </Review>
          ))}
        </ReviewsWrapper>
        <Sidebar className={sidebarOpen ? "open" : ""}>
          <SidebarSection>
            <h3>Filter by Rating</h3>
            <RatingsFilterWrapper>
              {ratingsFilter.map((x) => (
                <FilterOption
                  key={x.filter}
                  className={x.selected ? "ratingActive" : ""}
                  onClick={() => filterByRating(x.filter)}
                >
                  {x.filter}
                </FilterOption>
              ))}
            </RatingsFilterWrapper>
          </SidebarSection>
          <SidebarSection>
            <h3>Filter by Dentist</h3>
            <DentistDropdown name="dentists" id="dentists" onChange={filterByDentist}>
              {dentistFilter.map((x, i) => (
                <option key={i}>{x.name}</option>
              ))}
            </DentistDropdown>
          </SidebarSection>
        </Sidebar>
      </StyledMain>
    </StyledWrapper>
  );
}

const SidebarSection = styled.div`
  h3 {
    margin-bottom: 5px;
  }
  margin-bottom: 20px;
`

const BlackBg = styled.div`
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  background-color: rgba(0,0,0,0.6);
  height: 100vh;
`

const FilterButton = styled.div`
  border-radius: 3px;
  background-color: #fff;
  width: 100%;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  padding: 15px;
  font-size: 18px;
  color: var(--purple);
  @media only screen and (min-width: 760px) {
    display: none;
  }
`

const RatingsFilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const DentistDropdown = styled.select`
  border: none;
  border-radius: 3px;
  background-color: #fde8ad;
  font-size: 16px;
  padding: 6px 4px;
  font-size: 14px;
  width: 100%;
  &:focus {
    outline: none;
  }
  option {
    font-size: 16px;
  }
  @media only screen and (min-width: 760px) {
    padding: 3px 4px;
  }
`

const FilterOption = styled.span`
  padding: 6px 10px;
  background: #fde8ad;
  text-align: center;
  font-size: 16px;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 600;
  flex: 0 0 15%;
  @media only screen and (min-width: 760px) {
    padding: 3px 10px;
  }
`

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
  align-items: center;
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
  .hide {
    display: none;
  }
`

const Sidebar = styled.aside`
  transition: all 0.35s ease;
  position: absolute;
  background-color: #fff;
  padding: 20px;
  left: 0;
  top: 0;
  width: 70%;
  transform: translateX(100vw);
  height: 100vh;
  .ratingActive {
    background-color: var(--purple);
    color: #fff;
  }
  @media only screen and (min-width: 760px) {
    position: static;
    transform: translateX(0);
    width: 100%;
    padding: 20px;
    border-radius: 3px;
  }
`

const ReviewDescription = styled.p`
  font-size: 16px;
`

const StyledHeading = styled.h1`
  flex: 100%;
  text-align: center;
  font-size: 55px;
  grid-column: 1 / 3;
  margin: 40px 0;
  font-weight: 700;
  @media only screen and (min-width: 760px) {
    margin: 90px 0;
  }
`

const MetaWrapper = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  @media only screen and (min-width: 760px) {
    gap: 25px;
    flex-direction: row;
  }
`

const ReviewMeta = styled.p`
  color: #ADADAD;
  font-size: 14.5px;
  text-align: left;
  span {
    color: #000;
  }
  @media only screen and (min-width: 760px) {
    span {
      display: inline;
    }
  }
`

const StyledReviewTitle = styled.p`
  color: var(--purple);
  font-size: 21px;
  font-weight: 600;
`


const StyledHR = styled.hr`
  border: none;
  margin: 10px 0;
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
  border-radius: 3px;
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
  flex-direction: column;
  .open {
    transform: translateX(30vw);
  }
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

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
