# Patient Management Dashboard

A modern, responsive patient management system built with Next.js 15, TypeScript, and Tailwind CSS. This application provides healthcare professionals with an intuitive interface to view, search, filter, and manage patient information efficiently.

## 🚀 Features

### 📊 **Dual View Modes**
- **Table View**: Traditional tabular layout for detailed data viewing
- **Card View**: Modern card-based layout with responsive grid system

### 🔍 **Advanced Search & Filtering**
- **Real-time Search**: Search across patient names, emails, and patient IDs
- **Age Range Filtering**: Filter patients by predefined age groups (0-17, 18-30, 31-50, 51-70, 71+)
- **Medical Issue Filtering**: Filter by specific medical conditions
- **Location Filtering**: Filter by patient location/state
- **Interactive Filter Dialog**: Easy-to-use filter interface with active filter display

### 📋 **Multi-Field Sorting**
- **Multiple Sort Criteria**: Sort by multiple fields simultaneously
- **Flexible Sort Order**: Independent ascending/descending order for each field
- **Supported Sort Fields**: Age, Name, Medical Issue
- **Priority-based Sorting**: Maintain sort priority order with visual indicators

### 📄 **Pagination & Layout**
- **Customizable Page Sizes**: Different options for table (10, 20, 50) and card (6, 12, 24) views
- **Responsive Pagination**: Navigate through large datasets efficiently
- **Auto Page Size Adjustment**: Automatically adjusts page size when switching between views
- **Responsive Card Grid**: Customizable column layout for different screen sizes

### 📱 **Responsive Design**
- **Mobile-First Approach**: Optimized for all device sizes
- **Touch-Friendly Interface**: Easy navigation on mobile devices
- **Adaptive Layouts**: Components adjust based on screen size

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: React Hooks (useState, useEffect)
- **Build Tool**: Turbopack (Next.js built-in)
- **Code Quality**: ESLint with Next.js configuration

## 📁 Project Structure

```
memberlistdesign/
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css          # Global styles and Tailwind imports
│   │   ├── layout.tsx           # Root layout component
│   │   └── page.tsx             # Main dashboard page
│   ├── components/
│   │   ├── Avatar.tsx           # User avatar component
│   │   ├── cardview.tsx         # Card view component for patient data
│   │   ├── navbar.tsx           # Navigation bar component
│   │   ├── rowview.tsx          # Table row component for patient data
│   │   └── SafeImage.tsx        # Safe image loading component
│   └── types/
│       └── index.ts             # TypeScript type definitions
├── public/
│   ├── MOCK_DATA 1.json         # Sample patient data
│   └── [static assets]          # Icons and images
├── package.json
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🚦 Getting Started

### Prerequisites

- **Node.js**: Version 18.17 or higher
- **npm**: Version 9 or higher (or yarn/pnpm)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/trufurs/PatienDetails.git
   cd memberlistdesign
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## 📊 Data Structure

### Patient Data Model

```typescript
type DataProps = {
  patient_id: number;           // Unique patient identifier
  patient_name: string;         // Full patient name
  age: number;                  // Patient age
  photo_url: string | null;     // Profile photo URL (optional)
  contact: {                    // Contact information array
    address: string;            // Full address
    number: string;             // Phone number
    email: string;              // Email address
  }[] | null;
  medical_issue: string | null; // Current medical condition
};
```

## 🎨 UI Components

### Main Dashboard (`page.tsx`)
- **State Management**: Handles all application state including filters, sorting, pagination
- **Data Processing**: Implements filtering, sorting, and pagination logic
- **View Switching**: Manages toggle between table and card views

### Row View (`rowview.tsx`)
- **Table Display**: Renders patient data in tabular format
- **Responsive Columns**: Adjusts column visibility based on screen size

### Card View (`cardview.tsx`)
- **Card Layout**: Modern card-based patient display
- **Image Handling**: Safe image loading with fallback
- **Responsive Grid**: Adapts to different screen sizes

### Utility Components
- **Avatar**: User profile image component
- **SafeImage**: Image component with error handling
- **Navbar**: Navigation and branding component

## 🔧 Customization

### Adding New Filter Types

1. **Add state variable**:
   ```typescript
   const [filterNewType, setFilterNewType] = React.useState<string[]>([]);
   ```

2. **Update filter logic**:
   ```typescript
   const matchesNewType = filterNewType.length === 0 ? true : 
     filterNewType.includes(d.new_field || '');
   ```

3. **Add to filter dialog**: Include new filter section in the UI

### Adding New Sort Fields

1. **Update sort logic** in the `sorted` computation:
   ```typescript
   else if (sortField === "new_field") {
     // Add comparison logic for new field
   }
   ```

2. **Add option** to sort dropdown:
   ```jsx
   <option value="new_field">Sort by New Field</option>
   ```

### Customizing Page Sizes

Modify the page size options in the respective view sections:
```typescript
// For table view
<option value={25}>25</option>

// For card view  
<option value={18}>18</option>
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (1-2 card columns)
- **Tablet**: 768px - 1024px (2-3 card columns)
- **Desktop**: > 1024px (3-4 card columns)
- **Large Desktop**: > 1280px (4+ card columns)

## 🔍 Search Functionality

The search feature performs real-time filtering across:
- Patient names (case-insensitive)
- Email addresses
- Patient IDs (partial matching)

## 🎯 Filter Categories

### Age Ranges
- **0-17**: Children and minors
- **18-30**: Young adults
- **31-50**: Middle-aged adults
- **51-70**: Older adults
- **71+**: Seniors

### Medical Issues
Dynamic list based on available data including:
- Headache, Fever, Cough
- Nausea, Fatigue, Dizziness
- Back pain, Chest pain
- Shortness of breath, Anxiety

### Location Filters
Extracted from patient address data (last part of comma-separated address)

## 🚀 Performance Optimization

- **Efficient Filtering**: Optimized filter chains for large datasets
- **Pagination**: Reduces DOM elements for better performance
- **Memoization**: Strategic use of React hooks for expensive computations
- **Turbopack**: Fast build times and hot reloading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support, email [support@example.com](mailto:support@example.com) or open an issue on GitHub.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- React team for the powerful UI library
- All contributors and users of this project

---

**Built with ❤️ by the development team**
