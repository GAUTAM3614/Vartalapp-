# Vartalapp 💬

A modern, feature-rich real-time chat application built with React, TypeScript, and Tailwind CSS. Experience the future of messaging with beautiful UI, advanced features, and seamless interactions.

## ✨ Features

### 🎨 **Modern UI/UX**
- Clean, responsive design with smooth animations
- Beautiful message bubbles and intuitive layout
- Dark mode support with system preference detection
- Smooth transitions and micro-interactions

### 💬 **Advanced Messaging**
- Real-time messaging with typing indicators
- Message reactions with emoji picker
- Edit and delete your own messages
- Message search across all conversations
- Auto-scrolling to new messages

### 👥 **User Experience**
- User profiles with customizable status
- Online/offline status indicators
- Multiple chat rooms/channels
- Unread message counters
- Desktop notifications for new messages

### 🔧 **Developer Features**
- Full TypeScript support for type safety
- Modular component architecture
- Custom hooks for state management
- Responsive design for all screen sizes
- Accessibility features and keyboard navigation

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
├── components/              # React components
│   ├── ChatHeader.tsx       # Chat room header with actions
│   ├── ChatSidebar.tsx      # Sidebar with rooms and users
│   ├── MessageInput.tsx     # Enhanced message input with emoji picker
│   ├── MessageList.tsx      # Message display with reactions and editing
│   ├── MessageReactions.tsx # Message reaction system
│   ├── EmojiPicker.tsx      # Comprehensive emoji picker
│   ├── SearchModal.tsx      # Global message search
│   ├── TypingIndicator.tsx  # Real-time typing indicators
│   └── UserProfileModal.tsx # User profile management
├── contexts/
│   └── ThemeContext.tsx     # Dark mode theme provider
├── hooks/
│   └── useChat.ts           # Advanced chat state management
├── types/
│   └── index.ts             # Comprehensive type definitions
├── utils/
│   └── notifications.ts     # Desktop notification utilities
├── App.tsx                  # Main app component
├── main.tsx                 # React entry point
└── index.css                # Global styles with dark mode
```

## 🎨 Design Features

- **Color Scheme**: Modern blue primary colors with neutral grays
- **Typography**: Clean, readable fonts with proper hierarchy
- **Animations**: Smooth fade-in effects, hover states, and transitions
- **Responsive**: Mobile-first design that scales beautifully
- **Dark Mode**: Full dark mode support with toggle and system detection
- **Accessibility**: WCAG compliant with keyboard navigation
- **Micro-interactions**: Delightful hover effects and button states

## 🔧 Customization

### Adding New Features

1. **New Message Types**: Extend the `Message` interface in `src/types/index.ts`
2. **Custom Themes**: Modify colors in `tailwind.config.js`
3. **Additional Rooms**: Update the mock data in `src/hooks/useChat.ts`
4. **New Reactions**: Add emojis to the `EmojiPicker` component
5. **Custom Notifications**: Extend the `notifications.ts` utility
6. **User Status**: Add new status types in the `UserProfileModal`

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
