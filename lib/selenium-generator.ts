export function generateSeleniumTest(url: string, elements: any[]): string {
  // Create a basic test structure following Selenium best practices
  let test = `import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import java.time.Duration;

/**
* Automated test generated for ${url}
* Generated on: ${new Date().toISOString()}
*/
public class WebsiteTest {
  private WebDriver driver;
  private WebDriverWait wait;

  @Before
  public void setUp() {
    // Set up ChromeDriver path (update this for your environment)
    System.setProperty("webdriver.chrome.driver", "path/to/chromedriver");
    
    // Initialize the WebDriver
    driver = new ChromeDriver();
    wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    
    // Maximize the browser window
    driver.manage().window().maximize();
  }

  @Test
  public void testWebsiteFunctionality() {
    // Navigate to the website
    driver.get("${url}");
    
    // Verify the page loaded
    assert driver.getCurrentUrl().equals("${url}");
    
    // Element declarations - ready to be used in your tests
`

  // Add element declarations for each element
  elements.forEach((element, index) => {
    test += `    // Element ${index + 1}: ${element.type}
`

    switch (element.type) {
      case "button":
        if (element.text) {
          test += `    By ${getJavaElementVariableName(element, index)}Locator = By.xpath("//*[contains(text(),'${element.text.replace(/'/g, "\\'")}')]");
    WebElement ${getJavaElementVariableName(element, index)} = wait.until(ExpectedConditions.elementToBeClickable(${getJavaElementVariableName(element, index)}Locator));
`
        } else {
          test += `    By ${getJavaElementVariableName(element, index)}Locator = By.cssSelector("${element.selector.replace(/"/g, '\\"')}");
    WebElement ${getJavaElementVariableName(element, index)} = wait.until(ExpectedConditions.elementToBeClickable(${getJavaElementVariableName(element, index)}Locator));
`
        }
        break

      case "link":
        if (element.text) {
          test += `    By ${getJavaElementVariableName(element, index)}Locator = By.linkText("${element.text.replace(/"/g, '\\"')}");
    WebElement ${getJavaElementVariableName(element, index)} = wait.until(ExpectedConditions.elementToBeClickable(${getJavaElementVariableName(element, index)}Locator));
`
        } else {
          test += `    By ${getJavaElementVariableName(element, index)}Locator = By.cssSelector("${element.selector.replace(/"/g, '\\"')}");
    WebElement ${getJavaElementVariableName(element, index)} = wait.until(ExpectedConditions.elementToBeClickable(${getJavaElementVariableName(element, index)}Locator));
`
        }
        break

      case "input":
        test += `    By ${getJavaElementVariableName(element, index)}Locator = By.cssSelector("${element.selector.replace(/"/g, '\\"')}");
    WebElement ${getJavaElementVariableName(element, index)} = wait.until(ExpectedConditions.visibilityOfElementLocated(${getJavaElementVariableName(element, index)}Locator));
`
        break

      default:
        test += `    By ${getJavaElementVariableName(element, index)}Locator = By.cssSelector("${element.selector.replace(/"/g, '\\"')}");
    WebElement ${getJavaElementVariableName(element, index)} = wait.until(ExpectedConditions.visibilityOfElementLocated(${getJavaElementVariableName(element, index)}Locator));
`
    }
  })

  // Close the test
  test += `
    // TODO: Add your test steps here using the declared elements
  }

  @After
  public void tearDown() {
    // Close the browser
    if (driver != null) {
      driver.quit();
    }
  }
}
`

  return test
}

export function generateSeleniumPageObjectModel(page: any): string {
  const pageName = page.title || page.path || "Page"
  const pageClass = pascalCase(pageName.replace(/[^a-zA-Z0-9]/g, " "))

  return `import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

/**
* Page Object Model for ${pageName} (${page.path})
* URL: ${page.url}
* Generated on: ${new Date().toISOString()}
*/
public class ${pageClass}Page {
  private WebDriver driver;
  private WebDriverWait wait;
  private String url = "${page.url}";
  
  public ${pageClass}Page(WebDriver driver) {
    this.driver = driver;
    this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
  }
  
  public void navigate() {
    driver.get(url);
  }
  
  // Element locators
${generateSeleniumLocators(page.elements)}
  
  // Element getters
${generateSeleniumGetters(page.elements)}
}
`
}

function generateSeleniumLocators(elements: any[] = []): string {
  if (!elements || elements.length === 0) {
    return "  // No interactive elements were mapped for this page"
  }

  return elements
    .map((element, index) => {
      const name = generateElementName(element, index)
      const locatorType = getSeleniumLocatorType(element)
      const locatorValue = getSeleniumLocatorValue(element)

      return `  private By ${name}Locator = By.${locatorType}("${locatorValue.replace(/"/g, '\\"')}");`
    })
    .join("\n")
}

function generateSeleniumGetters(elements: any[] = []): string {
  if (!elements || elements.length === 0) {
    return ""
  }

  let getters = ""

  elements.forEach((element, index) => {
    const name = generateElementName(element, index)
    getters += `
  public WebElement get${pascalCase(name)}() {
    return wait.until(ExpectedConditions.visibilityOfElementLocated(${name}Locator));
  }`
  })

  return getters
}

function getSeleniumLocatorType(element: any): string {
  if (element.selector.startsWith("#")) {
    return "id"
  } else if (element.selector.startsWith(".")) {
    return "className"
  } else if (element.type === "link" && element.text) {
    return "linkText"
  } else {
    return "cssSelector"
  }
}

function getSeleniumLocatorValue(element: any): string {
  if (element.selector.startsWith("#")) {
    return element.selector.substring(1)
  } else if (element.selector.startsWith(".")) {
    return element.selector.substring(1)
  } else if (element.type === "link" && element.text) {
    return element.text
  } else {
    return element.selector
  }
}

// Improved function to generate Java-friendly variable names
function getJavaElementVariableName(element: any, index: number): string {
  let name = ""

  switch (element.type) {
    case "button":
      if (element.text) {
        // Truncate and clean button text
        const cleanText = truncateAndCleanText(element.text, 20)
        name = `button${cleanText}`
      } else {
        name = `button${index}`
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
        name = `heading${element.level}${cleanText}`
      } else {
        name = `heading${element.level || ""}${index}`
      }
      break
    case "checkbox":
      if (element.name) {
        const cleanName = truncateAndCleanText(element.name, 15)
        name = `checkbox${cleanName}`
      } else {
        name = `checkbox${index}`
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
        name = `dropdown${cleanName}`
      } else {
        name = `dropdown${index}`
      }
      break
    default:
      name = `element${index}`
  }

  // Make sure the name is valid Java identifier
  name = name.replace(/[^a-zA-Z0-9]/g, "")

  // Ensure first character is lowercase for Java convention
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

// Helper functions for string manipulation
function pascalCase(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, "")
}

function camelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
    .replace(/\s+/g, "")
}
