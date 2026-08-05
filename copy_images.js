const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\athar\\.gemini\\antigravity-ide\\brain\\f34b9024-2a50-4c17-9d64-1782c8c68d42';
const destDir = 'c:\\Users\\athar\\Desktop\\INF\\E-tech\\public\\images\\projects';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const files = [
    { src: 'media__1785940154097.png', dest: 'p1.png' },
    { src: 'media__1785940192581.png', dest: 'p2.png' },
    { src: 'media__1785940380491.jpg', dest: 'p3.jpg' },
    { src: 'media__1785940433161.png', dest: 'p4.png' },
    { src: 'media__1785940461676.png', dest: 'p5.png' },
    { src: 'media__1785943641177.png', dest: 'p6.png' },
    { src: 'media__1785943699298.png', dest: 'p7.png' },
    { src: 'media__1785943725033.png', dest: 'p8.png' },
    { src: 'media__1785946776263.jpg', dest: 'p9.jpg' }
];

files.forEach(f => {
    fs.copyFileSync(path.join(srcDir, f.src), path.join(destDir, f.dest));
    console.log(`Copied ${f.src} to ${f.dest}`);
});
