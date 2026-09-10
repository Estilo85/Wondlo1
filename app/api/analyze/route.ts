import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Operator name or website is required' }, { status: 400 });
    }

    const scrapingHashtags = ["#adventureSafety", "#climbingAccident", "#guideReview", "#travelSafety", "#incidentReport", "#rescueLog"];

    const prompt = `
You are the core safety analysis engine for Wondlo, a platform ensuring adventure tourism safety for travelers.
Perform a thorough safety evaluation and data calculation for the adventure operator: "${query}" using data targeted through these hashtags/keywords: ${scrapingHashtags.join(", ")}.

Calculate realistic scores (out of 100) based on your evaluation across these 7 required weighted dimensions:
1. Quality of Experience (10%)
2. Quality of Regulation (15%)
3. Incident History (20%)
4. Business Information (10%)
5. Risk Assessment (15%)
6. Equipment Assessment (15%)
7. Safety Sentiment (15%)

Return a valid JSON object ONLY with no markdown code blocks or extra text, matching this exact structure:
{
  "operatorName": "${query}",
  "verified": true,
  "location": "Discovered City/Country",
  "activityType": "Adventure Trekking, Climbing",
  "reportGeneratedDate": "July 15, 2026",
  "dataCollectedUpTo": "July 14, 2026",
  "overallSafetyScore": 85,
  "riskLevel": "Low Risk",
  "confidenceScore": 90,
  "summary": "Provide a dynamic, realistic 2-3 sentence safety summary based on the evaluated operator.",
  "dimensions": {
    "qualityOfExperience": 90,
    "qualityOfRegulation": 76,
    "incidentHistory": 85,
    "businessInformation": 80,
    "riskAssessment": 70,
    "equipmentAssessment": 65,
    "safetySentiment": 77
  },
  "incidents": [
    {
      "date": "Apr 12, 2025",
      "severity": "Minor",
      "title": "Example incident title",
      "description": "Example incident description based on data.",
      "source": "Instagram"
    }
  ],
  "assessmentConclusion": "The operator satisfies our safety framework for (trip-type) safety.",
  "images": [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
  ]
}
    `;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    });

    const contentBlock = response.content[0];
    if (contentBlock.type !== 'text') {
      throw new Error('Unexpected response format from Claude');
    }

    let jsonText = contentBlock.text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
    }

    const analysisData = JSON.parse(jsonText);
    return NextResponse.json(analysisData);

  } catch (error: any) {
    console.error('Analysis Engine Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process adventure analysis' }, { status: 500 });
  }
}