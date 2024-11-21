# Clicktorio

A Factorio-inspired resource management game.

## Image Asset Management

The game includes an automatic image optimization system that helps maintain optimal performance by automatically processing and optimizing game assets.

### Automatic Image Optimization

Images are automatically optimized based on their directory:
- Logo: 256x256 px
- Resources: 64x64 px
- Crafted Items: 64x64 px

### How to Use

1. **Watch Mode (Recommended)**
   ```bash
   npm run watch-assets
   ```
   This will:
   - Watch for new or modified images
   - Automatically optimize them
   - Create optimized versions with '_optimized' suffix
   - Remove optimized versions when original is deleted

2. **One-time Optimization**
   ```bash
   npm run optimize-images
   ```
   Use this to optimize all images at once.

### Adding New Images

1. Simply add your images to the appropriate directory:
   - `assets/images/logo/` for game logos
   - `assets/images/resources/` for resource images
   - `assets/images/craftedItems/` for crafted item images

2. The watcher will automatically:
   - Detect the new image
   - Optimize it to the correct size
   - Create an optimized version
   - Log the optimization results

### Best Practices

1. Always run the asset watcher during development
2. Use PNG format for images that need transparency
3. Place images in the correct directories for proper sizing
4. Use the optimized versions in your code (with '_optimized' suffix)

### Example

```javascript
// Use optimized versions in your code
<img src="./assets/images/craftedItems/red-science_optimized.png">
```
