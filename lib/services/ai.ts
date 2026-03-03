import prisma from '@/lib/db'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'

interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface GroqResponse {
  id: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

interface PatientContext {
  firstName: string
  lastName: string
  bloodType: string
  allergies: string[]
  chronicConditions: string[]
  healthScore: number
  recentDiagnoses: string[]
  activeMedications: string[]
}

/**
 * Fetch patient health context from the database for personalized AI responses.
 */
async function getPatientContext(userId: string): Promise<PatientContext | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      patientProfile: {
        select: {
          bloodType: true,
          allergies: true,
          chronicConditions: true,
          healthScore: true,
          medicalRecords: {
            where: {
              date: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }, // last year
            },
            select: { diagnosis: true },
            orderBy: { date: 'desc' },
            take: 10,
          },
          prescriptions: {
            where: { isActive: true },
            select: {
              medicines: {
                select: {
                  medicine: { select: { name: true } },
                  dosage: true,
                  frequency: true,
                },
              },
            },
            take: 10,
          },
        },
      },
    },
  })

  if (!user || !user.patientProfile) return null

  const profile = user.patientProfile
  const recentDiagnoses = profile.medicalRecords
    .map(r => r.diagnosis)
    .filter((d): d is string => !!d)

  const activeMedications = profile.prescriptions.flatMap(p =>
    p.medicines.map(m => `${m.medicine.name} (${m.dosage}, ${m.frequency})`)
  )

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    bloodType: profile.bloodType,
    allergies: profile.allergies,
    chronicConditions: profile.chronicConditions,
    healthScore: profile.healthScore,
    recentDiagnoses,
    activeMedications,
  }
}

/**
 * Build the system prompt incorporating patient health context.
 */
function buildSystemPrompt(context: PatientContext): string {
  const conditionDietaryNotes: string[] = []

  for (const condition of context.chronicConditions) {
    const lower = condition.toLowerCase()
    if (lower.includes('diabetes') || lower.includes('diabetic')) {
      conditionDietaryNotes.push(
        'Patient has diabetes: recommend low glycemic index foods, limit added sugars, emphasize fiber-rich vegetables, whole grains, and lean proteins. Monitor carbohydrate intake.'
      )
    }
    if (lower.includes('hypertension') || lower.includes('high blood pressure')) {
      conditionDietaryNotes.push(
        'Patient has hypertension: recommend DASH diet principles, limit sodium to under 2300mg/day, increase potassium-rich foods (bananas, sweet potatoes, spinach), limit alcohol and caffeine.'
      )
    }
    if (lower.includes('cholesterol') || lower.includes('hyperlipidemia')) {
      conditionDietaryNotes.push(
        'Patient has high cholesterol: recommend heart-healthy fats (olive oil, nuts, fish), limit saturated fats and trans fats, increase soluble fiber intake (oats, beans, lentils).'
      )
    }
    if (lower.includes('asthma')) {
      conditionDietaryNotes.push(
        'Patient has asthma: recommend anti-inflammatory foods rich in omega-3 fatty acids, fruits and vegetables high in antioxidants. Avoid sulfites found in some preserved foods.'
      )
    }
    if (lower.includes('anemia')) {
      conditionDietaryNotes.push(
        'Patient has anemia: recommend iron-rich foods (red meat, spinach, lentils), pair with vitamin C for absorption, avoid tea/coffee with meals.'
      )
    }
    if (lower.includes('kidney') || lower.includes('renal')) {
      conditionDietaryNotes.push(
        'Patient has kidney concerns: may need to limit potassium, phosphorus, and sodium. Monitor protein intake. Recommend consulting a renal dietitian.'
      )
    }
    if (lower.includes('obesity') || lower.includes('overweight')) {
      conditionDietaryNotes.push(
        'Patient is managing weight: recommend portion control, calorie-aware eating, emphasis on whole foods, regular physical activity, and gradual sustainable changes.'
      )
    }
  }

  const allergyNote = context.allergies.length > 0
    ? `CRITICAL - Patient allergies: ${context.allergies.join(', ')}. NEVER recommend foods or supplements containing these allergens.`
    : 'No known food allergies.'

  const medicationNote = context.activeMedications.length > 0
    ? `Active medications: ${context.activeMedications.join('; ')}. Be aware of potential food-drug interactions.`
    : 'No active medications recorded.'

  const diagnosisNote = context.recentDiagnoses.length > 0
    ? `Recent diagnoses (past year): ${context.recentDiagnoses.join(', ')}.`
    : ''

  return `You are a helpful, knowledgeable AI Health Assistant for the Healthwyz healthcare platform in Mauritius. Your name is Healthwyz AI Assistant.

PATIENT PROFILE:
- Name: ${context.firstName} ${context.lastName}
- Blood Type: ${context.bloodType}
- Health Score: ${context.healthScore}/100
- ${allergyNote}
- Chronic Conditions: ${context.chronicConditions.length > 0 ? context.chronicConditions.join(', ') : 'None recorded'}
- ${medicationNote}
${diagnosisNote ? `- ${diagnosisNote}` : ''}

${conditionDietaryNotes.length > 0 ? 'CONDITION-SPECIFIC DIETARY GUIDANCE:\n' + conditionDietaryNotes.join('\n') : ''}

YOUR ROLE AND GUIDELINES:
1. Provide personalized wellness, diet, nutrition, and exercise recommendations based on the patient's health profile above.
2. Consider the patient's allergies, chronic conditions, and medications when making any food or supplement suggestions.
3. Tailor recommendations to Mauritian cuisine and locally available foods when relevant.
4. Always be supportive, encouraging, and non-judgmental.
5. Use clear, simple language that is easy to understand.
6. When discussing nutrition, provide specific food suggestions with approximate nutritional information when possible.
7. For exercise recommendations, consider the patient's health conditions and suggest safe, appropriate activities.

IMPORTANT SAFETY RULES:
- ALWAYS remind the patient to consult their doctor or healthcare provider before making significant changes to their diet, exercise routine, or medication.
- NEVER provide specific medical diagnoses or suggest changing, stopping, or starting medications.
- NEVER claim to replace professional medical advice.
- If the patient describes symptoms that could be serious or urgent, strongly advise them to contact their healthcare provider or emergency services immediately.
- You are a wellness and nutrition assistant, NOT a substitute for medical care.

Keep responses concise but thorough. Use markdown formatting for lists and emphasis when helpful.`
}

