# Teen Skin Lab

Student-led, research-based skin health for teens. This is a plain HTML/CSS/JavaScript
site — no build step, no paid tools — designed to be hosted free on **GitHub Pages**.

## What's in here

```
index.html            Home
take-action.html      Programs: workshops, sunscreen stations, survey, club
impact.html           Progress toward yearly goals (update the numbers!)
learn.html            Learn hub
skin-101.html         Skin 101
acne.html             Acne & Breakouts
ingredients.html      Ingredients
sun-safety.html       Sun Safety (prevention)
know-the-signs.html   Know the Signs (ABCDEs)
myth-lab.html         Myth Lab (flip cards)
research.html         Research
about.html            About
contact.html          Contact form
style.css             All styles (colors are at the top under :root)
main.js               Header, footer, nav links, social links, animations
logo.png              Primary logo
logo-horizontal.png   Horizontal logo (site header)
```

Everything sits in one folder on purpose: GitHub's "choose your files" button can't
pick subfolders, so a flat folder uploads in one step.

## Preview it on your computer

Double-click `index.html` — it opens in your browser. That's it.

## Publish free on GitHub Pages (no coding tools needed)

1. Make a free account at <https://github.com>. Your username appears in the free web address, so pick one you're happy to share.
2. Click **+ → New repository**. Name it `teenskinlab`, set it to **Public**, and click **Create repository**.
3. On the next page, click **uploading an existing file**, then **choose your files**. Open this folder, press **Ctrl+A** to select every file, and click **Open**. When all files finish uploading, click **Commit changes**.
4. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
5. Wait a minute or two. Your site is live at:
   `https://YOUR-USERNAME.github.io/teenskinlab/`

To update the site later, upload the changed files the same way — GitHub republishes automatically.

## Add a custom domain (optional, ~$10–20/year)

1. Buy a domain (for example `teenskinlab.org`) from a registrar such as Cloudflare, Namecheap, or Porkbun.
2. In GitHub: **Settings → Pages → Custom domain**, type your domain, and **Save**.
3. At your registrar, add these DNS records:
   - `CNAME` record: name `www` → value `YOUR-USERNAME.github.io`
   - Four `A` records for the bare domain (`@`): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
4. Back in GitHub Pages settings, tick **Enforce HTTPS** once it becomes available (can take up to an hour).

Check GitHub's guide if anything looks different: <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site>

## Connect the contact form (free)

The form uses [Formspree](https://formspree.io) because GitHub Pages can't send email by itself.

1. Sign up free at formspree.io and create a new form.
2. Copy the form ID (looks like `xayzabcd`).
3. In `contact.html`, replace `YOUR_FORM_ID` with it.

Until then, the form politely says it isn't connected yet instead of sending.

## Keep the Impact page current

On `impact.html`, each progress bar looks like this:

```html
<div class="meter" data-current="0" data-goal="15" ...>
```

Change `data-current` to your real number (and the "Last updated" line) after each workshop or milestone. Never round up — judges and partners may ask for your log.

## Connect the Sun Habits Survey

1. Build the survey in Google Forms (questions are in `SILVER-KNIGHT-PLAN.md`).
2. In `take-action.html`, find `data-survey` and replace `href="#"` with the form's share link.

Until then, the button reads "Survey opens soon."

## Common edits

- **Social links:** edit the `SOCIALS` list near the top of `main.js`. It feeds the footer and every follow-button row (`<div data-socials></div>`).
- **Menu links:** edit the `NAV` list in the same file — every page updates.
- **YouTube videos:** on `index.html`, each video card links to the channel for now. When a video is posted, swap that card's `href` for the video's link and change "Coming soon" in its label.
- **Colors:** change the values under `:root` at the top of `style.css`.
- **Photos:** images are free Unsplash photos linked by URL. To swap one, replace its `src` with another Unsplash photo link (or put your own photo in this folder and point to it).

## Content note

Every health page lists its sources (mostly the American Academy of Dermatology and U.S.
government health agencies). Keep that habit as you add pages, and keep the disclaimer:
Teen Skin Lab is education, not medical advice.
