import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your Handlebars helpers
Handlebars.registerHelper("eq", (a, b) => a === b);

Handlebars.registerHelper("if_eq", function(a, b, opts) {
  return a === b ? opts.fn(this) : opts.inverse(this);
});

Handlebars.registerHelper("times", function(n, block) {
  n = parseInt(n, 10);
  let result = "";
  for (let i = 0; i < n; i++) {
    result += block.fn(i);
  }
  return result;
});

// Read template files
const baseTemplate = fs.readFileSync(path.join(__dirname, 'src/templates/base.hbs'), 'utf8');
const homeTemplate = fs.readFileSync(path.join(__dirname, 'src/templates/home.hbs'), 'utf8');
const aboutTemplate = fs.readFileSync(path.join(__dirname, 'src/templates/about.hbs'), 'utf8');
const contactTemplate = fs.readFileSync(path.join(__dirname, 'src/templates/contact.hbs'), 'utf8');

// Compile templates
const baseCompiled = Handlebars.compile(baseTemplate);
const homeCompiled = Handlebars.compile(homeTemplate);
const aboutCompiled = Handlebars.compile(aboutTemplate);
const contactCompiled = Handlebars.compile(contactTemplate);

// Site data
const siteData = {
    siteName: "BootstrapUI Explorer",
    siteDescription: "Modern responsive website built with Bootstrap 5",
    pages: [
        { slug: 'index', title: 'Home', filename: 'index.html' },
        { slug: 'about', title: 'About', filename: 'about.html' },
        { slug: 'contact', title: 'Contact', filename: 'contact.html' }
    ],
    features: [
        {
            icon: "bi-phone",
            title: "Mobile First",
            description: "Responsive design that works perfectly on all devices from mobile to desktop."
        },
        {
            icon: "bi-lightning-charge", 
            title: "Fast & Lightweight",
            description: "Optimized for performance with minimal CSS and JavaScript footprint."
        },
        {
            icon: "bi-palette",
            title: "Customizable",
            description: "Easy to customize with Sass variables and extensive utility classes."
        }
    ],
    team: [
        {
            name: "John Smith",
            position: "Lead Developer",
            description: "Specialized in Bootstrap frameworks and responsive design.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            name: "Sarah Johnson", 
            position: "UI/UX Designer",
            description: "Creates intuitive and beautiful user interfaces.",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            name: "Mike Davis",
            position: "Frontend Developer", 
            description: "Expert in modern JavaScript and CSS frameworks.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        }
    ],
    projects: [
        {
            title: "Modern E-commerce",
            description: "Responsive online store built with Bootstrap 5",
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        },
        {
            title: "Business Dashboard",
            description: "Analytics dashboard with interactive components", 
            image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        },
        {
            title: "Portfolio Website",
            description: "Creative portfolio showcasing design work",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        }
    ]
};

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
}

// Copy assets to dist
if (fs.existsSync('src/assets')) {
    if (fs.existsSync('dist/assets')) {
        fs.rmSync('dist/assets', { recursive: true });
    }
    fs.cpSync('src/assets', 'dist/assets', { recursive: true });
}

// Render each page
const pages = [
    { name: 'index', template: homeCompiled, title: 'Home - BootstrapUI Explorer' },
    { name: 'about', template: aboutCompiled, title: 'About - BootstrapUI Explorer' },
    { name: 'contact', template: contactCompiled, title: 'Contact - BootstrapUI Explorer' }
];

try {
    pages.forEach(page => {
        const content = page.template({ ...siteData, currentPage: page.name });
        const finalHTML = baseCompiled({
            ...siteData,
            content: content,
            title: page.title,
            currentPage: page.name
        });
        
        const filename = page.name === 'index' ? 'index.html' : `${page.name}.html`;
        fs.writeFileSync(path.join(__dirname, 'dist', filename), finalHTML);
        console.log(`✅ Generated: ${filename}`);
    });

    console.log('🎉 All pages generated successfully!');
    console.log('📁 Files created in dist/ folder:');
    console.log('   - index.html');
    console.log('   - about.html'); 
    console.log('   - contact.html');
} catch (error) {
    console.error('❌ Error generating pages:', error);
}