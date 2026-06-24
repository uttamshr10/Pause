def build_achievement(title, icon, description, rarity, progress, target):
    unlocked = progress >= target

    return {
        "title": title,
        "icon": icon,
        "description": description,
        "rarity": rarity,
        "status": "unlocked" if unlocked else "locked",
        "progress": progress,
        "target": target,
        "remaining": max(target - progress, 0),
    }


def generate_achievements(checkins):
    total_checkins = len(checkins)

    notes_count = len([
        c for c in checkins
        if c.notes and c.notes.strip() != ""
    ])

    low_risk_days = len([
        c for c in checkins
        if c.risk_level == "low"
    ])

    good_sleep_days = len([
        c for c in checkins
        if c.sleep_hours >= 7
    ])

    recovery_days = len([
        c for c in checkins
        if c.recovery_time >= 1
    ])

    high_focus_days = len([
        c for c in checkins
        if c.focus_level >= 7
    ])

    low_stress_days = len([
        c for c in checkins
        if c.stress_level <= 4
    ])

    high_energy_days = len([
        c for c in checkins
        if c.energy_level >= 7
    ])

    action_completed_days = len([
        c for c in checkins
        if c.burnout_score <= 40
    ])

    achievements = [
        build_achievement(
            "First Step",
            "🌱",
            "Submit your first wellness check-in.",
            "common",
            total_checkins,
            1,
        ),
        build_achievement(
            "Consistency Starter",
            "🔥",
            "Complete 7 wellness check-ins.",
            "common",
            total_checkins,
            7,
        ),
        build_achievement(
            "Momentum Builder",
            "⚡",
            "Complete 14 wellness check-ins.",
            "rare",
            total_checkins,
            14,
        ),
        build_achievement(
            "Wellness Warrior",
            "🏆",
            "Complete 30 wellness check-ins.",
            "legendary",
            total_checkins,
            30,
        ),
        build_achievement(
            "First Reflection",
            "📔",
            "Write your first journal note.",
            "common",
            notes_count,
            1,
        ),
        build_achievement(
            "Reflective Thinker",
            "📝",
            "Write journal notes on 5 check-ins.",
            "rare",
            notes_count,
            5,
        ),
        build_achievement(
            "Sleep Builder",
            "🌙",
            "Sleep 7+ hours on 5 check-ins.",
            "common",
            good_sleep_days,
            5,
        ),
        build_achievement(
            "Sleep Champion",
            "💤",
            "Sleep 7+ hours on 10 check-ins.",
            "rare",
            good_sleep_days,
            10,
        ),
        build_achievement(
            "Recovery Keeper",
            "🧘",
            "Protect at least 1 hour of recovery on 5 days.",
            "common",
            recovery_days,
            5,
        ),
        build_achievement(
            "Recovery Master",
            "🌿",
            "Protect at least 1 hour of recovery on 10 days.",
            "rare",
            recovery_days,
            10,
        ),
        build_achievement(
            "Low Risk Week",
            "🛡️",
            "Maintain low burnout risk on 5 check-ins.",
            "rare",
            low_risk_days,
            5,
        ),
        build_achievement(
            "Burnout Guardian",
            "🦾",
            "Maintain low burnout risk on 15 check-ins.",
            "legendary",
            low_risk_days,
            15,
        ),
        build_achievement(
            "Calm Mind",
            "🍃",
            "Keep stress at 4/10 or below on 5 check-ins.",
            "common",
            low_stress_days,
            5,
        ),
        build_achievement(
            "Focus Flow",
            "🎯",
            "Reach focus level 7+ on 5 check-ins.",
            "common",
            high_focus_days,
            5,
        ),
        build_achievement(
            "Energy Booster",
            "🔋",
            "Reach energy level 7+ on 5 check-ins.",
            "common",
            high_energy_days,
            5,
        ),
        build_achievement(
            "Stable Routine",
            "✅",
            "Keep burnout score at 40 or below on 7 check-ins.",
            "rare",
            action_completed_days,
            7,
        ),
    ]

    unlocked_count = len([
        a for a in achievements
        if a["status"] == "unlocked"
    ])

    return {
        "total_possible": len(achievements),
        "total_unlocked": unlocked_count,
        "achievements": achievements,
    }