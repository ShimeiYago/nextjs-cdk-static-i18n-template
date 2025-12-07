# Next.js CDK Static i18n Template

Template repository for a static Next.js app deployed to AWS (S3 + CloudFront via CDK).  
Build the frontend, run deployment command, and you’ll get a multi-language static site served over CloudFront.

## Setup

- Run `npm install` at the repo root to install the workspace dependencies.

## Development

- Start the frontend dev server with `npm run dev:front` (Next.js runs inside `front/`).
- Scaffold UI components via `npm run shadcn:add -- button` (replace `button` with any supported components name).
