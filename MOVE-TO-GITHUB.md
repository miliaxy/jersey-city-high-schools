# Move to GitHub Pages

This site is ready to host on GitHub Pages. No build service, database, API key, or paid hosting is needed.

1. Unzip `school-compare-github-pages.zip` on your computer.
2. Create a GitHub repository. Upload the extracted contents into its root, including `dist` and the hidden `.github` folder. Do not upload only the ZIP.
3. In the repository, open Settings → Pages → Source and select GitHub Actions.
4. Open Actions → Deploy school comparison → Run workflow. Once successful, Settings → Pages shows the live address.

If uploading the hidden workflow folder is inconvenient: upload only the contents of `dist` into the repository root, then choose Settings → Pages → Deploy from a branch → main → /(root) → Save.

## Before sharing

GitHub Pages normally makes the website public. The download contains school-level information and public source links, with no family records or credentials. Review the current school data before sharing it.

Your checkmarks on the existing Sites address will not move to GitHub: they belong to each browser and website address. Parents can begin a new checklist at the GitHub address. The existing Sites address continues working independently.

## Updating later

With the included workflow, edit `dist/schools.json` for school information, dates and exams, then commit to main. GitHub republishes it. If using the simpler root-folder option, edit `schools.json` in the repository root instead. All tabs read this same file.

Updates here do not automatically update your GitHub repository, and GitHub changes do not automatically update the Sites copy. Choose one as the version you maintain after moving.
