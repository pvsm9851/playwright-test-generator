# ElementForge AI

![ElementForge AI Banner](/placeholder.svg?height=300&width=800)

ElementForge AI is a powerful web application that automatically maps interactive elements from websites and generates Playwright test automation projects. Using advanced web scraping techniques, it analyzes websites to identify buttons, links, forms, and other interactive elements, then creates a structured Playwright project with page object models and test files.

## 🚀 Features

- **Intelligent Element Mapping**: Automatically detects and categorizes interactive elements
- **Duplicate Page Detection**: Uses fingerprinting to avoid mapping duplicate pages
- **Page Object Model Generation**: Creates structured POM files for each unique page
- **Test File Generation**: Produces ready-to-use Playwright test files
- **Complete Project Structure**: Generates a full Playwright project with proper configuration
- **Dark Mode UI**: Professional dark interface with purple accents
- **Authentication**: Supports Google and GitHub login

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- A modern web browser

## 🛠️ Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/element-forge-ai.git
   cd element-forge-ai
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open your browser and navigate to:
   \`\`\`
   http://localhost:3000
   \`\`\`

## 🔍 How It Works

ElementForge AI uses a sophisticated process to map websites and generate test projects:

### 1. Website Analysis

When you enter a URL, the application:

- Fetches the HTML content of the main page
- Parses the DOM using Cheerio (a server-side jQuery-like library)
- Identifies interactive elements based on their HTML tags and attributes
- Extracts links to other pages on the same domain

### 2. Element Detection

The system specifically looks for:

- **Buttons**: `<button>`, elements with `role="button"`, `input[type="button"]`, etc.
- **Links**: `<a>` tags with href attributes
- **Form Inputs**: Text fields, textareas, checkboxes, radio buttons, etc.
- **Dropdowns**: `<select>` elements and their options
- **Forms**: `<form>` elements and their submission methods
- **ARIA Elements**: Elements with specific ARIA roles like menu, tab, etc.

For each element, it extracts:
- Text content
- Attributes (id, name, class, etc.)
- A unique selector for targeting the element in tests

### 3. Page Fingerprinting

To avoid duplicate pages (like paginated content with the same structure):

- The system generates a "fingerprint" for each page based on its interactive elements
- Pages with matching fingerprints are considered duplicates and only mapped once
- This ensures the generated test project remains manageable

### 4. Project Generation

Once all unique pages are mapped, ElementForge AI:

1. Creates a structured Playwright project
2. Generates Page Object Model (POM) files for each page
3. Creates test files with basic test structure and element interaction examples
4. Adds configuration files (playwright.config.ts, package.json)
5. Packages everything into a downloadable ZIP file

## 📁 Project Structure

The generated Playwright project follows this structure:

\`\`\`
playwright-project/
├── tests/                  # Test files organized by page
│   ├── home.spec.ts
│   ├── about.spec.ts
│   └── ...
├── page-objects/           # Page Object Models
│   ├── home.ts
│   ├── about.ts
│   └── ...
├── playwright.config.ts    # Playwright configuration
├── package.json            # Project dependencies
└── README.md               # Usage instructions
\`\`\`

## 🧪 Using the Generated Tests

After downloading the project:

1. Extract the ZIP file
2. Navigate to the project directory
3. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
4. Install Playwright browsers:
   \`\`\`bash
   npx playwright install
   \`\`\`
5. Run the tests:
   \`\`\`bash
   npm test
   \`\`\`

## 🔧 Technical Implementation

ElementForge AI is built with:

- **Next.js**: React framework for the frontend and API routes
- **Cheerio**: For parsing and traversing HTML
- **JSZip**: For creating downloadable ZIP files
- **Tailwind CSS**: For styling the UI
- **shadcn/ui**: For UI components
- **TypeScript**: For type safety

The application uses a client-side approach to analyze websites:

1. The frontend sends a request to the `/api/analyze-website` endpoint with the target URL
2. The API fetches the website content and parses it with Cheerio
3. The extracted elements are returned to the frontend
4. When the user requests a download, the `/api/generate-project` endpoint creates the Playwright project

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Playwright](https://playwright.dev/) for the amazing test automation framework
- [Cheerio](https://cheerio.js.org/) for HTML parsing capabilities
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components

---

Built with ❤️ by [Your Name]
