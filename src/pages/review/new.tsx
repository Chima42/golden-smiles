import React, { useEffect, useState } from "react"
import { HeadFC, PageProps, graphql, Link } from "gatsby"
import styled from "styled-components"
import Layout from "../../components/Layout"

interface IDropdown {
  name: string;
  id: string;
  selected: boolean;
}

const New: React.FC<PageProps> = ({ data }: any) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentFormStep, setCurrentFormStep] = useState(0);
  const [dropdownOptions, setDropdownOptions] = useState<IDropdown[]>(data.allPracticesV3Json.edges.map((x) => ({
    name: x.node.name,
    id: x.node.placeId,
    selected: false
  })));
  const selectedPractice = dropdownOptions.find(option => option.selected);
  const totalFormSteps = 7;
  const progressBarWidth = 100 / totalFormSteps * currentFormStep;
  
  const handleDropdownSelect = (event: any) => {
    setDropdownOptions(dropdownOptions.map(x => {
      x.selected = String(event.target.value) === x.id
      return x;
    }))
  }

  const handleChangePractice = () => {
    setDropdownOptions(dropdownOptions.map(x => {
      x.selected = false
      return x;
    }))
  }

  const showCurrentFormStep = () => {
    let step;
    switch (currentFormStep) {
      case 0:
        step = <section>
          <h2>Hello, what's your name?</h2>
          <input />
          <button onClick={handleNextSelect}>Next</button>
        </section>
        break;
      case 1:
        step = <section>
          <h2>Which dentist did you visit?</h2>
          <input />
          <button onClick={handleNextSelect}>Next</button>
        </section>
        break;
      case 2:
        step = <section>
          <h2>Give your review a title</h2>
          <input />
          <button onClick={handleNextSelect}>Next</button>
        </section>
        break;
      case 3:
        step = <section>
          <h2>How was your visit to the dentist you went to?</h2>
          <textarea name="dentistVisit" id="dentistVisit" cols={30} rows={10}></textarea>
          <button onClick={handleNextSelect}>Next</button>
        </section>
        break;
      case 4:
        step = <section>
          <h2>What rating would you give it out of 5?</h2>
          <input />
          <button onClick={handleNextSelect}>Next</button>
        </section>
        break;
      case 5:
        step = <section>
          <h2>What operation/ procedure did you go in for?</h2>
          <input />
          <button onClick={handleNextSelect}>Next</button>
        </section>
        break;
      case 6:
        step = <section>
          <h2>What was the name of the consultant you saw?</h2>
          <input />
          <button onClick={handleNextSelect}>Next</button>
        </section>
        break;
      case 7:
        step = <section>
          <h2>Thanks [NAME], what's your email?</h2>
          <input />
          <button>Submit</button>
        </section>
        break;
      case 8:
        step = <section>
          <h2>Thanks [NAME], what's your email?</h2>
          <input />
          <button>Submit</button>
        </section>
        break;
    
      default:
        break;
    }
    return step;
  }

  const handleNextSelect = (event: any) => {
    event.preventDefault();
    setCurrentFormStep(prev => prev + 1)
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
  }


  return (
    <Layout>
      <StyledHeading> 
        New Review
        {
          selectedPractice?.name ?
          <SelectedNameWrapper onClick={handleChangePractice}>
            <span>for {selectedPractice?.name}</span>
            <button>change</button>
          </SelectedNameWrapper> :
          <select name="practices" id="practices" onChange={handleDropdownSelect}>
            <option key={-1} value={""} defaultChecked>Select practice</option>
            {
              dropdownOptions.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))
            }
          </select>
        }
      </StyledHeading>
      <FormWrapper>
      <ProgressBar width={progressBarWidth}/>
        <form onSubmit={handleSubmit}>
          {showCurrentFormStep()}
        </form>
      </FormWrapper>
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
        }
      }
    }
  }
`

const SelectedNameWrapper = styled.div`
  display: flex;
  gap: 2px;
  justify-content: center;
  cursor: pointer;
  flex-direction: column;
  button {
    background: none;
    cursor: inherit;
    text-decoration: underline;
    border: none;
    border-radius: 6px;
    padding: 0;
    font-weight: 600;
    color: var(--purple);
    &:hover {
      opacity: 0.8;
    }
  }
`

const ProgressBar = styled.div<{width: number}>`
  padding: 2px 0;
  background: var(--purple);
  border-radius: 15px;
  transition: width 0.5s ease-in-out;
  width: ${({width}) => width}%;
  margin-bottom: 20px;
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
  span {
    display: block;
    font-weight: 400;
    font-size: 26px;
  }
  select {
    display: block;
    margin: 0 auto;
  }
`

const FormWrapper = styled.main`
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);

`

export default New

export const Head: HeadFC = () => <title>Rated Smiles - New Review</title>
