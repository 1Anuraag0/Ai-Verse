# AiVerse

![AiVerse](https://github.com/1Anuraag0/aiverse/raw/main/public/preview.png)

A sleek, immersive, and visually stunning landing page for AiVerse, featuring dynamic text animations, metallic shader effects, and a responsive 3D scene.

## ✨ Features

- **Animated Welcome Text** - Engaging decryption animation for "Welcome" and "To" text
- **Stunning Metallic Effect** - Custom WebGL shader for the metallic liquid "AiVerse" text
- **Magnetic Dock** - macOS-inspired animated dock with magnetic hover effect
- **3D Background** - Beautiful 3D scene using Spline
- **Custom Cursor Effects** - Dynamic particle cursor trail
- **Responsive Design** - Optimized for all device sizes
- **Performance Optimized** - Smooth animations and transitions with minimal impact on performance

## 🚀 Live Demo



## 🔧 Technologies

- **Next.js** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **WebGL/GLSL** - For the custom metallic shader effect
- **Spline** - For 3D scene creation and integration

## 💻 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aiverse.git
cd aiverse
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
aiverse/
├── public/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Aurora.tsx           # Background aurora effect
│   │   │   ├── Background.tsx       # Main background component
│   │   │   ├── DecryptedText.tsx    # Animated text decryption effect
│   │   │   ├── Dock.tsx             # Interactive dock component
│   │   │   ├── MetallicText.tsx     # WebGL metallic text shader
│   │   ├── hooks/
│   │   │   ├── useRemoveWatermark.ts # Custom hook for UI cleanup
│   │   ├── Splashcursor.tsx         # Particle cursor effect
│   │   ├── globals.css              # Global styles
│   │   ├── page.tsx                 # Main landing page
│   ├── fonts/
```

## 🎨 Customization

### Changing the Metallic Text

The metallic text effect parameters can be adjusted in `page.tsx`:

```tsx
<MetallicText 
  text="AiVerse"
  fontFamily="Horizon, sans-serif"
  fontSize={250}
  params={{
    patternScale: 2.0,
    refraction: 0.015,
    edge: 1.0,
    patternBlur: 0.005,
    liquid: 0.07,
    speed: 0.3
  }}
/>
```

### Adding More Dock Items

To add more items to the dock, modify the items array in `page.tsx`:

```tsx
const items = [
  { icon: <VscHome size={24} className="text-purple-100" />, label: 'Home', onClick: () => alert('Home!') },
  // Add more items here
];
```

## 📱 Responsive Design

The landing page is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🌐 Deployment

This project can be easily deployed on Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Deploy

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Font used: [Horizon](https://horizon.xyz)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- 3D assets created with [Spline](https://spline.design)

### Adding More Dock Items

To add more items to the dock, modify the items array in `page.tsx`:

```tsx
const items = [
  { icon: <VscHome size={24} className="text-purple-100" />, label: 'Home', onClick: () => alert('Home!') },
  // Add more items here
];
```

## 📱 Responsive Design

The landing page is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🌐 Deployment

This project can be easily deployed on Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Deploy

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Font used: [Horizon](https://horizon.xyz)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- 3D assets created with [Spline](https://spline.design)

