# PursePulse - Personal Finance Visualizer

A modern web application for tracking personal finances, built with Next.js, React, and MongoDB. Visualize your income, expenses, and budgets with beautiful charts and intuitive interfaces.

## Features

- **Transaction Management**
  - Add, edit, and delete transactions
  - Categorize transactions
  - Track income and expenses
  - View transaction history

- **Budget Tracking**
  - Set monthly budgets by category
  - Track budget vs. actual spending
  - Visualize budget progress

- **Data Visualization**
  - Monthly expenses bar chart
  - Category-wise spending pie chart
  - Budget vs. actual comparison charts
  - Interactive and responsive charts

- **Dashboard**
  - Summary cards for quick insights
  - Recent transactions list
  - Category breakdown
  - Total expenses overview

## Tech Stack

- **Frontend**
  - Next.js 15.3.1
  - React 19
  - shadcn/ui for components
  - Recharts for data visualization
  - Tailwind CSS for styling

- **Backend**
  - Next.js API Routes
  - MongoDB with Mongoose
  - Zod for validation

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/philspec/personal-finance-visualizer.git
   cd personal-finance-visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The application is deployed on Vercel. You can access it at:
[Live Demo URL](https://personal-finance-visualizer-8xi9zvd08.vercel.app/)

## Project Structure

```
personal-finance-visualizer/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   └── (routes)/      # Page routes
│   │   ├── components/        # React components
│   │   ├── lib/              # Utility functions
│   │   ├── models/           # MongoDB models
│   │   └── schemas/          # Zod schemas
│   ├── public/               # Static assets
│   └── styles/              # Global styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
