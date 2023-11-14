import React, { useEffect, useState } from "react"
import styled from "styled-components";
import Layout from "../components/Layout";
import StarRating from "../components/StarRating";

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
      <FilterButton onClick={handleFilterClick}>Filter</FilterButton>
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


const BlackBg = styled.div`
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  background-color: rgba(0,0,0,0.6);
  height: 100vh;
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
  .active {
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

const SidebarSection = styled.div`
  h3 {
    margin-bottom: 5px;
  }
  margin-bottom: 20px;
`

const Wrapper = styled.div`
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