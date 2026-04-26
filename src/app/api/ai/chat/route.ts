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
- Be warm, human-like, and empathetic
- Understand the user's intent before suggesting anything
- If user is just chatting → respond naturally (no service)
- If user clearly needs care → recommend ONE best service
- Ask follow-up questions if unsure

IMPORTANT:
- DO NOT recommend a service unless you are confident
- DO NOT force suggestions
- DO NOT sound robotic

YOU MUST RETURN JSON ONLY:

{
  "reply": "...",
  "service": "senior_care",
  "confidence": 0.92
}
`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                response_format: { type: "json_object" }, // ✅ IMPORTANT
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    ...messages.slice(-5)
                ]
            }),
        });


        const data = await response.json();


        console.log("OPENROUTER FULL RESPONSE:", JSON.stringify(data, null, 2));

        let reply = "No response from AI";
        let service = null;
        if (data?.choices?.length > 0) {
            const content = data.choices[0]?.message?.content;
            try {
                const parsed = JSON.parse(content);
                reply = parsed.reply;
                service = parsed.service;
            } catch (e) {
                console.error("JSON parse error:", content);
                reply = "AI response error.";
            }
        }
        else if (data?.error) {
            console.error("OpenRouter ERROR:", data.error);
            reply = "AI service error. Check console.";
        }

        if (!reply || reply.trim() === "") {
            reply = "AI returned empty response.";
        }

        const serviceMap = {
            baby_care: "/service/69c62586eed0b6179dd22ca7",
            senior_care: "/service/69c62586eed0b6179dd22ca8",
            patient_care: "/service/69c62586eed0b6179dd22ca9",
            memory_care: "/service/69c62586eed0b6179dd22caa",
            recovery_care: "/service/69c62586eed0b6179dd22cab",
            disability_care: "/service/69c62586eed0b6179dd22cac",
        };

        let actions = [];

        if (service && serviceMap[service]) {
            actions.push({
                label: "Book Now",
                route: serviceMap[service]
            });
        }

        return NextResponse.json({
            reply,
            actions
        });

    } catch (error) {
        console.error("OpenRouter Error:", error);


        return NextResponse.json(
            { reply: "Something went wrong" },
            { status: 500 }
        );
    }
}