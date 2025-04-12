import { type NextRequest, NextResponse } from "next/server"
import JSZip from "jszip"
import { generateCypressTest, generateCypressPageObjectModel } from "@/lib/cypress-generator"
import { generateSeleniumTest, generateSeleniumPageObjectModel } from "@/lib/selenium-generator"

// Helper functions for string manipulation
function camelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
    .replace(/\s+/g, "")
}

function pascalCase(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, "")
}

function generateSafeFilename(path: string, index: number): string {
  // Remove leading and trailing slashes
  let filename = path.replace(/^\/|\/$/g, "")

  // Replace slashes with dashes
  filename = filename.replace(/\//g, "-")

  // Replace special characters
  filename = filename.replace(/[^a-zA-Z0-9-_]/g, "")

  // Use a default name if empty
  if (!filename) {
    filename = index === 0 ? "home" : `page-${index}`
  }

  return filename
}

function generateTestFile(page: any): string {
  const pageName = page.title || page.path || "Page"
  const pageVar = camelCase(pageName.replace(/[^a-zA-Z0-9]/g, " "))
  const pageClass = pascalCase(pageName.replace(/[^a-zA-Z0-9]/g, " "))
  const filename = generateSafeFilename(page.path, 0)

  return `import { test, expect } from '@playwright/test';
import { ${pageClass}Page } from '../page-objects/${filename}';

/**
* Test file for ${pageName} (${page.path})
* URL: ${page.url}
* Generated on: ${new Date().toISOString()}
*/

test.describe('${pageName} Page Tests', () => {
  let ${pageVar}Page: ${pageClass}Page;

  test.beforeEach(async ({ page }) => {
    ${pageVar}Page = new ${pageClass}Page(page);
    await ${pageVar}Page.goto();
  });

  test('should load ${pageName} page correctly', async ({ page }) => {
    // Verify page URL
    await expect(page).toHaveURL(${pageVar}Page.url);
    
    // Verify page title
    ${page.title ? `await expect(page).toHaveTitle('${page.title.replace(/'/g, "\\'")}');` : "// TODO: Add title verification"}
  });
});
`
}

function generateConfigFile(url: string): string {
  return `import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: '${url}',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { }
    },
    {
      name: 'firefox',
      use: { }
    },
    {
      name: 'webkit',
      use: { }
    },
  ],
});
`
}

function generatePageObjectModel(page: any): string {
  const pageName = page.title || page.path || "Page"
  const pageClass = pascalCase(pageName.replace(/[^a-zA-Z0-9]/g, " "))

  return `import { Page, Locator } from '@playwright/test';

/**
* Page Object Model for ${pageName} (${page.path})
* URL: ${page.url}
* Generated on: ${new Date().toISOString()}
*/
export class ${pageClass}Page {
  readonly page: Page;
  readonly url: string = '${page.url}';
  
  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.url);
  }
}
`
}

// Update the POST function to handle different frameworks
export async function POST(request: NextRequest) {
  try {
    const { url, pages, framework = "playwright" } = await request.json()

    if (!url || !pages || !Array.isArray(pages)) {
      return new NextResponse("URL and pages are required", { status: 400 })
    }

    // Create a new zip file
    const zip = new JSZip()

    // Generate project based on selected framework
    switch (framework) {
      case "playwright":
        generatePlaywrightProject(zip, url, pages)
        break
      case "cypress":
        generateCypressProject(zip, url, pages)
        break
      case "selenium":
        generateSeleniumProject(zip, url, pages)
        break
      default:
        generatePlaywrightProject(zip, url, pages)
    }

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" })

    // Return the zip file
    return new NextResponse(zipBlob, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=${framework}-project.zip`,
      },
    })
  } catch (error) {
    console.error("Error generating project:", error)
    return new NextResponse(error instanceof Error ? error.message : "Failed to generate project", { status: 500 })
  }
}

// Function to generate Playwright project
function generatePlaywrightProject(zip: JSZip, url: string, pages: any[]) {
  // Create tests directory
  const testsDir = zip.folder("tests")

  // Generate test files for each page
  pages.forEach((page, index) => {
    // Generate a safe filename from the page path
    const filename = generateSafeFilename(page.path, index)
    testsDir?.file(`${filename}.spec.ts`, generateTestFile(page))
  })

  // Add project configuration files
  zip.file("playwright.config.ts", generateConfigFile(url))
  zip.file("package.json", generatePackageJson("playwright"))
  zip.file("README.md", generateReadme(url, pages, "playwright"))

  // Add page object models directory and files
  const pomDir = zip.folder("page-objects")
  pages.forEach((page, index) => {
    const filename = generateSafeFilename(page.path, index)
    pomDir?.file(`${filename}.ts`, generatePageObjectModel(page))
  })
}

// Function to generate Cypress project
function generateCypressProject(zip: JSZip, url: string, pages: any[]) {
  // Create cypress directory structure
  const cypressDir = zip.folder("cypress")
  const e2eDir = cypressDir?.folder("e2e")
  const supportDir = cypressDir?.folder("support")
  const pagesDir = supportDir?.folder("pages")

  // Generate test files for each page
  pages.forEach((page, index) => {
    // Generate a safe filename from the page path
    const filename = generateSafeFilename(page.path, index)
    e2eDir?.file(`${filename}.cy.js`, generateCypressTest(page.url, page.elements))
  })

  // Add page object models
  pages.forEach((page, index) => {
    const filename = generateSafeFilename(page.path, index)
    pagesDir?.file(`${filename}.js`, generateCypressPageObjectModel(page))
  })

  // Add Cypress configuration files
  zip.file("cypress.config.js", generateCypressConfigFile(url))
  zip.file("package.json", generatePackageJson("cypress"))
  zip.file("README.md", generateReadme(url, pages, "cypress"))

  // Add support file
  supportDir?.file(
    "e2e.js",
    `// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
`,
  )

  // Add commands file
  supportDir?.file(
    "commands.js",
    `// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
`,
  )
}

