export function generateCypressTest(url: string, elements: any[]): string {
  // Create a basic test structure following Cypress best practices
  let test = `/**
* Automated test generated for ${url}
* Generated on: ${new Date().toISOString()}
*/

describe('Website Functionality', () => {
  beforeEach(() => {
    // Visit the website before each test
    cy.visit('${url}')
    
    // Verify the page loaded
    cy.url().should('eq', '${url}')
  })

  it('should interact with page elements', () => {
    // Element declarations - ready to be used in your tests
`

  // Add element declarations for each element
  elements.forEach((element, index) => {
    test += `    // Element ${index + 1}: ${element.type}
`

    switch (element.type) {
      case "button":
        if (element.text) {
          test += `    const ${getElementVariableName(element, index)} = () => cy.contains('button', '${element.text.replace(/'/g, "\\'")}');
`
        } else {
          test += `    const ${getElementVariableName(element, index)} = () => cy.get('${element.selector.replace(/'/g, "\\'")}');
`
        }
        break

      case "link":
        if (element.text) {
          test += `    const ${getElementVariableName(element, index)} = () => cy.contains('a', '${element.text.replace(/'/g, "\\'")}');
`
        } else {
          test += `    const ${getElementVariableName(element, index)} = () => cy.get('${element.selector.replace(/'/g, "\\'")}');
`
        }
        break

      case "input":
        test += `    const ${getElementVariableName(element, index)} = () => cy.get('${element.selector.replace(/'/g, "\\'")}');
`
        break

      case "dropdown":
        test += `    const ${getElementVariableName(element, index)} = () => cy.get('${element.selector.replace(/'/g, "\\'")}');
`
        break

      default:
        test += `    const ${getElementVariableName(element, index)} = () => cy.get('${element.selector.replace(/'/g, "\\'")}');
`
    }
  })

  // Close the test
  test += `
    // TODO: Add your test steps here using the declared elements
  })
})
`

  return test
}

export function generateCypressPageObjectModel(page: any): string {
  const pageName = page.title || page.path || "Page"
  const pageClass = pascalCase(pageName.replace(/[^a-zA-Z0-9]/g, " "))

  return `/**
* Page Object Model for ${pageName} (${page.path})
* URL: ${page.url}
* Generated on: ${new Date().toISOString()}
*/
class ${pageClass}Page {
  // Page URL
  url = '${page.url}'
  
  // Element selectors
${generateCypressSelectors(page.elements)}
  
  // Visit the page
  visit() {
    cy.visit(this.url)
    return this
  }
  
  // Element getters
${generateCypressGetters(page.elements)}
}

export default ${pageClass}Page
`
}

function generateCypressSelectors(elements: any[] = []): string {
  if (!elements || elements.length === 0) {
    return "  // No interactive elements were mapped for this page"
  }

  return elements
    .map((element, index) => {
      const name = generateElementName(element, index)
      return `  ${name}Selector = '${element.selector.replace(/'/g, "\\'")}'`
    })
    .join("\n")
}

function generateCypressGetters(elements: any[] = []): string {
  if (!elements || elements.length === 0) {
    return ""
  }

  let getters = ""

  elements.forEach((element, index) => {
    const name = generateElementName(element, index)
    getters += `
  get ${name}() {
    return cy.get(this.${name}Selector)
  }`
  })

  return getters
}

// Helper function to generate element names for page object models
function generateElementName(element: any, index: number): string {
  switch (element.type) {
    case "button":
      if (element.text) {
        const cleanText = truncateAndCleanText(element.text, 20)
        return camelCase(`${cleanText} button`)
      }
      return camelCase(`button ${index}`)
    case "link":
      if (element.text) {
        const cleanText = truncateAndCleanText(element.text, 20)
        return camelCase(`${cleanText} link`)
      }
      return camelCase(`link ${index}`)
    case "input":
      const inputName = element.name || element.id || element.placeholder || ""
      if (inputName) {
        const cleanName = truncateAndCleanText(inputName, 15)
        return camelCase(`${cleanName} ${element.inputType || "input"}`)
      }
      return camelCase(`${element.inputType || "input"} ${index}`)
    case "checkbox":
      if (element.name) {
        const cleanName = truncateAndCleanText(element.name, 15)
        return camelCase(`${cleanName} checkbox`)
      }
      return camelCase(`checkbox ${index}`)
    case "radio":
      if (element.name) {
        const cleanName = truncateAndCleanText(element.name, 15)
        return camelCase(`${cleanName} radio`)
      }
      return camelCase(`radio ${index}`)
    case "dropdown":
      if (element.name) {
        const cleanName = truncateAndCleanText(element.name, 15)
        return camelCase(`${cleanName} dropdown`)
      }
      return camelCase(`dropdown ${index}`)
    case "form":
      if (element.id) {
        const cleanId = truncateAndCleanText(element.id, 15)
        return camelCase(`${cleanId} form`)
      }
      return camelCase(`form ${index}`)
    case "interactive":
      if (element.role) {
        return camelCase(`${element.role} element`)
      }
      return camelCase(`interactive element ${index}`)
    default:
      return camelCase(`${element.type} element ${index}`)
  }
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
