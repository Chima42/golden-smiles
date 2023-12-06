import React, { useEffect, useState } from "react"
import { HeadFC, PageProps, graphql, Link } from "gatsby"
import styled from "styled-components"
import Chevron from "../images/right-arrow.svg"
import Globe from "../images/globe.svg"
import practices from "../data/practicesV3.json";
import Layout from "../components/Layout"
import Searchbar from "../components/Searchbar"
import StarRating from "../components/StarRating"
import { BlackBg, FilterOption, RatingsFilterWrapper, Sidebar, Wrapper } from "../components/Shared";

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
  const [practiceList, setPracticeList] = useState((practices as IPractice[]));
  const [searchTerm, setSearchTerm] = useState("");
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
    setPagination((prevState) => {
      return {
        ...prevState,
        pageCount: prevState.data.length / prevState.numberPerPage,
        currentData: prevState.data.slice(pagination.offset, pagination.offset + pagination.numberPerPage)
      }
    })
  }, [pagination.numberPerPage, pagination.offset])

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

  const filterPracticeList = () => {
    setPracticeList([...(practices as IPractice[])
    .filter((item: IPractice) => {
      return Object.entries(activeFilters()).every(([k, v]) => {
        if(k === "rating") {
          return +item.rating > Number(v)
        } else {
          return (item as any)[k] === v
        }
      })
    })])
  }

  const onSearchSelect = async (postcode: string) => {
    const postcodeSearchResponse = await fetch(
      `https://postcodes.io/outcodes/${postcode.split(" ")[0]}/nearest`
    );
    const postcodeData = await postcodeSearchResponse.json();
    const postCodes: string[] = postcodeData.result.map((pd: any) => pd.outcode.toLowerCase());
    const foundPractices = practiceList.filter(x => {
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
        setPracticeList(
          practiceList.map(x => {
            const item = response.data.find(d => {
              return String(d.address).toLowerCase().includes(x.postcode.toLowerCase())
            })
            x.data = item?.distance_data;
            x.isVisible = item?.distance_data ? true : false;
            return x;
          })
        )
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
    filterPracticeList();
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
            practiceList.filter(x => x.isVisible).sort((a, b) => a.data?.distance?.text?.split(" ")[0] - b.data?.distance?.text?.split(" ")[0]).map(item => 
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
            <h3>Filter by Rating</h3>
            <RatingsFilterWrapper>
              {ratingsFilter.map((x) => (
                <FilterOption
                  key={x.rating}
                  className={x.selected ? "active" : ""}
                  onClick={() => filterByRating(x.rating)}
                >
                  {x.rating}{x.rating !== "All" ? "+" : ""}
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

export default IndexPage

export const Head: HeadFC = () => <title>Rated Smiles</title>