/**
 * Send a message to the AI assistant and get a response.
 * Creates a new session if sessionId is not provided.
 */
export async function chatWithAssistant(
  userId: string,
  message: string,
  sessionId?: string
): Promise<{
  response: string
  sessionId: string
  title: string
}> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not set')
  }

  // Get patient context for personalized responses
  const patientContext = await getPatientContext(userId)
  if (!patientContext) {
    throw new Error('Patient profile not found')
  }

  // Create or retrieve session
  let session: { id: string; title: string }
  if (sessionId) {
    const existing = await prisma.aiChatSession.findFirst({
      where: { id: sessionId, userId },
      select: { id: true, title: true },
    })
    if (!existing) {
      throw new Error('Chat session not found')
    }
    session = existing
  } else {
    session = await prisma.aiChatSession.create({
      data: { userId, title: 'New Chat' },
      select: { id: true, title: true },
    })
  }

  // Fetch previous messages for context (last 20)
  const previousMessages = await prisma.aiChatMessage.findMany({
    where: { sessionId: session.id },
    orderBy: { createdAt: 'asc' },
    take: 20,
    select: { role: true, content: true },
  })

  // Build the message array for the API call
  const systemPrompt = buildSystemPrompt(patientContext)
  const groqMessages: GroqMessage[] = [
    { role: 'system', content: systemPrompt },
    ...previousMessages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: message },
  ]

  // Call Groq API
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: groqMessages,
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.9,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error('Groq API error:', response.status, errorBody)
    throw new Error(`AI service error (${response.status}): ${response.statusText}`)
  }

  const data: GroqResponse = await response.json()
  const assistantMessage = data.choices?.[0]?.message?.content

  if (!assistantMessage) {
    throw new Error('No response from AI service')
  }

  // Save both messages to the database
  await prisma.aiChatMessage.createMany({
    data: [
      { sessionId: session.id, role: 'user', content: message },
      { sessionId: session.id, role: 'assistant', content: assistantMessage },
    ],
  })

  // Auto-generate session title from the first user message
  let title = session.title
  if (session.title === 'New Chat' && previousMessages.length === 0) {
    // Generate a short title from the first message
    title = message.length > 50 ? message.substring(0, 50) + '...' : message
    await prisma.aiChatSession.update({
      where: { id: session.id },
      data: { title },
    })
  }

  // Update session timestamp
  await prisma.aiChatSession.update({
    where: { id: session.id },
    data: { updatedAt: new Date() },
  })

  return {
    response: assistantMessage,
    sessionId: session.id,
    title,
  }
}

/**
 * List all chat sessions for a user.
 */
export async function listChatSessions(userId: string) {
  return prisma.aiChatSession.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
    },
  })
}

/**
 * Get messages for a specific chat session.
 */
export async function getSessionMessages(userId: string, sessionId: string) {
  const session = await prisma.aiChatSession.findFirst({
    where: { id: sessionId, userId },
    select: {
      id: true,
      title: true,
      createdAt: true,
      messages: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
      },
    },
  })

  if (!session) return null
  return session
}

/**
 * Delete a chat session and all its messages.
 */
export async function deleteChatSession(userId: string, sessionId: string) {
  const session = await prisma.aiChatSession.findFirst({
    where: { id: sessionId, userId },
  })

  if (!session) return false

  await prisma.aiChatSession.delete({
    where: { id: session.id },
  })

  return true
}
