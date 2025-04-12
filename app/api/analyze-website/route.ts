import { type NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"
import crypto from "crypto"
import { getPagesLimit } from "@/lib/plans"

export async function POST(request: NextRequest) {
  try {
    const { url, user } = await request.json()

    if (!url) {
      return new NextResponse("URL is required", { status: 400 })
    }

    // Validate URL
    let baseUrl: URL
    try {
      baseUrl = new URL(url)
    } catch (e) {
      return new NextResponse("Invalid URL format", { status: 400 })
    }

    // Get the page limit based on user's plan
    const pageLimit = getPagesLimit(user)

    // Analyze the main page
    const mainPage = await analyzePage(url)
    const pages = [mainPage]

    // If user is on free plan, only analyze the main page
    if (pageLimit <= 1) {
      return NextResponse.json({ pages })
    }

    // Track processed URLs and page fingerprints to avoid duplicates
    const processedUrls = new Set<string>([url])
    const pageFingerprints = new Set<string>([generatePageFingerprint(mainPage)])

    // Extract links from the main page
    const links = new Set<string>()

    // Process links from the main page
    mainPage.elements.forEach((element: any) => {
      if (element.type === "link" && element.href) {
        try {
          // Normalize the URL
          let fullUrl: string

          // Handle relative URLs
          if (element.href.startsWith("/")) {
            fullUrl = `${baseUrl.origin}${element.href}`
          } else if (!element.href.startsWith("http")) {
            // Handle URLs without protocol
            if (element.href.startsWith("//")) {
              fullUrl = `${baseUrl.protocol}${element.href}`
            } else {
              // Handle relative paths without leading slash
              const basePath = baseUrl.pathname.endsWith("/")
                ? baseUrl.pathname
                : baseUrl.pathname.substring(0, baseUrl.pathname.lastIndexOf("/") + 1)
              fullUrl = `${baseUrl.origin}${basePath}${element.href}`
            }
          } else {
            fullUrl = element.href
          }

          // Check if the link is from the same domain
          const linkUrl = new URL(fullUrl)
          if (linkUrl.hostname === baseUrl.hostname && !processedUrls.has(fullUrl)) {
            links.add(fullUrl)
          }
        } catch (e) {
          console.error(`Error processing link ${element.href}:`, e)
        }
      }
    })

    // Analyze each linked page (up to the user's plan limit)
    let processedCount = 0
    const MAX_PAGES = Math.min(pageLimit - 1, 20) // Subtract 1 for the main page, cap at 20 for performance

    for (const link of links) {
      if (processedCount >= MAX_PAGES) break
      if (processedUrls.has(link)) continue

      try {
        processedUrls.add(link)
        const page = await analyzePage(link)

        // Generate a fingerprint for the page to detect duplicates
        const fingerprint = generatePageFingerprint(page)

        // Only add the page if it's not a duplicate
        if (!pageFingerprints.has(fingerprint)) {
          pageFingerprints.add(fingerprint)
          pages.push(page)
          processedCount++
        }
      } catch (error) {
        console.error(`Error analyzing page ${link}:`, error)
      }
    }

    return NextResponse.json({ pages })
  } catch (error) {
    console.error("Error analyzing website:", error)
    return new NextResponse(error instanceof Error ? error.message : "Failed to analyze website", { status: 500 })
  }
}

// Generate a fingerprint for a page based on its interactive elements
function generatePageFingerprint(page: any): string {
  // Create a simplified representation of the page's interactive elements
  const elementSignatures = page.elements
    .map((element: any) => {
      return `${element.type}:${element.selector}`
    })
    .sort()
    .join("|")

  // Create a hash of the element signatures
  return crypto.createHash("md5").update(elementSignatures).digest("hex")
}

async function analyzePage(url: string) {
  try {
    // Fetch the page
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`)
    }

    const html = await response.text()

    // Parse the HTML
    const $ = cheerio.load(html)

    // Extract page info
    const title = $("title").text().trim()
    const path = new URL(url).pathname || "/"

    // Extract only interactive elements
    const elements = []

    // Extract buttons and clickable elements
    $(
      "button, [role='button'], input[type='button'], input[type='submit'], [onclick], [data-click], [data-action]",
    ).each((i, el) => {
      const $el = $(el)
      elements.push({
        type: "button",
        text: $el.text().trim(),
        selector: getSelector($, el),
        attributes: getAttributes($el),
      })
    })

    // Extract links
    $("a").each((i, el) => {
      const $el = $(el)
      elements.push({
        type: "link",
        text: $el.text().trim(),
        href: $el.attr("href"),
        selector: getSelector($, el),
        attributes: getAttributes($el),
      })
    })

    // Extract form inputs
    $("input:not([type='hidden']), textarea, select").each((i, el) => {
      const $el = $(el)
      const inputType = $el.attr("type") || "text"

      elements.push({
        type: "input",
        inputType,
        name: $el.attr("name"),
        id: $el.attr("id"),
        placeholder: $el.attr("placeholder"),
        selector: getSelector($, el),
        attributes: getAttributes($el),
      })
    })

    // Extract checkboxes and radio buttons specifically
    $("input[type='checkbox'], input[type='radio']").each((i, el) => {
      const $el = $(el)
      elements.push({
        type: $el.attr("type") === "checkbox" ? "checkbox" : "radio",
        name: $el.attr("name"),
        id: $el.attr("id"),
        value: $el.attr("value"),
        selector: getSelector($, el),
        attributes: getAttributes($el),
      })
    })

    // Extract dropdown menus
    $("select").each((i, el) => {
      const $el = $(el)
      const options = []

      $el.find("option").each((i, optEl) => {
        const $opt = $(optEl)
        options.push({
          value: $opt.attr("value"),
          text: $opt.text().trim(),
        })
      })

      elements.push({
        type: "dropdown",
        name: $el.attr("name"),
        id: $el.attr("id"),
        options,
        selector: getSelector($, el),
        attributes: getAttributes($el),
      })
    })

    // Extract forms
    $("form").each((i, el) => {
      const $el = $(el)
      elements.push({
        type: "form",
        id: $el.attr("id"),
        action: $el.attr("action"),
        method: $el.attr("method"),
        selector: getSelector($, el),
        attributes: getAttributes($el),
      })
    })

    // Extract interactive elements with ARIA roles
    $("[role='menu'], [role='menuitem'], [role='tab'], [role='combobox'], [role='slider'], [role='switch']").each(
      (i, el) => {
        const $el = $(el)
        elements.push({
          type: "interactive",
          role: $el.attr("role"),
          text: $el.text().trim(),
          selector: getSelector($, el),
          attributes: getAttributes($el),
        })
      },
    )

    return {
      url,
      path,
      title,
      elements,
    }
  } catch (error) {
    console.error(`Error analyzing page ${url}:`, error)
    throw error
  }
}

// Helper function to get attributes
function getAttributes($el: cheerio.Cheerio) {
  const attributes: Record<string, string> = {}
  const attribs = $el.get(0)?.attribs || {}

  Object.entries(attribs).forEach(([key, value]) => {
    if (value) attributes[key] = value
  })

  return attributes
}

// Helper function to generate a selector
function getSelector($: cheerio.CheerioAPI, element: cheerio.Element): string {
  const $el = $(element)

  // Try to get by ID
  const id = $el.attr("id")
  if (id) return `#${id}`

  // Try to get by test ID
  const testId = $el.attr("data-testid") || $el.attr("data-test-id")
  if (testId) return `[data-testid="${testId}"]`

  // Try to get by name attribute
  const name = $el.attr("name")
  if (name) return `[name="${name}"]`

  // Try to get by role and accessible name
  const role = $el.attr("role")
  const ariaLabel = $el.attr("aria-label")
  if (role && ariaLabel) return `[role="${role}"][aria-label="${ariaLabel}"]`

  // Try to get by placeholder for inputs
  const placeholder = $el.attr("placeholder")
  if (placeholder) return `[placeholder="${placeholder}"]`

  // Fallback to tag and classes
  const tag = element.name
  const classes = $el.attr("class")
  if (classes) {
    const cleanClasses = classes.split(/\s+/).filter(Boolean).join(".")
    return `${tag}.${cleanClasses}`
  }

  return tag
}
