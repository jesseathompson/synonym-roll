# Synonym Roll 🎲

A daily word puzzle game where players find a path between two words using synonyms. Think Wordle meets word association! Players start with one word and must reach a target word by selecting synonyms, creating a chain of related words.

## 🎮 How to Play

1. **Start with the given word** - This is your starting point
2. **Choose synonyms** - Select from the available synonyms to move forward
3. **Build your path** - Each word leads to new synonym options
4. **Reach the target** - Find the shortest path to the target word
5. **Track your progress** - See your word chain with arrows showing your path

## ✨ Features

- 🎯 **Daily Puzzles** - New word pairs every day
- 📊 **Progress Tracking** - Visual path with arrows between words
- 🎨 **Wordle-style UI** - Clean, intuitive design with rectangular word tiles
- 📱 **Responsive Design** - Works perfectly on mobile and desktop
- 🌙 **Dark/Light Theme** - Toggle between themes
- 📈 **Statistics** - Track your win rate, streak, and performance
- 🔗 **Social Sharing** - Share your results with friends
- ⏱️ **Timer** - See how long it takes to complete each puzzle

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/synonym-roll.git
   cd synonym-roll
   ```

2. **Install dependencies**
   ```bash
   cd app
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run test         # Run tests

# Storybook
npm run storybook    # Start Storybook
npm run build-storybook  # Build Storybook
```

## 🏗️ Project Structure

```
app/
├── src/
│   ├── components/          # React components
│   │   ├── common/         # Shared components
│   │   │   └── WordTile/   # Word display component
│   │   ├── features/       # Feature-specific components
│   │   │   └── game/       # Game components
│   │   │       ├── GamePath/      # Path display with arrows
│   │   │       ├── SynonymList/   # Synonym selection grid
│   │   │       ├── GameBoard/     # Main game container
│   │   │       ├── GameTimer/     # Timer component
│   │   │       ├── GameControls/  # Game controls
│   │   │       └── CompletedState/ # Completion screen
│   │   ├── Navigation.tsx   # Navigation bar
│   │   ├── InfoModal.tsx   # Game instructions
│   │   └── SettingsModal.tsx # Settings panel
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Landing page
│   │   └── Play.tsx        # Game page
│   ├── hooks/              # Custom React hooks
│   ├── context/            # React context providers
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles and CSS variables
├── public/                 # Static assets
├── games/                  # Game data and puzzles
└── dist/                   # Production build output
```

## 🎨 Design System

The game uses a comprehensive design system with:

- **Color Palette**: Warm browns and creams inspired by cinnamon rolls
- **Typography**: Custom "KG Kiss Me Slowly" font for the title, Outfit for body text
- **Components**: Modular, reusable components with consistent styling
- **Responsive Design**: Mobile-first approach with breakpoints for all devices

### Key Components

- **WordTile**: Rectangular word tiles with different variants (start, step, end, neutral)
- **SynonymList**: Grid layout for synonym selection
- **GamePath**: Visual path display with arrows between words
- **GameBoard**: Main game container with timer and controls

## 🧩 Game Logic

### Word Selection
- Players choose from available synonyms
- Each selection reveals new synonym options
- Path builds progressively with visual arrows
- Target word must be reached in minimum steps

### Daily Puzzles
- New word pairs generated daily
- Consistent puzzle numbering
- Progress tracking and statistics
- Streak maintenance

### State Management
- Game state persisted in localStorage
- Automatic daily reset
- Statistics tracking (win rate, streak, etc.)
- Theme preferences saved

## 🛠️ Development

### Adding New Features

1. **New Components**: Add to appropriate feature folder
2. **Styling**: Use CSS modules with BEM methodology
3. **Types**: Define TypeScript interfaces in `/types`
4. **Hooks**: Custom logic in `/hooks`
5. **Utils**: Helper functions in `/utils`

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Storybook

View and develop components in isolation:

```bash
npm run storybook
```

Access at `http://localhost:6006`

## 🚀 Deployment

### GitHub Pages (Recommended)

1. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Select "GitHub Actions" as source

2. **Configure environment**:
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Add your Google Analytics ID
   echo "VITE_GA_ID=G-XXXXXXXXXX" >> .env
   ```

3. **Deploy**:
   - Push to main branch
   - GitHub Actions will automatically build and deploy
   - Your game will be live at `https://yourusername.github.io/synonym-roll`

### Other Platforms

- **Vercel**: Connect your GitHub repository
- **Netlify**: Deploy from GitHub with build command `npm run build`
- **Manual**: Upload the `dist` folder to any static hosting service

## 📊 Analytics & Tracking

The game includes built-in analytics support:

- **Google Analytics 4**: Track user engagement
- **Custom Events**: Game completion, streak milestones
- **Performance Metrics**: Load times, user interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Wordle and other daily puzzle games
- Built with React, TypeScript, and Vite
- UI components styled with CSS modules
- Icons from Font Awesome
- Fonts: KG Kiss Me Slowly, Outfit

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/synonym-roll/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

**Happy word rolling! 🎲✨**