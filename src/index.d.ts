export interface Tag {
  slug: string;
  name: string;
}

export interface PublishPostInput {
  title: string;
  publicationId: string;
  tags: Tag[];
  contentMarkdown: string;
}

export interface PublicationResponse {
  data: {
    me: {
      id: string;
      publications: {
        edges: Array<{
          node: {
            id: string;
          };
        }>;
        totalDocuments: number;
      };
    };
  };
}

export interface PublishPostResponse {
  data: {
    publishPost: {
      post: {
        id: string;
        slug: string;
        title: string;
        subtitle: string;
        author: {
          username: string;
        };
        tags: {
          name: string;
        }[];
        url: string;
        readTimeInMinutes: number;
        views: number;
        publishedAt: string;
        updatedAt: string;
      };
    };
  };
}
