import fs from "fs";
import path from "path";

import matter from "gray-matter";
import { getInput, setFailed } from "@actions/core";

import { PublishPostInput, Tag } from "./index.d";

import { publishPostHandler } from "./publishPost";
import { getPublicationsID } from "./getPublicationsID";
import { exit } from "process";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function run() {
  const publicationsID = await getPublicationsID();

  if (!publicationsID) {
    console.error("No publications ID found.");
    setFailed("No publications ID found.");
    return;
  }

  const blogFolderName = getInput("src") || "blogs";
  const blogFolderPath = path.join(__dirname, "..", blogFolderName);

  if (!fs.existsSync(blogFolderPath)) {
    console.error("No blogs folder found.");
    setFailed("No blogs folder found.");
    return;
  }

  const files = fs.readdirSync(blogFolderPath);

  const blogPosts: PublishPostInput[] = [];

  files.forEach((file) => {
    if (file.endsWith(".md")) {
      const filePath = path.join(blogFolderPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");

      const { data, content } = matter(fileContent);

      if (data.status === "PUBLISHED") {
        return;
      }

      const tags: Tag[] = [];
      data.tags.forEach((tag: string) => {
        tags.push({
          slug: slugify(tag),
          name: tag,
        });
      });

      const blogPost: PublishPostInput = {
        title: data.title,
        tags: tags,
        publicationId: publicationsID,
        contentMarkdown: content,
      };

      blogPosts.push(blogPost);

      const newData = {
        ...data,
        status: "PUBLISHED",
      };

      const updatedFileContent = matter.stringify(content, newData);
      fs.writeFileSync(filePath, updatedFileContent, "utf-8");
    }
  });

  if (blogPosts.length === 0) {
    console.log("No blog posts to publish.");
    exit(0);
  }

  for (const blogPost of blogPosts) {
    await publishPostHandler(blogPost);
  }
}

run();
