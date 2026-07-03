# JARVIS AI Agent Application

A modern, futuristic web interface inspired by Microsoft's JARVIS project. This application demonstrates the concept of using Large Language Models (LLMs) as controllers to orchestrate various AI models for solving complex tasks.

![JARVIS AI Agent](https://img.shields.io/badge/JARVIS-v1.0-00d4ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38b2ac?style=flat-square&logo=tailwind-css)

## 🎯 Overview

JARVIS is an AI agent system that demonstrates the HuggingGPT architecture:

- **LLM as Controller**: Uses GPT-4/ChatGPT to orchestrate tasks
- **Multiple AI Models**: Connects to various AI models from HuggingFace
- **Task Automation**: Automatically plans, selects models, and executes tasks
- **Workflow Visualization**: Real-time visualization of the AI processing pipeline

## ✨ Features

- 🤖 **AI Chat Interface**: Natural language interaction with JARVIS
- 📊 **Task Workflow Visualization**: Real-time 4-stage workflow display
- 🔧 **Model Selection Panel**: View available AI models and their status
- ⚡ **Quick Actions**: One-click presets for common tasks
- 🎨 **Futuristic Sci-Fi Design**: High-tech holographic interface
- 📱 **Responsive**: Works on desktop and mobile devices

## 🔄 4-Stage AI Workflow

```
┌─────────────┐    ┌─────────────────┐    ┌────────────────┐    ┌──────────────────┐
│   Task      │───▶│     Model       │───▶│     Task       │───▶│    Response      │
│   Planning  │    │    Selection    │    │   Execution    │    │   Generation     │
└─────────────┘    └─────────────────┘    └────────────────┘    └──────────────────┘
```

1. **Task Planning**: Analyze user request and decompose into subtasks
2. **Model Selection**: Select optimal AI models from HuggingFace
3. **Task Execution**: Execute models and collect results
4. **Response Generation**: Integrate all results into coherent response

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/microsoft/JARVIS.git
cd JARVIS/jarvis-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Running the Backend Server

```bash
# In a separate terminal
npm run server
```

The frontend will be available at `http://localhost:3000`
The API server will run at `http://localhost:3001`

## 📁 Project Structure

```
jarvis-app/
├── public/
│   └── jarvis-icon.svg
├── server/
│   └── index.js          # Express backend API
├── src/
│   ├── components/
│   │   ├── ModelPanel.tsx
│   │   └── TaskWorkflow.tsx
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx           # Main application
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Design System

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#00d4ff` | Main accent, highlights |
| Secondary | `#7c3aed` | Secondary accent |
| Accent | `#f59e0b` | Warnings, attention |
| Dark | `#0a0f1a` | Background |
| Surface | `#111827` | Cards, panels |

### Typography

- **Display**: Orbitron (futuristic, tech feel)
- **Body**: Rajdhani (clean, readable)
- **Mono**: JetBrains Mono (code, technical)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:3001
```

### Adding Custom Models

Edit `src/App.tsx` to add or modify AI models in the `AVAILABLE_MODELS` array.

## 📚 References

This project is inspired by:

- [HuggingGPT Paper](https://arxiv.org/abs/2303.17580)
- [Microsoft JARVIS](https://github.com/microsoft/JARVIS)
- [LangChain HuggingGPT](https://github.com/langchain-ai/langchain/tree/master/libs/experimental/langchain_experimental/autonomous_agents/hugginggpt)

## 📄 License

MIT License - See LICENSE file for details.

---

Built with ❤️ inspired by Microsoft's JARVIS project
