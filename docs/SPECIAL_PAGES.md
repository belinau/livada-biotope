# Special Pages Handling

## "Let's Not Dry Out The Future" Page

### Location
- Source: `/src/pages/projects/lets-not-dry-out-the-future.tsx`
- Route: `/projects/lets-not-dry-out-the-future`

### Special Handling

1. **Exclusion from Dynamic Routes**
   - The page is excluded from the dynamic project routes in `[slug].tsx`
   - This is done by checking for the slug 'lets-not-dry-out-the-future' in `getStaticPaths` and `getStaticProps`

2. **Custom Implementation**
   - This page has a custom implementation with interactive elements
   - It's not generated from markdown like other project pages

3. **Related Projects**
   - The page is excluded from the "Related Projects" section on other project pages

### Maintenance
- Any changes to this page should be made directly in its component file
- The page should not be removed from the exclusions in `[slug].tsx` without updating the routing logic

## Other Special Pages

### Documentation
- Source: `/src/pages/documentation.tsx`
- Route: `/documentation`
- Redirects to `/docs/`
- This is a client-side redirect that happens in the browser

### Admin Pages
- Located in `/src/pages/admin/`
- Protected routes for content management
- Use server-side authentication

### API Routes
- Located in `/src/pages/api/`
- Serverless functions for backend functionality
- Protected with appropriate authentication middleware
