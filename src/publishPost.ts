import { getInput, setFailed } from "@actions/core";
import { PublishPostInput, PublishPostResponse } from "./index.d";

async function publishPost(
  input: PublishPostInput
): Promise<PublishPostResponse | null> {
  const graphqlEndpoint = "https://gql.hashnode.com";
  const authToken = getInput("HASHNODE_PAT");

  const mutation = `
      mutation PublishPost($input: PublishPostInput!) {
        publishPost(input: $input) {
          post {
            id
            slug
            title
            subtitle
            author {
              username
            }
            tags {
              name
            }
            url
            readTimeInMinutes
            views
            publishedAt
            updatedAt
          }
        }
      }
    `;

  const variables = {
    input: input,
  };

  try {
    const response = await fetch(graphqlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify({
        query: mutation,
        variables: variables,
      }),
    });

    const result = await response.json();

    return result as PublishPostResponse;
  } catch (error) {
    console.error("Error publishing post:", error);
    return null;
  }
}

export async function publishPostHandler(
  input: PublishPostInput
): Promise<PublishPostResponse | null> {
  const response = await publishPost(input);

  if (response) {
    const postUrl = response.data.publishPost.post.url;
    console.log("Post published:", postUrl);
    return response;
  } else {
    console.error("Failed to publish post.");
    setFailed("Failed to publish post.");
    return null;
  }
}
