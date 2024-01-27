import { getInput, setFailed } from "@actions/core";
import { PublicationResponse } from "./index.d";

async function fetchPublications(): Promise<PublicationResponse | null> {
  const graphqlEndpoint = "https://gql.hashnode.com";
  const authToken = getInput("HASHNODE_PAT");

  if (!authToken) {
    console.error("No Hashnode Personal Access Token provided.");
    setFailed("No Hashnode Personal Access Token provided.");
    return null;
  }

  const query = `
            query Me {
                me {
                    id
                    publications(first: 1, filter: { roles: OWNER }) {
                        edges {
                            node {
                                id
                            }
                        }
                        totalDocuments
                    }
                }
            }
        `;

  try {
    const response = await fetch(graphqlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    return result as PublicationResponse;
  } catch (error) {
    console.error("Error fetching publications:", error);
    return null;
  }
}

export async function getPublicationsID() {
  const response = await fetchPublications();

  if (response) {
    const publicationId = response.data.me.publications.edges[0]?.node.id;
    if (publicationId) {
      return publicationId;
    }
  } else {
    setFailed("No publications found. Please create a publication first.");
  }
}
