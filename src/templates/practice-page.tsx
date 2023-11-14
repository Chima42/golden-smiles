import React from "react"

const PracticePage = (props: any) => {
  const { pageContext } = props;

  return <h1>{pageContext.name}</h1>
}

export default PracticePage