# Automated Versioning Guide

## How It Works Now 🎉

**You don't need to manually update versions anymore!** When you merge a PR to `main`, the version automatically bumps based on your PR.

## Automatic Version Bumping

### Using PR Labels (Recommended)

Add one of these labels to your PR before merging:

- 🔴 **`major`** - Breaking changes (6.0.0 → 7.0.0)
  - Example: Complete redesign, removing features, major API changes
  
- 🟡 **`minor`** - New features (6.0.0 → 6.1.0)
  - Example: New tab, schedule sessions, offline mode
  
- 🟢 **`patch`** - Bug fixes (6.0.0 → 6.0.1)
  - Example: Fix crash, fix typo, small improvements

### Using PR Title (Alternative)

If you forget labels, the system checks your PR title:

- Starts with `feat:` or `feature:` → **minor** bump (6.0.0 → 6.1.0)
- Starts with `break:` or `breaking:` → **major** bump (6.0.0 → 7.0.0)
- Anything else → **patch** bump (6.0.0 → 6.0.1)

## Examples

### Example 1: Adding a new feature
```
PR Title: "feat: add church streaming feature"
Label: minor
Result: 6.0.0 → 6.1.0 ✅
```

### Example 2: Fixing a bug
```
PR Title: "fix: resolve crash on Bible tab"
Label: patch
Result: 6.0.0 → 6.0.1 ✅
```

### Example 3: Breaking change
```
PR Title: "breaking: redesign entire app"
Label: major
Result: 6.0.0 → 7.0.0 ✅
```

## What Happens Automatically

When you merge a PR to `main`:

1. ✅ **Version Auto-Bumps** based on label/title
2. ✅ **app.json Updated** automatically
3. ✅ **Git Tag Created** (e.g., v6.1.0)
4. ✅ **CI/CD Triggers** with correct version
5. ✅ **Build Number Auto-Increments** (handled by EAS)
6. ✅ **Submits to App Store** and Google Play

## Workflow

```bash
# 1. Create feature branch
git checkout -b my-new-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add my feature"

# 3. Push and create PR
git push origin my-new-feature

# 4. Add label to PR (minor/major/patch)
# Add "minor" label on GitHub

# 5. Merge PR
# Version automatically bumps: 6.0.0 → 6.1.0 ✅
# CI/CD automatically builds and submits ✅
```

## Build Numbers

**You never need to touch build numbers!**

- iOS `buildNumber` and Android `versionCode` auto-increment via EAS
- Each build gets a unique number automatically
- Example: 41 → 42 → 43...

## Current Version

**Version**: 6.0.0  
**Last Updated**: January 25, 2026

## No More Manual Work!

❌ **OLD WAY** (Manual):
1. Edit app.json version
2. Commit version change
3. Push to main
4. Hope CI/CD picks up correct version

✅ **NEW WAY** (Automatic):
1. Create PR with label
2. Merge PR
3. Done! Everything else is automatic

## Troubleshooting

**Q: What if I don't add a label?**  
A: System checks your PR title. If it starts with `feat:`, it does a minor bump. Otherwise, it does a patch bump.

**Q: Can I still manually bump the version?**  
A: Yes, but not recommended. Edit `app.json` and push to `main` with `[skip ci]` in commit message to avoid double-building.

**Q: What does `[skip ci]` mean?**  
A: The auto-versioning workflow adds this to its commit to prevent triggering another CI/CD run. The next push will trigger the build with the new version.

**Q: How do I see what version will be deployed?**  
A: Check the GitHub Actions logs or the git tags in your repository.

## Summary

🎯 **Just add a label to your PR and merge!**
- `major` for breaking changes
- `minor` for new features
- `patch` for bug fixes

Everything else happens automatically! 🚀
