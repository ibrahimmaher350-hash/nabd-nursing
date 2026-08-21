const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

async function main() {
  const logoPath = path.join(__dirname, '..', 'public', 'logo.jpg')
  const iconsDir = path.join(__dirname, '..', 'public', 'icons')

  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true })
  }

  const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512]

  for (const size of sizes) {
    const outPath = path.join(
      iconsDir,
      size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`
    )
    await sharp(logoPath)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(outPath)
    console.log(`Generated ${outPath}`)
  }

  // Also generate Open Graph Image (1200x630) with Navy Blue branded background
  const ogPath = path.join(__dirname, '..', 'public', 'og-image.jpg')
  const logoResized = await sharp(logoPath)
    .resize(500, 500, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toBuffer()

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 27, g: 43, b: 107, alpha: 1 }, // Navy #1B2B6B
    },
  })
    .composite([
      {
        input: logoResized,
        gravity: 'center',
      },
    ])
    .jpeg({ quality: 90 })
    .toFile(ogPath)

  console.log(`Generated ${ogPath}`)
}

main().catch(console.error)
