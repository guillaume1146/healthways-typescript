import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimit } from '@/lib/rate-limit'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct'

/**
 * POST /api/ai/health-tracker/food-scan - Identify food from an image using Groq VLM
 */
export async function POST(request: NextRequest) {
  const limited = rateLimit(request, { limit: 5, windowMs: 60_000, prefix: 'food-scan' })
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, message: 'AI service not configured' }, { status: 503 })
    }

    const body = await request.json()
    const { imageBase64 } = body

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, message: 'imageBase64 is required' },
        { status: 400 }
      )
    }

    // Ensure the base64 has the data URI prefix
    const imageUrl = imageBase64.startsWith('data:')
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_VISION_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: imageUrl },
              },
              {
                type: 'text',
                text: `Identify this food. Return ONLY a valid JSON object with these fields:
{
  "name": "name of the food/dish",
  "description": "brief description of what you see",
  "estimatedCalories": estimated calories per serving (number),
  "estimatedProtein": estimated protein in grams (number),
  "estimatedCarbs": estimated carbs in grams (number),
  "estimatedFat": estimated fat in grams (number),
  "confidence": "high" or "medium" or "low"
}
If you see multiple items on a plate, describe the whole meal as one entry. Be as accurate as possible with nutritional estimates. Return ONLY the JSON, no markdown or explanation.`,
              },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 512,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Groq Vision API error:', response.status, errorBody)
      return NextResponse.json(
        { success: false, message: 'AI vision service error' },
        { status: 502 }
      )
    }

    const data = await response.json()
    const rawContent = data.choices?.[0]?.message?.content?.trim()

    if (!rawContent) {
      return NextResponse.json(
        { success: false, message: 'No response from AI vision service' },
        { status: 502 }
      )
    }

    // Parse JSON from the response (handle potential markdown wrapping)
    let parsed
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0])
      } else {
        parsed = JSON.parse(rawContent)
      }
    } catch {
      // If parsing fails, return raw text as description
      parsed = {
        name: 'Unknown food',
        description: rawContent,
        estimatedCalories: 0,
        estimatedProtein: 0,
        estimatedCarbs: 0,
        estimatedFat: 0,
        confidence: 'low',
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        name: parsed.name || 'Unknown food',
        description: parsed.description || '',
        calories: Math.round(parsed.estimatedCalories || 0),
        protein: Math.round(parsed.estimatedProtein || 0),
        carbs: Math.round(parsed.estimatedCarbs || 0),
        fat: Math.round(parsed.estimatedFat || 0),
        confidence: parsed.confidence || 'low',
      },
    })
  } catch (error) {
    console.error('POST /api/ai/health-tracker/food-scan error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
