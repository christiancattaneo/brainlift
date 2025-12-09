# Business Brainlift Grader

AI-powered grading system for Business Brainlift submissions at Alpha Founders Academy.

## Features

- **Workflowy Integration**: Paste shared Workflowy links to automatically fetch business plans
- **AI-Powered Grading**: Uses Claude AI to evaluate against the official rubric
- **Real-time Streaming**: Watch sections get analyzed and graded in real-time
- **Detailed Feedback**: Strengths, improvements, and actionable recommendations per section
- **Export Options**: PDF and Markdown export of grading reports
- **Pass/Fail Status**: Clear 80% threshold with visual feedback

## Grading Rubric

- **Thoroughness (30 points)**: Depth and completeness of each section
- **Viability (30 points)**: Proof of real business potential with data-backed claims
- **Executability (40 points)**: Actionable, realistic plans that teens can execute

**Pass Threshold**: 80% (80/100 points)

## Setup

### Prerequisites

- Node.js 18+
- Anthropic API key

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add `ANTHROPIC_API_KEY` environment variable
4. Deploy

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI**: Anthropic Claude API
- **Icons**: Lucide React
- **PDF Export**: jsPDF

## Color Palette (Alpha Founders Academy)

- Alpha Blue: `#1C1CFF`
- Structure Black: `#1B1B1B`
- Canvas White: `#FFFFFF`
- Volt Mint: `#00FFA3`
- International Orange: `#FF4F00`
- Electric Cyan: `#00E0FF`
- Chrome Silver: `#E5E7EB`

## License

Proprietary - Alpha Founders Academy
