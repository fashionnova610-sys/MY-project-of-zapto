# Anti-Gravity -> Netlify Deployment Skill

Use this guide as a practical checklist and prompt pack to finish a website built in Google Antigravity and deploy it cleanly to Netlify.

---

## Goal

Take an Antigravity-built site from:
- working locally / in editor
- to cleaned up
- production-ready
- deployed on Netlify
- easy to update later

---

## Recommended order

1. Audit the project
2. Clean the codebase
3. Confirm the framework and build output
4. Fix environment variables and secrets
5. Run a production build locally
6. Test the built version
7. Deploy to Netlify
8. Verify forms, links, mobile, and SEO basics
9. Connect domain if needed
10. Set up future update workflow

---

## Step 1: Identify what kind of project you have

Before doing anything else, confirm the stack.

Common Antigravity outputs:
- Static HTML/CSS/JS site
- Vite app
- React app
- Next.js app

### Quick checks

Look for these files:
- `package.json`
- `vite.config.js` or `vite.config.ts`
- `next.config.js` or `next.config.ts`
- `src/`
- `public/`
- `dist/`
- `out/`
- `build/`

### What publish folder usually means

- Vite -> `dist`
- Create React App -> `build`
- Next.js static export -> `out`
- Plain HTML site -> project root or folder containing `index.html`

---

## Step 2: Clean the codebase before deployment

### Remove
- unused components
- dead images/assets
- placeholder sections
- duplicate CSS files
- console logs
- commented-out blocks you no longer need
- test/demo content
- fake API keys

### Standardize
- rename files clearly
- keep one obvious component/page structure
- make import paths consistent
- remove broken links and orphan pages

### Folder structure target

```text
project/
  public/
  src/
    components/
    pages/
    assets/
    styles/
  package.json
  README.md
```

### Prompt for Antigravity

```text
Audit this codebase for production readiness. Remove dead code, duplicate files, unused assets, placeholder content, console logs, and commented-out code. Then reorganize the project into a clean, maintainable structure without changing the design or behavior.
```

---

## Step 3: Lock formatting and linting

If your project uses Node tooling, add formatting and linting.

### Prompt for Antigravity

```text
Set up a basic production-quality code standard for this project. Add formatting and linting where appropriate, fix the current issues safely, and do not change the visual design.
```

### Typical scripts to aim for in `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

Adjust for your framework.

---

## Step 4: Protect secrets and config

Never deploy secrets inside source files.

### Check for
- API keys in JS/TS files
- tokens in frontend code
- private URLs hardcoded in components
- test credentials committed into the repo

### Move secrets into environment variables

Examples:
- `VITE_API_URL` for Vite
- `NEXT_PUBLIC_API_URL` for public Next.js client variables
- server-only secrets must not be exposed to the browser

### Prompt for Antigravity

```text
Scan this project for hardcoded secrets, API keys, tokens, private endpoints, and unsafe config. Move anything sensitive into environment variables and tell me exactly which variables I must add in Netlify.
```

---

## Step 5: Make sure the project can build for production

Run the build locally in Antigravity terminal.

```bash
npm install
npm run build
```

If there is no build script, inspect `package.json` and create the right one.

### Build success means
- no fatal errors
- output folder is generated
- assets resolve correctly

---

## Step 6: Framework-specific deployment rules

## A. If it is a Vite app

### Netlify settings
- Build command: `npm run build`
- Publish directory: `dist`

### Prompt for Antigravity

```text
Confirm this project is production-ready for Netlify as a Vite app. Verify the build script, output folder, asset paths, and routing behavior.
```

---

## B. If it is a Create React App project

### Netlify settings
- Build command: `npm run build`
- Publish directory: `build`

If routes break on refresh, add a redirect file.

Create `public/_redirects`:

```text
/* /index.html 200
```

---

## C. If it is a Next.js site and you want static hosting on Netlify

Use static export.

### In `next.config.js`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

### Netlify settings
- Build command: `npm run build`
- Publish directory: `out`

### Important
This works best for static-compatible sites. If your project depends on server-side rendering, server actions, or dynamic server features, confirm Netlify support or adapt the architecture before deployment.

### Prompt for Antigravity

```text
Prepare this Next.js project for static deployment on Netlify. Configure static export, make image handling compatible, confirm the publish folder, and fix anything that would break in a fully static deploy.
```

---

## D. If it is plain HTML/CSS/JS

You may not need a build step.

### Netlify settings
- Build command: leave blank if no build is needed
- Publish directory: the folder containing `index.html`

If everything is already in the root:
- drag and drop manually, or
- connect the repo and publish root

---

## Step 7: Test the production output before deploying

After building, test the actual built version.

### Check
- homepage loads
- all images load
- navigation works
- mobile layout works
- CTA buttons work
- forms work
- no broken links
- no console errors

### Prompt for Antigravity

```text
Review the production build output for deploy readiness. Check for broken asset paths, missing images, routing issues, layout shifts, mobile problems, and console errors. Fix only what is necessary for a clean production deploy.
```

---

## Step 8: Deploy to Netlify

