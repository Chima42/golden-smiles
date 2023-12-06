import React, { useEffect, useState } from "react"
import styled from "styled-components";
import Layout from "../components/Layout";
import StarRating from "../components/StarRating";
import { BlackBg, FilterOption, RatingsFilterWrapper, Sidebar, SidebarSection, Wrapper } from "../components/Shared";
import { HeadFC, graphql } from "gatsby";

interface IReview {
  dateCreated: string;
  images: string;
  place_id: string;
  author: string;
  reviewBody: string;
  reviewRating: number;
}

const PracticePage = (props: any) => {
  const { pageContext } = props;
  console.log(props)
  const queryResponse = props?.data?.allReviewsDataJson.edges;
  const [ratingsFilter, setRatingsFilter] = useState([{
    rating: "All",
    selected: true
  },
  {
    rating: "3.0",
    selected: false
  },
  {
    rating: "4.0",
    selected: false
  },
  {
    rating: "4.5",
    selected: false
  }])
  const [sortOptions, setSortOptions] = useState([{
    type: "newest",
    selected: true
  }, {
    type: "oldest",
    selected: false
  }]);
  const [treatmentFilter, setTreatmentFilter] = useState([{
    treatment: "All",
    selected: true
  }]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reviews, SetReviews] = useState<IReview[]>(queryResponse.map(x => x.node));

  useEffect(() => {
    if (isMobile) {
      document.getElementsByTagName("body")[0].classList.toggle("set-overflow");
    }
  }, [!sidebarOpen]);

  useEffect(() => {
    if (window.innerWidth < 760) {
      setIsMobile(true);
    }
  }, []);

  const activeFilters = () => {
    const filter: any = {
      ...ratingsFilter.find(x => x.selected)
    }
    delete filter["selected"];
    delete filter["id"];
    if (filter["rating"] === "All") {
      delete filter["rating"];
    }
    return filter;
  }

  const filterByRating = (rating: string) => {
    setRatingsFilter(ratingsFilter.map(x => {
      x.selected = x.rating === rating;
      return x;
    }))
  }

  const sortByDate = (type: string) => {
    setSortOptions(sortOptions.map(x => {
      x.selected = x.type === type;
      return x;
    }))
  }

  const filterByTreatment = (event: any) => {
    const treatment = event.target.value;
    setTreatmentFilter(treatmentFilter.map(x => {
      x.selected = x.treatment === treatment;
      return x;
    }))
  }

  const handleFilterClick = () => {
    let copy = !sidebarOpen;
    setSidebarOpen(copy)
  }

  const filterReviewsList = () => {
    return reviews
    .filter((item: IReview) => {
      return Object.entries(activeFilters()).every(([k, v]) => {
        return +item.reviewRating > Number(v)
      })
    })
  }


  return (
    <Layout>
      {sidebarOpen && <BlackBg onClick={handleFilterClick} />}
      <StyledHeading>{pageContext.name}</StyledHeading>
      <Wrapper>
        <Reviews>
          {
            filterReviewsList().map(review => (
              <Review>
                <ReviewHeader>
                  <LeftSection>
                    <ReviewRatingWrapper>
                      <StarRating rating={`${review.reviewRating}`}/>
                    </ReviewRatingWrapper>
                    <Author>- {review.author}</Author>
                  </LeftSection>
                </ReviewHeader>
                <ReviewMain>
                  {review.reviewBody}
                </ReviewMain>
                <ReviewFooter>
                  <Treatment></Treatment>
                </ReviewFooter>
              </Review>
            ))
          }
        </Reviews>
        <Sidebar className={sidebarOpen ? "open" : ""}>
           {/* <SidebarSection>
             <h3>Sort by Date</h3>
             <SortOptionsWrapper>
               {sortOptions.map((x) => (
                <FilterOption
                  key={x.type}
                  className={x.selected ? "active" : ""}
                  onClick={() => sortByDate(x.type)}
                >
                  {x.type}
                </FilterOption>
              ))}
            </SortOptionsWrapper>
          </SidebarSection> */}
          <SidebarSection>
            <h3>Filter by Rating</h3>
            <RatingsFilterWrapper>
              {ratingsFilter.map((x) => (
                <FilterOption
                  key={x.rating}
                  className={x.selected ? "active" : ""}
                  onClick={() => filterByRating(x.rating)}
                >
                  {x.rating}
                </FilterOption>
              ))}
            </RatingsFilterWrapper>
          </SidebarSection>
          {/* <SidebarSection>
            <h3>Filter by Treatment</h3>
            <Dropdown name="treatment" id="treatment" onChange={filterByTreatment}>
              {treatmentFilter.map((x, i) => (
                <option key={i}>{x.treatment}</option>
              ))}
            </Dropdown>
          </SidebarSection> */}
        </Sidebar>
      </Wrapper>
    </Layout>
  )
}

export const query = graphql`
  query GetPracticeById($id: String!) {
    allReviewsDataJson(filter: {place_id: {eq: $id}}) {
      edges {
        node {
          reviewBody
          author
          reviewRating
          images
          dateCreated
          place_id
        }
      }
    }
  }
`

const ReviewFooter = styled.footer`
  display: none;
`

const LeftSection = styled.div`
  display: flex;
  gap: 4px;
`

const Treatment = styled.p`
  font-size: 14px;
`

const Author = styled.p`
  font-size: 18px;
  font-weight: bold;
`

const ReviewMain = styled.p`
  margin-top: 10px;
  line-height: 1.6em;
`

const ReviewRatingWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

const Reviews = styled.ul`
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 20px;
`

const Review = styled.li`
  padding: 0;
  margin: 0;
  list-style: none;
  padding: 20px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
  span {
    min-height: 42px;
    display: block;
  }
`

const Dropdown = styled.select`
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

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
`
  
const HeaderLeft = styled.div`
  gap: 20px;
  display: inherit;
`

const ReviewDate = styled.span`
  font-size: 13px;
  opacity: 0.4;
`

const ReviewBody = styled.div`
  display: flex;
  flex-direction: column;
  p {
    text-align: left;
  }
`

const SortOptionsWrapper = styled.div`
  display: flex;
  gap: 5px;
`

const StyledHeading = styled.h1`
  flex: 100%;
  text-align: center;
  font-size: 55px;
  grid-column: 1 / 3;
  margin: 40px 0;
  font-weight: 700;
  word-wrap: break-word;
  @media only screen and (min-width: 760px) {
    margin: 90px 0;
  }
`

export default PracticePage
export const Head: HeadFC = (props) => {
  return <title>RatedSmile - {(props.pageContext as any).name}</title>;
}