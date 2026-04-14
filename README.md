# Beef Processing Calculator

This is a custom React calculator designed for Shopify integration.

## How to Host on Vercel (Recommended)

1. **Export to GitHub**: In AI Studio, go to the Settings (gear icon) and select **Export to GitHub**.
2. **Import to Vercel**: 
   - Log in to [Vercel](https://vercel.com).
   - Click **Add New > Project**.
   - Import the repository you just created.
3. **Configuration**: 
   - The project is already configured with a `vercel.json` file.
   - This file handles the security headers (CSP) required to allow Shopify to embed the calculator in an iframe.
4. **Deploy**: Click **Deploy**.
5. **Update Shopify**: Once deployed, copy your new Vercel URL (e.g., `https://your-project.vercel.app`) and use it in the Shopify iframe code.

## Shopify Integration Code

Use this code in a **Custom Liquid** or **Custom HTML** block:

```html
<div style="width: 100%; overflow: hidden;">
  <iframe 
    src="YOUR_VERCEL_URL_HERE" 
    style="width: 1px; min-width: 100%; height: 600px; border: none; transition: height 0.2s ease;"
    scrolling="no"
    id="beef-calculator-iframe">
  </iframe>
</div>

<script>
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'resize' && e.data.height) {
      const iframe = document.getElementById('beef-calculator-iframe');
      if (iframe) {
        iframe.style.height = (e.data.height + 20) + 'px';
      }
    }
  }, false);
</script>
```
