const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const ICON_SIZES = {
  ios: {
    iphone: {
      '20x20': [2, 3],  // @2x, @3x
      '29x29': [1, 2, 3],  // @1x, @2x, @3x
      '40x40': [2, 3],  // @2x, @3x
      '57x57': [1, 2],  // @1x, @2x
      '60x60': [2, 3],  // @2x, @3x
    },
    ipad: {
      '20x20': [1, 2],  // @1x, @2x
      '29x29': [1, 2],  // @1x, @2x
      '40x40': [1, 2],  // @1x, @2x
      '50x50': [1, 2],  // @1x, @2x
      '72x72': [1, 2],  // @1x, @2x
      '76x76': [1, 2],  // @1x, @2x
      '83.5x83.5': [2],  // @2x
    },
    marketing: {
      '1024x1024': [1],  // @1x
    }
  },
  android: [48, 72, 96, 144, 192]
};

async function generateIcons() {
  // Create base icon with exact proportions matching the Android version
  const baseIcon = Buffer.from(`
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <rect width="1024" height="1024" fill="#00A9FF"/>
      <g transform="translate(200, 150) scale(0.6, 0.6)">
        <!-- Location Pin -->
        <path fill="white" d="M512,20 C380,20 275,125 275,257 C275,480 512,1004 512,1004 C512,1004 749,480 749,257 C749,125 644,20 512,20 Z"/>
        <!-- Suitcase - Made smaller and centered with padding -->
        <path fill="#00A9FF" d="M387,437 L637,437 Q657,437 657,457 L657,587 Q657,607 637,607 L387,607 Q367,607 367,587 L367,457 Q367,437 387,437 Z M412,437 L412,417 C412,407 417,402 427,402 L597,402 C607,402 612,407 612,417 L612,437"/>
      </g>
    </svg>
  `);

  // Ensure iOS directory exists
  const iosIconPath = path.join(__dirname, '..', 'ios', 'AwesomeProject', 'Images.xcassets', 'AppIcon.appiconset');
  await fs.mkdir(iosIconPath, { recursive: true });

  // Clean up existing icons
  const files = await fs.readdir(iosIconPath);
  for (const file of files) {
    if (file !== 'Contents.json') {
      await fs.unlink(path.join(iosIconPath, file));
    }
  }

  // Generate iOS icons
  for (const [device, sizes] of Object.entries(ICON_SIZES.ios)) {
    for (const [size, scales] of Object.entries(sizes)) {
      const [width, height] = size.split('x').map(Number);
      for (const scale of scales) {
        const filename = `icon-${width}@${scale}x.png`;
        const actualSize = Math.round(width * scale);
        await sharp(baseIcon)
          .resize(actualSize, actualSize)
          .toFile(path.join(iosIconPath, filename));
        console.log(`Generated iOS icon: ${filename} (${actualSize}x${actualSize})`);
      }
    }
  }

  // Generate Android icons
  const androidDensities = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
  for (let i = 0; i < ICON_SIZES.android.length; i++) {
    const size = ICON_SIZES.android[i];
    const androidPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', `mipmap-${androidDensities[i]}`);
    await fs.mkdir(androidPath, { recursive: true });
    
    await sharp(baseIcon)
      .resize(size, size)
      .toFile(path.join(androidPath, 'ic_launcher.png'));
    await sharp(baseIcon)
      .resize(size, size)
      .toFile(path.join(androidPath, 'ic_launcher_round.png'));
    console.log(`Generated Android icons for ${androidDensities[i]}: ${size}x${size}`);
  }
}

generateIcons().catch(console.error); 