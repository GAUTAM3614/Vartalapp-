# Vartalapp 💬

A modern, beautiful real-time chat application built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Real-time Messaging**: Simulated real-time chat experience
- **Multiple Channels**: Support for different chat rooms
- **User Management**: Online status tracking and user avatars
- **Message Formatting**: Proper message bubbles with timestamps
- **Responsive Design**: Works seamlessly on desktop and mobile
- **TypeScript**: Full type safety throughout the application
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd vartalapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 📦 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check for code issues

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **date-fns** - Date formatting utilities

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ChatHeader.tsx   # Chat room header
│   ├── ChatSidebar.tsx  # Sidebar with rooms and users
│   ├── MessageInput.tsx # Message input component
│   └── MessageList.tsx  # Message display component
├── hooks/
│   └── useChat.ts       # Chat state management hook
├── types/
│   └── index.ts         # TypeScript type definitions
├── App.tsx              # Main app component
├── main.tsx             # React entry point
└── index.css            # Global styles
```

## 🎨 Design Features

- **Color Scheme**: Modern blue primary colors with neutral grays
- **Typography**: Clean, readable fonts with proper hierarchy
- **Animations**: Smooth fade-in effects for new messages
- **Responsive**: Mobile-first design that scales beautifully
- **Dark Mode Ready**: Prepared for future dark mode implementation

## 🔧 Customization

### Adding New Features

1. **New Message Types**: Extend the `Message` interface in `src/types/index.ts`
2. **Custom Themes**: Modify colors in `tailwind.config.js`
3. **Additional Rooms**: Update the mock data in `src/hooks/useChat.ts`

### Styling

The app uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Global styles in `src/index.css`
- Component-specific styles in individual component files

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist/` folder to Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Date formatting by [date-fns](https://date-fns.org/)
- Built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/)

---

Made with ❤️ for modern chat experiences
