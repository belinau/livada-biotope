# Livada Biotope Restructuring Plan
*Last Updated: 2024-05-19*

## 📌 Overview
This document outlines the plan for restructuring the Livada Biotope Next.js application to improve maintainability, add Slovenian and English (UK) i18n support, and implement a feature-based architecture.

## 🏗️ Directory Structure

### New Structure
```
src/
├── app/                    # App Router
│   └── [locale]/           # i18n routes
│       ├── (main)/         # Main layout group
│       │   ├── gallery/    # Gallery section
│       │   ├── biodiversity/
│       │   └── page.tsx    # Home page
│       └── layout.tsx      # Root layout
├── features/               # Feature modules
│   ├── gallery/           # Gallery feature
│   │   ├── components/    # Feature components
│   │   ├── hooks/         # Feature hooks
│   │   └── types.ts       # Feature types
│   └── biodiversity/      # Biodiversity feature
│       ├── components/
│       └── api/
├── components/            # Shared components
│   └── ui/                # Base UI components
├── lib/                   # Utilities
│   ├── i18n/             # i18n config
│   └── api/              # API clients
└── public/
    └── locales/           # Translation files
        ├── sl/           # Slovenian
        └── en-GB/        # English (UK)
```

## 🔄 Key Changes

### 1. i18n Implementation
- **Default Locale**: Slovenian (`sl`)
- **Supported Locales**:
  - `sl` (Slovenian)
  - `en-GB` (English UK)
- **Translation Files**:
  - `/public/locales/sl/common.json`
  - `/public/locales/en-GB/common.json`

### 2. Component Organization
- **Feature-based Architecture**:
  - Each feature has its own directory
  - Contains components, hooks, and types
- **Shared UI**:
  - Reusable components in `/components/ui`
  - Follows Atomic Design principles

### 3. File Moves
| Current Location | New Location |
|-----------------|-------------|
| `components/gallery/` | `features/gallery/components/` |
| `components/biodiversity/` | `features/biodiversity/components/` |
| `i18n/` | `lib/i18n/` |
| Translation files | `public/locales/{locale}/` |

## 🚀 Implementation Plan

### Phase 1: Preparation (1h)
- [ ] Create backup branch
  ```bash
  git checkout -b feature/restructure-i18n
  git tag backup-pre-restructure
  ```
- [ ] Set up new directory structure
- [ ] Move translation files

### Phase 2: Core Updates (2h)
- [ ] Update i18n configuration
- [ ] Modify middleware for locale handling
- [ ] Update layout files
- [ ] Configure TypeScript paths

### Phase 3: Component Migration (3h)
- [ ] Move gallery components
- [ ] Move biodiversity components
- [ ] Update all imports
- [ ] Fix TypeScript errors
- [ ] Update tests

### Phase 4: Testing (2h)
- [ ] Unit tests
- [ ] i18n testing
- [ ] Visual regression testing
- [ ] Cross-browser testing

## ✅ Verification Checklist

### Functionality
- [ ] All pages load correctly
- [ ] Language switching works
- [ ] Forms submit correctly
- [ ] Dynamic routes work

### i18n
- [ ] All text is translated
- [ ] Date/number formatting
- [ ] RTL support (if needed)

### Performance
- [ ] Images optimized
- [ ] Bundle size within limits
- [ ] LCP, FID, CLS scores

### Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Test coverage ≥80%

## 🔙 Rollback Plan

1. **Before Starting**
   ```bash
   git checkout -b backup-pre-restructure
   git push origin backup-pre-restructure
   ```

2. **If Issues Arise**
   ```bash
   git checkout main
   git branch -D feature/restructure-i18n
   git checkout backup-pre-restructure
   ```

3. **After Successful Deployment**
   ```bash
   # Keep backup branch for 1 week
   git tag -d backup-pre-restructure
   git push --delete origin backup-pre-restructure
   ```

## 📝 Notes
- All new components must follow the established patterns
- Document any deviations from this plan
- Update this document as needed
