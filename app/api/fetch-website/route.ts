import { type NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Fetch the website content
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch website: ${response.statusText}` },
        { status: response.status },
      )
    }

    const html = await response.text()

    // Parse the HTML and extract elements
    const $ = cheerio.load(html)
    const elements: any[] = []

    // Extract buttons
    $('button, [role="button"], input[type="button"], input[type="submit"]').each((i, el) => {
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

    // Extract inputs
    $("input, textarea, select").each((i, el) => {
      const $el = $(el)
      elements.push({
        type: "input",
        inputType: $el.attr("type") || "text",
        name: $el.attr("name"),
        id: $el.attr("id"),
        placeholder: $el.attr("placeholder"),
        selector: getSelector($, el),
        attributes: getAttributes($el),
      })
    })

    // Extract headings
    $("h1, h2, h3, h4, h5, h6").each((i, el) => {
      const $el = $(el)
      elements.push({
        type: "heading",
        level: el.name.substring(1),
        text: $el.text().trim(),
        selector: getSelector($, el),
        attributes: getAttributes($el),
      })
    })

    return NextResponse.json({ elements })
  } catch (error) {
    console.error("Error fetching website:", error)
    return NextResponse.json({ error: "Failed to fetch and parse website" }, { status: 500 })
  }
}

// Helper function to get attributes
function getAttributes($el: cheerio.Cheerio) {
  const attributes: Record<string, string> = {}
  Object.entries($el.attr()).forEach(([key, value]) => {
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

  // Try to get by role and name
  const role = $el.attr("role")
  const name = $el.text().trim() || $el.attr("name") || $el.attr("placeholder")
  if (role && name) return `[role="${role}"][name="${name}"]`

  // Try to get by test ID
  const testId = $el.attr("data-testid") || $el.attr("data-test-id")
  if (testId) return `[data-testid="${testId}"]`

  // Fallback to tag and classes
  const tag = element.name
  const classes = $el.attr("class")
  if (classes) return `${tag}.${classes.replace(/\s+/g, ".")}`

  return tag
}
