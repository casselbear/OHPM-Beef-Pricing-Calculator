# Beef Processing Calculator

This is a custom React calculator designed for Shopify integration.

## How to Host on Vercel (Recommended)

1. **Export to GitHub**: In AI Studio, go to the Settings (gear icon) and select **Export to GitHub**.
2. **Import to Vercel**: 
   - Log in to [Vercel](https://vercel.com).
   - Click **Add New > Project**.
   - Import the repository you just created.
3. **Deploy**: Click **Deploy**.
4. **Get the JS URL**: Once deployed, your JavaScript file will be at: `https://your-project.vercel.app/assets/beef-calculator.js`

## Shopify Integration (Native Method - No Iframe)

This method is much more reliable than an iframe. It runs the calculator directly on your Shopify page.

1. In Shopify, go to **Online Store > Themes > Customize**.
2. Add a **Custom Liquid** section.
3. Paste the following code:

```html
<!-- Load the Calculator Script -->
<script src="https://your-project.vercel.app/assets/beef-calculator.js" type="module"></script>

<!-- Use the Custom Tag -->
<div class="beef-calculator-container">
  <beef-calculator></beef-calculator>
</div>

<style>
  .beef-calculator-container {
    width: 100%;
    margin: 0 auto;
    max-width: 1200px; /* Adjust as needed */
  }
</style>
```

*Note: Replace `https://your-project.vercel.app` with your actual Vercel deployment URL.*
