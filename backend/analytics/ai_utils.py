from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_insight(checkins):

    if not checkins:
        return "No data available to generate insights."

    formatted_data = "\n".join([
        f"Date: {c.checkin_date}, Burnout: {c.burnout_score}, Stress: {c.stress_level}, Mood: {c.mood_score}"
        for c in checkins
    ])

    prompt = f"""
You are a wellness assistant.

Analyze the following user data and provide a short burnout insight:

{formatted_data}

Keep it:
- short (2–3 lines)
- simple
- actionable
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content.strip()