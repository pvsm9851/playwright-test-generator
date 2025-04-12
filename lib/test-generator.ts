export function generatePlaywrightTest(url: string, elements: any[]): string {
  // Create a basic test structure following Playwright best practices
  let test = `import { test, expect } from '@playwright/test';

/**
* Automated test generated for ${url}
* Generated on: ${new Date().toISOString()}
*/

test('Test website functionality', async ({ page }) => {
  // Navigate to the website
  await page.goto('${url}');
  
  // Verify the page loaded
  await expect(page).toHaveURL('${url}');

  // Element declarations - ready to be used in your tests
`

  // Add element declarations for each element
  elements.forEach((element, index) => {
    test += `
  // Element ${index + 1}: ${element.type}
`

    switch (element.type) {
      case "button":
        if (element.text) {
          test += `  const ${getElementVariableName(element, index)} = page.getByRole('button', { name: '${element.text.replace(/'/g, "\\'")}' });
`
        } else {
          test += `  const ${getElementVariableName(element, index)} = page.locator('${element.selector.replace(/'/g, "\\'")}');
`
        }
        break

      case "link":
        if (element.text) {
          test += `  const ${getElementVariableName(element, index)} = page.getByRole('link', { name: '${element.text.replace(/'/g, "\\'")}' });
`
        } else {
          test += `  const ${getElementVariableName(element, index)} = page.locator('${element.selector.replace(/'/g, "\\'")}');
`
        }
        break

      case "input":
        const inputName = element.name || element.id || element.placeholder || ""
        if (inputName) {
          if (element.inputType === "checkbox" || element.inputType === "radio") {
            test += `  const ${getElementVariableName(element, index)} = page.getByLabel('${inputName.replace(/'/g, "\\'")}');
`
          } else {
            test += `  const ${getElementVariableName(element, index)} = page.getByLabel('${inputName.replace(/'/g, "\\'")}');
`
          }
        } else {
          test += `  const ${getElementVariableName(element, index)} = page.locator('${element.selector.replace(/'/g, "\\'")}');
`
        }
        break

      case "heading":
        test += `  const ${getElementVariableName(element, index)} = page.locator('h${element.level}').filter({ hasText: '${element.text.replace(/'/g, "\\'")}' });
`
        break

      default:
        test += `  const ${getElementVariableName(element, index)} = page.locator('${element.selector.replace(/'/g, "\\'")}');
`
    }
  })

  // Close the test
  test += `
  // TODO: Add your test steps here using the declared elements
});
`

  return test
}

// Helper function to generate variable names for elements
function getElementVariableName(element: any, index: number): string {
  let name = ""

  switch (element.type) {
    case "button":
      if (element.text) {
        // Truncate and clean button text
        const cleanText = truncateAndCleanText(element.text, 20)
        name = `btn${cleanText}`
      } else {
        name = `btn${index}`
      }
      break
    case "link":
      if (element.text) {
        // Truncate and clean link text
        const cleanText = truncateAndCleanText(element.text, 20)
        name = `link${cleanText}`
      } else {
        name = `link${index}`
      }
      break
    case "input":
      const inputName = element.name || element.id || element.placeholder || ""
      if (inputName) {
        const cleanName = truncateAndCleanText(inputName, 15)
        name = `${element.inputType || "input"}${cleanName}`
      } else {
        name = `${element.inputType || "input"}${index}`
      }
      break
    case "heading":
      if (element.text) {
        const cleanText = truncateAndCleanText(element.text, 20)
        name = `h${element.level}${cleanText}`
      } else {
        name = `h${element.level || ""}${index}`
      }
      break
    case "checkbox":
      if (element.name) {
        const cleanName = truncateAndCleanText(element.name, 15)
        name = `chk${cleanName}`
      } else {
        name = `chk${index}`
      }
      break
    case "radio":
      if (element.name) {
        const cleanName = truncateAndCleanText(element.name, 15)
        name = `radio${cleanName}`
      } else {
        name = `radio${index}`
      }
      break
    case "dropdown":
      if (element.name) {
        const cleanName = truncateAndCleanText(element.name, 15)
        name = `select${cleanName}`
      } else {
        name = `select${index}`
      }
      break
    default:
      name = `element${index}`
  }

  // Make sure the name is valid JavaScript identifier
  name = name.replace(/[^a-zA-Z0-9]/g, "")

  // Ensure first character is lowercase for JavaScript convention
  return name.charAt(0).toLowerCase() + name.slice(1)
}

// Helper function to truncate and clean text for variable names
function truncateAndCleanText(text: string, maxLength: number): string {
  // Remove special characters and spaces
  const cleanText = text.replace(/[^a-zA-Z0-9\s]/g, "").trim()

  // Split into words
  const words = cleanText.split(/\s+/)

  // Take only the first few words that fit within maxLength
  let result = ""
  for (const word of words) {
    if ((result + pascalCase(word)).length <= maxLength) {
      result += pascalCase(word)
    } else {
      break
    }
  }

  // If we have no result (perhaps all special chars), use a substring
  if (!result) {
    result = text.substring(0, maxLength).replace(/[^a-zA-Z0-9]/g, "")
  }

  return result
}

// Helper functions for string manipulation
function pascalCase(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, "")
}

function camelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
    .replace(/\s+/g, "")
}