You have two main options.

## Option 1: Manual deploy

Best if you just want the site live quickly.

### Steps
1. Run the production build
2. Locate the output folder
   - `dist`, `build`, or `out`
3. Go to Netlify dashboard
4. Choose **Add new site** or **Deploy manually**
5. Drag and drop the output folder
6. Wait for deploy
7. Open the generated `*.netlify.app` URL

---

## Option 2: Git-based deploy

Best if you want easy future updates.

### Steps
1. Push the project to GitHub
2. In Netlify, choose **Import from Git**
3. Select the repository
4. Set build command and publish directory
5. Add environment variables in Netlify
6. Deploy

### Why this is better
- every push can redeploy the site
- easier rollback
- cleaner update workflow
- preview deploys for changes

---

## Step 9: Add environment variables in Netlify

In Netlify:
- open your site
- go to site configuration / environment variables
- add each required variable
- redeploy after saving

### Prompt for Antigravity

```text
List every environment variable this project needs for production deployment on Netlify. Separate public frontend variables from private secrets and explain where each one should live.
```

---

## Step 10: Add routing support if needed

If you have a single-page app and refreshing a route gives a 404 on Netlify, add a `_redirects` file.

### `public/_redirects`

```text
/* /index.html 200
```

For some setups, place `_redirects` in the published output or copy it during build.

### Prompt for Antigravity

```text
Make sure client-side routing works correctly on Netlify for this app. Add the correct redirect handling for production and verify refreshes on nested routes do not 404.
```

---

## Step 11: Do a final launch check

### Content
- remove lorem ipsum
- fix grammar and spelling
- confirm brand name consistency
- verify phone, email, WhatsApp, socials, and links

### Visual
- check spacing on mobile
- verify logo clarity
- compress oversized images
- ensure text contrast is readable

### Technical
- title tag on each key page
- meta description
- favicon
- social preview image
- form destination works
- no secret keys exposed

---

## Step 12: Connect a custom domain

In Netlify:
1. go to domain management
2. add custom domain
3. follow DNS instructions
4. wait for verification
5. confirm HTTPS is active

---

## Step 13: Set up a maintainable update workflow

### Best practice
- keep the code in GitHub
- use Netlify Git deploys
- make edits in Antigravity
- commit and push updates
- let Netlify redeploy automatically

### Prompt for Antigravity

```text
Prepare this project for an easy long-term maintenance workflow with GitHub and Netlify. Make sure future edits can be deployed safely without breaking production.
```

---

## Netlify settings cheat sheet

## Vite
- Build command: `npm run build`
- Publish directory: `dist`

## Create React App
- Build command: `npm run build`
- Publish directory: `build`

## Next.js static export
- Build command: `npm run build`
- Publish directory: `out`

## Plain static site
- Build command: blank or not needed
- Publish directory: folder with `index.html`

---

## Best prompt to give Antigravity right now

```text
I am finishing this website for production deployment on Netlify. First, audit the project and identify the framework, build command, publish directory, environment variables, routing needs, and any deployment blockers. Then clean the codebase for production, remove dead code and placeholders, protect secrets, fix asset and routing issues, and make sure the site builds successfully for Netlify without changing the design.
```

---

## Second prompt after the audit

```text
Now implement all required fixes for a production-ready Netlify deployment. Then give me:
1. the exact Netlify build command
2. the exact publish directory
3. any environment variables I must add
4. any files I need such as _redirects or netlify.toml
5. a final deployment checklist
```

---

## Optional `netlify.toml` starter

Use only if your project benefits from explicit config.

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

Change `dist` to `build` or `out` if needed.

---

## Common problems and fixes

## Problem: Build fails
### Fix
- confirm correct Node scripts in `package.json`
- run `npm install`
- inspect missing packages
- fix framework-specific config

## Problem: Images missing after deploy
### Fix
- move assets into `public/` if needed
- use correct paths
- for Next static export use `images.unoptimized = true`

## Problem: Routes 404 on refresh
### Fix
- add `_redirects` for SPA routing

## Problem: Site works locally but not on Netlify
### Fix
- compare local build output vs deployed output
- check environment variables
- check absolute vs relative asset paths

## Problem: Secret key visible in frontend
### Fix
- remove it from client code immediately
- rotate the key
- move secure logic server-side if needed

---

## Final deployment checklist

- [ ] project framework identified
- [ ] codebase cleaned
- [ ] dead code removed
- [ ] secrets removed from source
- [ ] environment variables documented
- [ ] production build runs successfully
- [ ] output folder confirmed
- [ ] routing tested
- [ ] images and assets load correctly
- [ ] mobile layout checked
- [ ] forms and CTA buttons tested
- [ ] Netlify deploy completed
- [ ] live URL verified
- [ ] custom domain connected if needed

---

## Fastest path if you just want to ship today

1. Ask Antigravity to audit the project using the main prompt above
2. Run `npm run build`
3. Find `dist`, `build`, or `out`
4. Drag that folder into Netlify manual deploy
5. Test the live URL
6. Fix issues
7. Then connect GitHub for easier future updates

