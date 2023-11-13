const path = require("path");

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions
  const typeDefs = [
    schema.buildObjectType({
      name: 'PracticesJson',
      fields: {
        name: 'String!',
        jsonId: 'Int!',
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
    query Practices {
      allPracticesJson {
        edges {
          node {
            jsonId
          }
        }
      }
    }
  `) 

  data.allPracticesJson.edges.forEach(node => {
    actions.createPage({
      path: '/practices/' + node.name,
      component: path.resolve("./src/templates/practice-page.tsx"),
      context: {
        slug: node.name,
      }
    })
  })
}