# StudentHousingAI 🏠

An AI-powered student housing platform built with Next.js, React, and TailwindCSS. Find your perfect student apartment with intelligent matching and a beautiful user interface.

## Features ✨

- **AI-Powered Matching**: Get personalized apartment recommendations
- **Interactive Map**: Explore listings with an interactive Mapbox integration
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Step-by-Step Search**: Intuitive search flow for finding the perfect place
- **Real-Time Updates**: Live updates for apartment availability and pricing

## Tech Stack 🛠

- Next.js 13 with App Router
- React 18
- TypeScript
- TailwindCSS
- Mapbox GL
- Framer Motion
- React Icons

## Getting Started 🚀

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/student-housing-ai.git
   cd student-housing-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Mapbox token:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure 📁

```
src/
├── app/                 # App router pages
├── components/          # React components
├── data/               # Mock data and constants
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## Environment Variables 🔑

- `NEXT_PUBLIC_MAPBOX_TOKEN`: Your Mapbox access token

## Contributing 🤝

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License 📄

MIT License - feel free to use this project for learning or building your own student housing platform! 