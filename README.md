# Publish to Hashnode - GitHub Action ![GitHub Release](https://img.shields.io/github/v/release/PritishMishraa/hashnode-publish-action)

## Description
This GitHub Action automates the process of publishing a blog post to Hashnode. It is designed to simplify and streamline the workflow of publishing content on the Hashnode platform.

```yaml
name: Publish to Hashnode

on:
  push:
    branches:
      - master
    paths:
      - 'blogs/**'
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm install
      - name: Publish to Hashnode
        uses: PritishMishraa/hashnode-publish-action@v1.0.1
        with:
          src: blogs
          HASHNODE_PAT: ${{ secrets.HASHNODE_PAT }}
      - name: (AUTO COMMIT) Update Status to Published
        uses: mikeal/publish-to-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      # ... add more steps as needed
```
This will trigger a deployment for every commit to blog folder in master. If you'd like to change the "on" or "path" event, see the [GitHub action documentation](https://help.github.com/en/github/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#on), which shows how to build on Pull Requests, Releases, Tags and more.

## Configuration

### For GitHub Action
The `with` portion of the workflow **must** be configured before the action will work. Any `secrets` must be referenced using the bracket syntax and stored in the GitHub repositories `Settings/Security/Secrets and variables/Actions` menu. You can learn more about setting environment variables with GitHub actions [here](https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstepsenv).

| Key  | Value Information | Default | Type | Required |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| `HASHNODE_PAT`  | The Hashnode Personal Access Token. Get it [Here](https://hashnode.com/settings/developer). | - |`secrets` | **Yes** |
| `src` | The path to the blog post. | blogs | `string` | NO |

### For markdown files
Each markdown file should atleast containt `title` and `tags` in the front-matter (_mandatory for hashnode_). 
```md
---

title: Deploying Next Apps
tags:
  - Next.js
  - Deployment
  - Coding

---

Content...
```  
### Happy blogging!
This action is intended to make your publishing workflow to Hashnode more efficient and straightforward. If you encounter any issues or have suggestions for improvements, feel free to open an issue or contribute to the development. Happy blogging!
