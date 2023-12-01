import React, { useEffect, useState } from "react"
import { HeadFC, PageProps, graphql, Link } from "gatsby"
import styled from "styled-components"
import Star from "../images/star.svg"
import Chevron from "../images/right-arrow.svg"
import Globe from "../images/globe.svg"
import practices from "../data/practicesV3.json";
import Layout from "../components/Layout"
import Searchbar from "../components/Searchbar"
import StarRating from "../components/StarRating"
import { BlackBg, Sidebar, Wrapper } from "../components/SharedWrappers";

interface IPractice {
  name: string;
  address: string;
  phone: string;
  status: string;
  postcode: string;
  rating: string;
  reviews: number;
  website: string;
  latitude: string;
  longitude: string;
  placeId: string;
  isVisible: boolean;
  reviewsUrl: string;
  data?: any;
}

const IndexPage: React.FC<PageProps> = ({ data }: any) => {
  const [filteredList, setFilteredList] = useState(practices as IPractice[])
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
  const [practiceFilter, setPracticeFilter] = useState<{
    practice: string,
    id: string,
    selected: boolean
  }[]>([])
  const [pagination, setPagination] = useState({
    data: [] as IPractice[],
    offset: 0,
    numberPerPage: 10,
    pageCount: 0,
    currentData: [] as IPractice[]
  });
  const [foundPostcodes, setFoundPostcodes] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (isMobile) {
      document.getElementsByTagName("body")[0].classList.toggle("set-overflow");
    }
  }, [!sidebarOpen]);

  useEffect(() => {
    setPagination({
      data: filteredList,
      offset: 0,
      numberPerPage: 9,
      pageCount: 0,
      currentData: [] as IPractice[]
    })
  }, [filteredList.length])
  
  useEffect(() => {
    setPracticeFilter([{
      practice: "All",
      id: "0",
      selected: true
    }, ...filteredList.slice(0,50).map(x => ({
      practice: x.name,
      id: x.placeId,
      selected: false
    }))]);
  }, [filteredList.length])

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

  const searchByText = (item: IPractice) => {
    const itemLine = `${item.name} ${item.address}`;
    return itemLine.toLowerCase().includes(searchTerm.toLowerCase())
  }

  const onSearchSelect = async (postcode: string) => {
    const postcodeSearchResponse = await fetch(
      `https://postcodes.io/outcodes/${postcode.split(" ")[0]}/nearest`
    );
    const postcodeData = await postcodeSearchResponse.json();
    const postCodes: string[] = postcodeData.result.map((pd: any) => pd.outcode.toLowerCase());
    const foundPractices = filteredList.filter(x => {
      const outcode = x.postcode?.toLowerCase().split(" ")[0];
      return postCodes.some(code => outcode.startsWith(code.toLowerCase()));
    }).slice(0,20);
    const response = await fetch(
      `https://golden-smiles-be-fayfdhfvsa-uc.a.run.app/find-placeid?postcode=${postcode}` 
    );
    const x = await response.json();
    try {
      const distanceMatrixResponse = await fetch(
        `https://golden-smiles-be-fayfdhfvsa-uc.a.run.app/calculate-distance`,
        {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            placeId: x.placeId,
            practices: foundPractices.map(x => x.address).join("|")
          }),
        }
        );
        const response = await distanceMatrixResponse.json();
        const newList = filteredList.map(x => {
            const item = response.data.find(d => {
              return String(d.address).toLowerCase().includes(x.postcode.toLowerCase())
            })
            x.data = item?.distance_data;
            x.isVisible = item?.distance_data ? true : false;
            return x;
        })
        console.log(newList)
        setFilteredList([...newList])
      } catch (e) {
        console.log(e)
    }
  }

  const handleFilterClick = () => {
    let copy = !sidebarOpen;
    setSidebarOpen(copy)
  }

  const filterByRating = (rating: string) => {
    setRatingsFilter(ratingsFilter.map(x => {
      x.selected = x.rating === rating;
      return x;
    }))
  }

  const sortByDate = (type: string) => {
    // setSortOptions(sortOptions.map(x => {
    //   x.selected = x.type === type;
    //   return x;
    // }))
  }

  const filterByTreatment = (event: any) => {
    const treatment = event.target.value;
    // setTreatmentFilter(treatmentFilter.map(x => {
    //   x.selected = x.treatment === treatment;
    //   return x;
    // }))
  }

  return (
    <Layout>
      {sidebarOpen && <BlackBg onClick={handleFilterClick} />}
      <StyledHeading> Reviews </StyledHeading>
      <FilterButton onClick={handleFilterClick}>Filter</FilterButton>
      <Searchbar handlePostcodeSearch={(outcode) => onSearchSelect(outcode)} />
      {/* <small>Showing {practiceData.length} of {practiceData.length} Practices</small> */}
      <Wrapper>
        <Practices>
          {
            filteredList.filter(x => x.isVisible).sort((a, b) => a.data?.distance?.text?.split(" ")[0] - b.data?.distance?.text?.split(" ")[0]).map(item => 
            <Practice key={item.placeId}>
                <DistanceRatingWrapper>
                  <div>
                    {
                      item.reviews === 0 ? "No reviews" :
                      <ReviewRatingWrapper>
                        <StarRating rating={item.rating}/>
                        - based on {+item.reviews} reviews
                      </ReviewRatingWrapper>
                    }
                  </div>
                  {
                    item.data &&
                    <small>{item.data?.distance?.text} away</small>
                  }
                </DistanceRatingWrapper>
                <Link to={"/practices/" + item.name.split(" ").join("-").toLowerCase()}>
                  <h3>{item.name}</h3> <span>{item.address}</span>
                </Link>
                <ReviewHR />
                <PracticeFooter>
                  <LeaveAReview target="_blank" href="https://bu9ylzbcyhu.typeform.com/to/ehW2GX7Y">
                    leave a review
                    <Chevron />
                  </LeaveAReview>
                  <a href={item.website} target="_blank">
                    <Globe />
                  </a>
                </PracticeFooter>
            </Practice>)
          }
        </Practices>
        
        <Sidebar className={sidebarOpen ? "open" : ""}>
           <SidebarSection>
             <h3>Sort by Date</h3>
             <SortOptionsWrapper>
               {/* {sortOptions.map((x) => (
                <FilterOption
                  key={x.type}
                  className={x.selected ? "active" : ""}
                  onClick={() => sortByDate(x.type)}
                >
                  {x.type}
                </FilterOption>
              ))} */}
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
            {/* <Dropdown name="treatment" id="treatment" onChange={filterByTreatment}>
              {treatmentFilter.map((x, i) => (
                <option key={i}>{x.treatment}</option>
              ))}
            </Dropdown> */}
          </SidebarSection>
        </Sidebar>
      </Wrapper>
    </Layout>
  );
}

export const query = graphql`
  query GetPractices {
    allPracticesV3Json {
      edges {
        node {
          name
          placeId
          website
          status
          address
          phone
          postcode
          isVisible
          rating
          reviews
          reviewsUrl
          longitude
          latitude
        }
      }
    }
  }
`

const ReviewRatingWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

const DistanceRatingWrapper = styled.aside`
  display: flex;
  margin: 3px 0 10px; 
  justify-content: space-between;
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
  flex-direction: column;
  flex-wrap: wrap;
  gap: 20px;
`

const Practice = styled.li`
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


const SidebarSection = styled.div`
  h3 {
    margin-bottom: 5px;
  }
  margin-bottom: 20px;
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

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
