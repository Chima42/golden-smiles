import React, { useEffect, useState } from "react"
import styled from "styled-components";
import Layout from "../components/Layout";
import StarRating from "../components/StarRating";
import { BlackBg, FilterOption, Sidebar, SidebarSection, Wrapper } from "../components/SharedWrappers";

const PracticePage = (props: any) => {
  const { pageContext } = props;
  const [ratingsFilter, setRatingsFilter] = useState([{
    rating: "All",
    selected: true
  },
  {
    rating: "1",
    selected: false
  },
  {
    rating: "2",
    selected: false
  },
  {
    rating: "3",
    selected: false
  },
  {
    rating: "4",
    selected: false
  },
  {
    rating: "5",
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

  // ...formatJSON().map(x => ({
  //   treatment: x.treatment,
  //   selected: false
  // }))

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


  return (
    <Layout>
      {sidebarOpen && <BlackBg onClick={handleFilterClick} />}
      <StyledHeading>{pageContext.name}</StyledHeading>
      <Wrapper>
        <p>reviews to go here</p>
        <Sidebar className={sidebarOpen ? "open" : ""}>
           <SidebarSection>
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
          </SidebarSection>
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
          <SidebarSection>
            <h3>Filter by Treatment</h3>
            <Dropdown name="treatment" id="treatment" onChange={filterByTreatment}>
              {treatmentFilter.map((x, i) => (
                <option key={i}>{x.treatment}</option>
              ))}
            </Dropdown>
          </SidebarSection>
        </Sidebar>
      </Wrapper>
    </Layout>
  )
}

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

const RatingsFilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
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