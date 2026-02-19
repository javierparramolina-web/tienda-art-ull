const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const uploadsDir = path.join(publicDir, 'uploads');
const rootLogo = path.join(__dirname, 'artull-logo.png');
const destLogo = path.join(publicDir, 'artull-logo.png');
const placeholderPath = path.join(uploadsDir, 'hero-placeholder.jpg');

// Ensure uploads dir
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// 1. Move Logo
if (fs.existsSync(rootLogo)) {
    fs.renameSync(rootLogo, destLogo);
    console.log('✅ Logo movido a public/artull-logo.png');
} else if (fs.existsSync(destLogo)) {
    console.log('✅ El logo ya estaba en public/');
} else {
    console.log('⚠️ No encuentro artull-logo.png en la raíz. Por favor, asegúrate de que tiene ese nombre.');
}

// 2. Fix Hero Image
if (!fs.existsSync(placeholderPath)) {
    // Try to find any jpg in uploads to use as placeholder
    const files = fs.readdirSync(uploadsDir);
    const jpg = files.find(f => f.endsWith('.jpg') || f.endsWith('.png'));
    if (jpg) {
        fs.copyFileSync(path.join(uploadsDir, jpg), placeholderPath);
        console.log(`✅ Creado hero-placeholder.jpg usando ${jpg}`);
    } else {
        console.log('⚠️ No hay imágenes en uploads/ para usar de fondo. Sube alguna desde el admin.');
    }
} else {
    console.log('✅ hero-placeholder.jpg ya existe');
}
