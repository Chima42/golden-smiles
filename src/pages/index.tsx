import React, { useEffect, useState } from "react"
import { HeadFC, PageProps, graphql, Link } from "gatsby"
import styled from "styled-components"
import Star from "../images/star.svg"
import Chevron from "../images/right-arrow.svg"
import Globe from "../images/globe.svg"
import practices from "../data/practices.json";

interface IPractice {
  name: string;
  jsonId: string;
  address: string;
}
interface IPracticeUI extends IPractice {
  isVisible: boolean;
}

const IndexPage: React.FC<PageProps> = ({ data }: any) => {
  const practiceData: IPracticeUI[] = practices.map(x => {
    (x as any)["isVisible"] = true;
    return x as IPracticeUI
  })
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  useEffect(() => {
    if (window.innerWidth < 760) {
      setIsMobile(true);
    }
  }, []);

  useEffect(() => {
    if (isMobile) {
      document.getElementsByTagName("body")[0].classList.toggle("set-overflow");
    }
  }, [!sidebarOpen])

  const [practiceFilter, setPracticeFilter] = useState<{
    practice: string,
    id: string,
    selected: boolean
  }[]>([])

  const [pagination, setPagination] = useState({
    data: [] as IPracticeUI[],
    offset: 0,
    numberPerPage: 10,
    pageCount: 0,
    currentData: [] as IPracticeUI[]
  });

  useEffect(() => {
    setPagination({
      data: practiceData.slice(0,50),
      offset: 0,
      numberPerPage: 9,
      pageCount: 0,
      currentData: [] as IPracticeUI[]
    })
  }, [practiceData.length])
  
  useEffect(() => {
    setPracticeFilter([{
      practice: "All",
      id: "0",
      selected: true
    }, ...practiceData.slice(0,50).map(x => ({
      practice: x.name,
      id: x.jsonId,
      selected: false
    }))]);
  }, [practiceData.length])

  useEffect(() => {
    setPagination((prevState) => {
      return {
        ...prevState,
        pageCount: prevState.data.length / prevState.numberPerPage,
        currentData: prevState.data.slice(pagination.offset, pagination.offset + pagination.numberPerPage)
      }
    })
  }, [pagination.numberPerPage, pagination.offset])

  const handlePageClick = (event: any) => {
    const selected = event.selected;
    const offset = selected * pagination.numberPerPage
    setPagination({ ...pagination, offset })
  }

  const activeFilters = () => {
    const filter: any = {
      ...ratingsFilter.find(x => x.selected),
      ...practiceFilter.find(x => x.selected)
    }
    delete filter["selected"];
    delete filter["id"];
    if (filter["practice"] === "All") {
      delete filter["practice"];
    }
    if (filter["rating"] === "All") {
      delete filter["rating"];
    }
    console.log(filter)
    return filter;
  }

  // const filteredList = () => {
  //   return practiceList
  //     .filter((item: any) => {
  //       return Object.entries(activeFilters()).every(([k, v]) => item[k] === v)
  //     })
  // }

  const filterByRating = (rating: string) => {
    setRatingsFilter(ratingsFilter.map(x => {
      x.selected = x.rating === rating;
      return x;
    }))
  }

  const filterByDentist = (event: any) => {
    const dentist = event.target.value;
    setPracticeFilter(practiceFilter.map(x => {
      x.selected = x.practice === dentist;
      return x;
    }))
  }

  const handleFilterClick = () => {
    let copy = !sidebarOpen;
    setSidebarOpen(copy)
  }

  const searchByText = (item: IPracticeUI) => {
    const itemLine = `${item.name} ${item.address}`
    return itemLine.toLowerCase().includes(searchTerm.toLowerCase())
  }

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
      {sidebarOpen && <BlackBg onClick={handleFilterClick} />}
      <StyledMain>
        <StyledHeading> Reviews </StyledHeading>
        {
          <InnerWrapper>
            <SearchBar onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by practice or address"/>
            <small>Showing {practiceData.filter(searchByText).slice(0,18).length} of {practiceData.length} Practices</small>
            <Practices>
              {
                practiceData.filter(searchByText).slice(0,18).map(item => 
                <Practice key={item.jsonId}>
                    <StarWrapper>
                      {[...Array(5).keys()].map((_, i) => (
                        <Star key={i} />
                      ))}
                    </StarWrapper>
                    <Link to={"/practices/" + item.name.split(" ").join("-").toLowerCase()}>
                      <h3>{item.name}</h3> <span>{item.address}</span>
                    </Link>
                    <ReviewHR />
                    <PracticeFooter>
                      <LeaveAReview href="https://bu9ylzbcyhu.typeform.com/to/ehW2GX7Y">
                        leave a review
                        <Chevron />
                      </LeaveAReview>
                      <Globe />
                    </PracticeFooter>
                </Practice>)
              }
            </Practices>
          </InnerWrapper>
        }
        {/* <Sidebar className={sidebarOpen ? "open" : ""}>
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
            <h3>Filter by Practice</h3>
            <Dropdown name="dentists" id="dentists" onChange={filterByDentist}>
              {practiceFilter.map((x, i) => (
                <option key={i}>{x.practice}</option>
              ))}
            </Dropdown>
          </SidebarSection>
        </Sidebar> */}
      </StyledMain>
    </StyledWrapper>
  );
}

export const query = graphql`
  query GetPractices {
    allPracticesJson {
      edges {
        node {
          address
          jsonId
          name
        }
      }
    }
  }
`

const PracticeFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  svg {
    width: 18px;
    path {
      stroke: var(--purple);
    }
  }
`

const ReviewHR = styled.hr`
  border: none;
  width: 100%;
  border-bottom: solid 1px rgba(0,0,0,0.1);
  margin: 10px 0 0;
`

const LeaveAReview = styled.a`
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  color: var(--purple);
  text-decoration: none;
  padding: 0;
  svg {
    width: 6px;
    margin-left: 6px;
    position: relative;
    top: 2px;
  }
  &:hover {
    opacity: 0.7;
  }
`

const Practices = styled.ul`
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`

const Practice = styled.li`
  padding: 0;
  margin: 0;
  list-style: none;
  flex: 1 0 48%;
  padding: 20px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
  span {
    min-height: 42px;
    display: block;
  }
`

const SearchBar = styled.input`
  width: 100%;
  padding: 20px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0);
  border-radius: 3px;
  background-color: #fff;
  font-size: 16px;
  border: none;
  transition: all 0.25s ease;
  &:focus {
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
    outline: none;
  }
`

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

const SortOptionsWrapper = styled.div`
  display: flex;
  gap: 5px;
`

const RatingsFilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
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
  margin: 3px 0 10px; 
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

const InnerWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 30px;
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
  // @media only screen and (min-width: 760px) {
  //   display: grid;
  //   grid-template-columns: 70% 1fr;
  // }
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
