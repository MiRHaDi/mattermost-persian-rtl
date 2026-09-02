# Release procedure

The authoritative release destination is:

- repository: <https://github.com/MiRHaDi/mattermost-persian-rtl>
- release tag: `v<plugin.json version>`
- installable asset: `ir.mirhadi.mattermost-persian-rtl-<version>.tar.gz`

## Prepare

1. Update `plugin.json`, `package.json`, `CHANGELOG.md`, `compatibility.json`,
   both READMEs, and the compatibility documents together.
2. Fetch the current Mattermost, Desktop, plugin-starter, Marketplace, and
   audited ecosystem refs. Record exact commits; do not write “latest” without
   an exact snapshot.
3. Run an authenticated staging test and add its exact row to the compatibility
   matrix. Never convert a source audit into a live-test claim.
4. Run:

   ```sh
   npm ci
   npm run release:check
   ```

5. Review `dist/release-manifest.json`, `dist/SHA256SUMS`, and the installable
   archive. The release check builds the archive twice and requires identical
   SHA-256 values.

## Publish

1. Create a signed or annotated tag matching the manifest version exactly.
2. Push the tag. The tag-only release workflow repeats all checks and creates a
   GitHub Release with the archive, checksum, and release manifest.
3. Verify the public repository, issue tracker, `homepage_url`, `support_url`,
   `release_notes_url`, archive hash, and private vulnerability-reporting route.
4. Submit the official Mattermost Marketplace **Add plugin** issue only after
   the remaining live QA, screenshot, security-contact, and Beta requirements
   in the prepared issue body are truthful.

No scheduled workflow is used. CI runs on pushes and pull requests; release
publishing runs only when a maintainer pushes a version tag.
