# Landing Page Project

A modern, responsive landing page built with React, TypeScript, and Vite, featuring a sophisticated design system and integrated markdown blog functionality.

## 🚀 Features

- **Modern Tech Stack**: Built with React 18, TypeScript, and Vite for optimal performance
- **Design System**: Powered by Radix UI and Tailwind CSS with custom animations
- **Markdown Blog**: Integrated blog system with markdown support using `react-markdown`
- **Research Section**: Dedicated research articles with dynamic routing
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Pattern Background**: Custom animated pattern overlay for visual appeal

## 📁 Project Structure

```
landingpage/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn/ui components
│   │   ├── Navigation.tsx   # Main navigation
│   │   ├── HeroSection.tsx  # Landing page hero
│   │   ├── FeatureGrid.tsx  # Feature showcase
│   │   ├── CTASection.tsx   # Call-to-action section
│   │   └── Footer.tsx       # Site footer
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Landing page
│   │   ├── Blog.tsx        # Blog listing
│   │   ├── BlogPost.tsx    # Individual blog post
│   │   ├── Research.tsx    # Research listing
│   │   └── ResearchPost.tsx # Individual research post
│   ├── utils/              # Utility functions
│   │   └── markdownLoader.ts # Markdown processing utilities
│   └── lib/                # Library configurations
├── public/                 # Static assets
├── MARKDOWN_TOOL_README.md # Markdown system documentation
└── README.md              # Project documentation
```

## 🛠️ Installation & Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd landingpage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:8080`

4. **Build for production**
   ```bash
   npm run build
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 📝 Markdown Blog System

The landing page includes an integrated blog system that supports markdown content with the following features:

### Blog Structure

```typescript
interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}
```

### How It Works

1. **Markdown Loader** (`src/utils/markdownLoader.ts`) - Handles blog post data management
2. **Blog Pages** - `Blog.tsx` for listing, `BlogPost.tsx` for individual posts
3. **React Markdown** - Renders markdown content with GitHub Flavored Markdown support

### Usage

Currently uses sample data. To add real markdown files:

1. Create a `content/blog/` directory
2. Add markdown files with frontmatter
3. Update `markdownLoader.ts` to read from files

For detailed markdown system documentation, see `MARKDOWN_TOOL_README.md`.

## 🎨 Technology Stack

### Core Technologies
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development  
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing

### UI & Styling
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Pre-built component library
- **Lucide React** - Beautiful SVG icons

### Markdown & Content
- **react-markdown** - Markdown rendering
- **remark-gfm** - GitHub Flavored Markdown support
- **gray-matter** - Frontmatter parsing

## 🧭 Navigation & Routing

The application uses React Router with these routes:

- `/` - Landing page with hero, features, and CTA sections
- `/blog` - Blog listing page  
- `/blog/:slug` - Individual blog post
- `/research` - Research listing page
- `/research/:slug` - Individual research post

## 📱 Responsive Design

- Mobile-first approach optimized for all devices
- Tailwind's responsive utilities for breakpoints
- Touch-friendly interactions
- Performance optimized with lazy loading

## 🚀 Deployment

### Lovable Platform
Open [Lovable](https://lovable.dev/projects/b2359178-7ec5-4bce-9156-b7e6934d4c42) and click Share → Publish.

### Other Platforms
1. Build: `npm run build`
2. Deploy the `dist/` folder to Vercel, Netlify, or other static hosts

### Custom Domain
Connect through Project > Settings > Domains in Lovable.

## 🤝 Development Workflow

### Using Lovable
Visit the [Lovable Project](https://lovable.dev/projects/b2359178-7ec5-4bce-9156-b7e6934d4c42) for AI-powered development.

### Local Development
```bash
git clone <YOUR_GIT_URL>
cd landingpage
npm install
npm run dev
```

### GitHub Integration
- Direct file editing in GitHub
- GitHub Codespaces support  
- Automatic syncing with Lovable platform

## 📄 License

This project is licensed under the MIT License.
