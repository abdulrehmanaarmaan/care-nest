import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const systemPrompt = `
You are an AI assistant for Care Nest, a caregiving platform.

AVAILABLE SERVICES:
- baby_care
- senior_care
- memory_care
- patient_care
- recovery_care
- disability_care

YOUR BEHAVIOR:
- Be natural, empathetic, and helpful
- Understand the user's intent
- Only recommend a service if confident
- If unsure → ask follow-up questions

YOU MUST RETURN VALID JSON ONLY.
Your entire response must be a JSON object.

FORMAT:
{
  "reply": "natural human-like response",
  "service": "baby_care | senior_care | memory_care | patient_care | recovery_care | disability_care | null",
  "confidence": number (0 to 1)
}

RULES:
- confidence > 0.8 → very sure
- 0.5–0.8 → somewhat sure
- < 0.5 → unsure → service should be null
`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    ...messages.slice(-5)
                ]
            }),
        });

        // ✅ Handle HTTP errors
        if (!response.ok) {
            console.error("HTTP Error:", response.status);
            return NextResponse.json(
                { reply: "AI service unavailable", actions: [] },
                { status: 500 }
            );
        }

        const data = await response.json();

        console.log("OPENROUTER FULL RESPONSE:", JSON.stringify(data, null, 2));

        // ✅ SAFE DEFAULTS
        let reply = "I'm here to help. Could you please tell me more about your situation?";
        let service: string | null = null;
        let confidence = 0;

        // ✅ PARSE AI RESPONSE SAFELY
        if (data?.choices?.length > 0) {
            const content = data.choices[0]?.message?.content;

            try {
                const parsed = JSON.parse(content);
                reply = parsed.reply || reply;
                service = parsed.service || null;
                confidence = Number(parsed.confidence) || 0;
            } catch (e) {
                console.error("JSON parse error:", content);
            }
        } else if (data?.error) {
            console.error("OpenRouter ERROR:", data.error);
            return NextResponse.json(
                { reply: "AI service error. Please try again.", actions: [] },
                { status: 500 }
            );
        }

        // ✅ SERVICE ROUTES
        const serviceMap: Record<string, string> = {
            baby_care: "/service/69c62586eed0b6179dd22ca7",
            senior_care: "/service/69c62586eed0b6179dd22ca8",
            patient_care: "/service/69c62586eed0b6179dd22ca9",
            memory_care: "/service/69c62586eed0b6179dd22caa",
            recovery_care: "/service/69c62586eed0b6179dd22cab",
            disability_care: "/service/69c62586eed0b6179dd22cac",
        };

        // ✅ SMART ACTIONS (NO FORCED BUTTONS)
        let actions: { label: string; route: string }[] = [];

        if (
            service &&
            serviceMap[service] &&
            confidence >= 0.7
        ) {
            actions.push({
                label: "Book Now",
                route: serviceMap[service]
            });
        }

        // ✅ FINAL RESPONSE
        return NextResponse.json({
            reply,
            actions
        });

    } catch (error) {
        console.error("Server Error:", error);

        return NextResponse.json(
            { reply: "Something went wrong. Please try again.", actions: [] },
            { status: 500 }
        );
    }
}