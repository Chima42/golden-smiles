const path = require("path");

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions
  const typeDefs = [
    schema.buildObjectType({
      name: 'PracticesJson',
      fields: {
        name: 'String!',
        jsonId: 'String!',
        address: 'String!' 
      },
      interfaces: ['Node'],
      extensions: {
        infer: false,
      },
    })
  ]
  createTypes(typeDefs)
}

exports.createPages = async ({ graphql, actions }) => {
  const { data } = await graphql(`
    query GetPractices {
      allPracticesJson {
        edges {
          node {
            jsonId
            name
            address
          }
        }
      }
    }
  `) 

  const practices = data.allPracticesJson.edges;
  practices.forEach(node => {
    // quick fix to remove top level object node
    const practice = JSON.parse(JSON.stringify(node));
    actions.createPage({
      path: '/practices/' + practice.node.name.split(" ").join("-").toLowerCase(),
      component: path.resolve("./src/templates/practice-page.tsx"),
      context: {
        name: practice.node.name,
        id: practice.node.jsonId,
        address: practice.node.address,
      }
    })
  })
}