// Function to generate Selenium project
function generateSeleniumProject(zip: JSZip, url: string, pages: any[]) {
  // Create src directory structure
  const srcDir = zip.folder("src")
  const testDir = srcDir?.folder("test")
  const mainDir = srcDir?.folder("main")
  const pagesDir = mainDir?.folder("java").folder("pages")

  // Generate test files for each page
  pages.forEach((page, index) => {
    // Generate a safe filename from the page path
    const filename = generateSafeFilename(page.path, index)
    const className = pascalCase(filename)
    testDir?.file(`${className}Test.java`, generateSeleniumTest(page.url, page.elements))
  })

  // Add page object models
  pages.forEach((page, index) => {
    const filename = generateSafeFilename(page.path, index)
    const className = pascalCase(filename)
    pagesDir?.file(`${className}Page.java`, generateSeleniumPageObjectModel(page))
  })

  // Add Maven configuration files
  zip.file("pom.xml", generateMavenPomFile())
  zip.file("README.md", generateReadme(url, pages, "selenium"))
}

function generateCypressConfigFile(baseUrl: string): string {
  return `const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: '${baseUrl}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
`
}

function generateMavenPomFile(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.elementforge</groupId>
    <artifactId>selenium-tests</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <selenium.version>4.10.0</selenium.version>
        <junit.version>4.13.2</junit.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>\${selenium.version}</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>\${junit.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.0.0-M5</version>
            </plugin>
        </plugins>
    </build>
</project>
`
}

// Update the package.json generator to handle different frameworks
function generatePackageJson(framework: string): string {
  switch (framework) {
    case "playwright":
      return `{
  "name": "playwright-page-tests",
  "version": "1.0.0",
  "description": "Playwright tests organized by page",
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "report": "playwright show-report"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@types/node": "^20.10.0"
  }
}
`
    case "cypress":
      return `{
  "name": "cypress-page-tests",
  "version": "1.0.0",
  "description": "Cypress tests organized by page",
  "scripts": {
    "test": "cypress run",
    "test:open": "cypress open"
  },
  "devDependencies": {
    "cypress": "^13.3.0"
  }
}
`
    case "selenium":
      return `{
  "name": "selenium-page-tests",
  "version": "1.0.0",
  "description": "Selenium tests organized by page",
  "scripts": {
    "test": "mvn test"
  }
}
`
    default:
      return `{
  "name": "test-automation",
  "version": "1.0.0",
  "description": "Automated tests",
  "scripts": {
    "test": "echo \\"Please run tests using the appropriate framework command\\""
  }
}
`
  }
}

// Update the README generator to handle different frameworks
function generateReadme(url: string, pages: any[], framework: string): string {
  const title = framework.charAt(0).toUpperCase() + framework.slice(1)

  let content = `# ${title} Interactive Elements Tests

This project contains ${title} test files organized by page for ${url}.

## Project Structure
`

  switch (framework) {
    case "playwright":
      content += `
- \`tests/\`: Test files organized by page
- \`page-objects/\`: Page Object Models for each page
- \`playwright.config.ts\`: Playwright configuration

## Pages Mapped

${pages.map((page) => `- ${page.title || page.path}`).join("\n")}

## Getting Started

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Install Playwright browsers:
   \`\`\`
   npx playwright install
   \`\`\`

3. Run the tests:
   \`\`\`
   npm test
   \`\`\`

4. View the report:
   \`\`\`
   npm run report
   \`\`\`

## Learn More

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Page Object Models](https://playwright.dev/docs/pom)
- [Test Organization](https://playwright.dev/docs/test-projects)
`
      break
    case "cypress":
      content += `
- \`cypress/e2e/\`: Test files organized by page
- \`cypress/support/pages/\`: Page Object Models for each page
- \`cypress.config.js\`: Cypress configuration

## Pages Mapped

${pages.map((page) => `- ${page.title || page.path}`).join("\n")}

## Getting Started

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Run the tests in headless mode:
   \`\`\`
   npm test
   \`\`\`

3. Open Cypress Test Runner:
   \`\`\`
   npm run test:open
   \`\`\`

## Learn More

- [Cypress Documentation](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)
`
      break
    case "selenium":
      content += `
- \`src/test/\`: Test files organized by page
- \`src/main/java/pages/\`: Page Object Models for each page
- \`pom.xml\`: Maven configuration

## Pages Mapped

${pages.map((page) => `- ${page.title || page.path}`).join("\n")}

## Getting Started

1. Make sure you have Java 11+ and Maven installed

2. Update the ChromeDriver path in the test files to match your environment

3. Run the tests:
   \`\`\`
   mvn test
   \`\`\`

## Learn More

- [Selenium Documentation](https://www.selenium.dev/documentation/)
- [Page Object Model](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)
- [WebDriver](https://www.selenium.dev/documentation/webdriver/)
`
      break
  }

  content += `
## Interactive Elements

This project focuses on mapping and testing interactive elements that users can interact with:
- Buttons and clickable elements
- Links
- Form inputs (text fields, textareas)
- Checkboxes
- Radio buttons
- Dropdown menus
- Forms
- Other interactive elements with ARIA roles

## Generated by ElementForge AI

This test project was automatically generated by ElementForge AI, which analyzed the website and created appropriate test files and page objects.
`

  return content
}
