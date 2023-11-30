import * as React from "react";
import { PageProps } from "gatsby";
import styled from "styled-components";

interface ISearchbar {
  handlePostcodeSearch: (searchTerm: string) => void
}

const Searchbar: React.FC<ISearchbar> = ({handlePostcodeSearch}) => {
  const [postcode, setPostcode] = React.useState("");

  const onSearchSelect = async (event: any) => {
    event.preventDefault();
    handlePostcodeSearch(postcode)
  }
  
  return (
    <SearchBarWrapper>
      <Search
        onChange={(e) => setPostcode(e.target.value)}
        placeholder="Search by postcode, eg N16 9EX"
      />
      <button onClick={onSearchSelect}>search</button>
    </SearchBarWrapper>
  );
};

export default Searchbar;

const SearchBarWrapper = styled.section`
  display: flex;
  gap: 5px;
  button {
    background: var(--purple);
    border: none;
    border-radius: 3px;
    padding: 0 30px;
    font-weight: 600;
    color: #fff;
    font-size: 17px;
    cursor: pointer;
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Search = styled.input`
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
`;
