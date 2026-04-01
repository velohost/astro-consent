# Changelog

All notable changes to `astro-consent` will be documented in this file.

The format follows a simple Keep a Changelog style, with semantic versioning.

## [2.0.0] - 2026-04-01

### Breaking

- Changed the package to a major release after the CLI and integration workflow were expanded.
- The installer now writes a marked `astro-consent` block into `astro.config.*` so `init` and `remove` can target only the plugin stanza.

### Added

- `init`, `remove`, `doctor`, and `status` CLI commands
- `--dry-run` support for install and remove
- `--json` output for `doctor` and `status`
- `banner` and `overlay` presentation modes
- Configurable display timing with `displayUntilIdle` and `displayIdleDelayMs`
- Configurable copy with `headline`, `description`, `acceptLabel`, `rejectLabel`, and `manageLabel`
- Separate `cookiePolicyUrl` and `privacyPolicyUrl` support with backwards-compatible `policyUrl` fallback
- Overlay accessibility improvements, including focus trapping, `Escape` to close, and focus return
- Generated editable stylesheet at `src/cookiebanner/styles.css`

### Changed

- Updated default copy to be more professional and concise
- Improved banner and overlay motion and spacing
- Reworked the README into a full onboarding guide
- Updated package branding to `Velohost UK Limited`
- Bumped the package major version to `2.0.0`

### Fixed

- Safer install and removal behavior for `astro.config.*`
- Removed older CSS injection path in favor of a real generated stylesheet
- Improved CLI diagnostics and install/status reporting
