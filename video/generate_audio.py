#!/usr/bin/env python3
"""
Synthesizes a 34-second, 44.1 kHz stereo soundtrack (public/soundtrack.wav)
for the Pickup for iPhone & iPad promo video using pure Python standard library.

Elements:
- Warm Rhodes-like electric piano chords (Dmaj7 -> Bm7 -> Gmaj7 -> A6)
  with soft 2nd/3rd harmonics, tine attack, gentle key strum, and stereo tremolo
- Delicate mechanical pocket-watch escapement ticks during Scene 1 (0..5s)
- Crystalline Liquid Glass harmonic chimes at scene transitions (5s, 13s, 23s, 30s)
- Smooth 0.8s fade-in and 1.5s fade-out, peak-normalized to -1.5 dBFS
"""

import math
import random
import struct
import wave
from pathlib import Path

SAMPLE_RATE = 44100
DURATION_SEC = 34.0
NUM_SAMPLES = int(SAMPLE_RATE * DURATION_SEC)
FADE_IN_SEC = 0.8
FADE_OUT_SEC = 1.5
TARGET_DBFS = -1.5

OUT_PATH = Path(__file__).resolve().parent / "public" / "soundtrack.wav"


def hann_fade(x: float) -> float:
    """Smooth S-curve fade in [0, 1]."""
    x = max(0.0, min(1.0, x))
    return 0.5 - 0.5 * math.cos(math.pi * x)


def add_rhodes_chord(
    left: list[float],
    right: list[float],
    onset_sec: float,
    dur_sec: float,
    freqs: list[float],
    amp: float = 0.14,
    tremolo_hz: float = 4.2,
) -> None:
    """Render a warm electric-piano chord with gentle finger-strum and stereo tremolo."""
    n_notes = max(1, len(freqs))
    two_pi = 2.0 * math.pi

    for idx, freq in enumerate(freqs):
        # Gentle finger strum across chord tones
        note_start = onset_sec + idx * 0.022
        note_dur = max(0.4, dur_sec - idx * 0.022)
        i0 = max(0, int(note_start * SAMPLE_RATE))
        i1 = min(NUM_SAMPLES, int((note_start + note_dur) * SAMPLE_RATE))
        if i0 >= i1:
            continue

        # Subtle stereo spread: bass centered, upper voices lightly spread
        if idx == 0:
            pan = 0.0
            note_gain = 1.05
        else:
            pan = ((idx / max(1, n_notes - 1)) - 0.5) * 0.42
            note_gain = 0.86 if idx > 2 else 0.96

        pan_l = math.cos((pan + 1.0) * math.pi * 0.25)
        pan_r = math.sin((pan + 1.0) * math.pi * 0.25)

        w1 = two_pi * freq
        w2 = two_pi * (freq * 2.0)
        w3 = two_pi * (freq * 3.0)
        w_tine = two_pi * (freq * 4.012)
        w_trem = two_pi * tremolo_hz

        atk_samples = max(1, int(0.014 * SAMPLE_RATE))
        rel_samples = max(1, int(0.45 * SAMPLE_RATE))
        total_n = i1 - i0

        for k in range(total_n):
            i = i0 + k
            dt = k / SAMPLE_RATE

            # Envelope: quick warm attack, gentle Rhodes sustain decay, smooth tail release
            atk = 1.0 if k >= atk_samples else (k / atk_samples)
            rel = 1.0 if (total_n - k) >= rel_samples else ((total_n - k) / rel_samples)
            sustain_decay = math.exp(-dt * 0.34)
            env = atk * rel * sustain_decay

            # Fundamental + soft 2nd & 3rd harmonics + delicate metallic tine transient
            fundamental = math.sin(w1 * dt)
            harm2 = 0.23 * math.sin(w2 * dt) * math.exp(-dt * 0.55)
            harm3 = 0.075 * math.sin(w3 * dt) * math.exp(-dt * 0.95)
            tine = 0.045 * math.sin(w_tine * dt) * math.exp(-dt * 26.0)

            sig = (fundamental + harm2 + harm3 + tine) * env * amp * note_gain

            # Classic Fender Rhodes stereo autopan/tremolo
            t_global = i / SAMPLE_RATE
            trem = math.sin(w_trem * t_global)
            mod_l = 1.0 + 0.13 * trem
            mod_r = 1.0 - 0.13 * trem

            left[i] += sig * pan_l * mod_l
            right[i] += sig * pan_r * mod_r


def add_watch_tick(
    left: list[float],
    right: list[float],
    onset_sec: float,
    is_tick: bool,
    amp: float,
    rng: random.Random,
) -> None:
    """Render a delicate mechanical pocket-watch escapement impulse."""
    dur = 0.055
    i0 = max(0, int(onset_sec * SAMPLE_RATE))
    i1 = min(NUM_SAMPLES, int((onset_sec + dur) * SAMPLE_RATE))
    if i0 >= i1:
        return

    two_pi = 2.0 * math.pi
    f_hi = 2680.0 if is_tick else 2190.0
    f_body = 1180.0 if is_tick else 970.0
    pan = -0.14 if is_tick else 0.14
    pan_l = math.cos((pan + 1.0) * math.pi * 0.25)
    pan_r = math.sin((pan + 1.0) * math.pi * 0.25)

    for i in range(i0, i1):
        dt = (i - i0) / SAMPLE_RATE
        atk = min(1.0, dt / 0.0008)
        # Sharp primary escapement transient + soft brass housing resonance
        ping = math.sin(two_pi * f_hi * dt) * math.exp(-dt * 175.0)
        body = 0.55 * math.sin(two_pi * f_body * dt) * math.exp(-dt * 110.0)
        click_noise = 0.22 * (rng.random() * 2.0 - 1.0) * math.exp(-dt * 380.0)
        sig = (ping + body + click_noise) * atk * amp
        left[i] += sig * pan_l
        right[i] += sig * pan_r


def add_glass_chime(
    left: list[float],
    right: list[float],
    onset_sec: float,
    freqs: list[float],
    dur_sec: float = 2.4,
    amp: float = 0.085,
) -> None:
    """Render a crystalline Liquid Glass harmonic chime with subtle stereo shimmer delay."""
    two_pi = 2.0 * math.pi

    for idx, freq in enumerate(freqs):
        t_start = onset_sec + idx * 0.055
        i0 = max(0, int(t_start * SAMPLE_RATE))
        i1 = min(NUM_SAMPLES, int((t_start + dur_sec) * SAMPLE_RATE))
        if i0 >= i1:
            continue

        pan = -0.25 if idx % 2 == 0 else 0.25
        pan_l = math.cos((pan + 1.0) * math.pi * 0.25)
        pan_r = math.sin((pan + 1.0) * math.pi * 0.25)

        w1 = two_pi * freq
        w2 = two_pi * (freq * 2.0)
        w3 = two_pi * (freq * 3.004)
        w4 = two_pi * (freq * 4.011)

        # Delayed subtle cross-channel reflection (95ms)
        echo_delay = int(0.095 * SAMPLE_RATE)

        for i in range(i0, i1):
            dt = (i - i0) / SAMPLE_RATE
            atk = min(1.0, dt / 0.012)
            dec = math.exp(-dt * (2.6 / max(dur_sec, 0.5)))

            sig = (
                0.68 * math.sin(w1 * dt)
                + 0.21 * math.sin(w2 * dt) * math.exp(-dt * 1.4)
                + 0.08 * math.sin(w3 * dt) * math.exp(-dt * 3.0)
                + 0.03 * math.sin(w4 * dt) * math.exp(-dt * 4.8)
            ) * atk * dec * amp

            left[i] += sig * pan_l
            right[i] += sig * pan_r

            j = i + echo_delay
            if j < NUM_SAMPLES:
                # Subtle inverted-pan echo reflection for airy glass dimension
                left[j] += sig * pan_r * 0.24
                right[j] += sig * pan_l * 0.24


def main() -> None:
    rng = random.Random(202604)
    left = [0.0] * NUM_SAMPLES
    right = [0.0] * NUM_SAMPLES

    # Chord voicings in D major / B minor (Dmaj7 -> Bm7 -> Gmaj7 -> A6)
    d_maj7 = [146.83, 220.00, 277.18, 329.63, 369.99]   # D3 A3 C#4 E4 F#4
    b_min7 = [123.47, 185.00, 220.00, 293.66, 369.99]   # B2 F#3 A3 D4 F#4
    g_maj7 = [98.00, 196.00, 246.94, 293.66, 369.99]    # G2 G3 B3 D4 F#4
    a_6    = [110.00, 220.00, 277.18, 329.63, 369.99]   # A2 A3 C#4 E4 F#4

    # Harmonic timeline aligned to the 5 video scenes (34s total)
    chord_schedule = [
        # Scene 1 (0..5s): Pocket-watch intro on serene Dmaj7
        (0.00, 5.15, d_maj7, 0.115),
        # Scene 2 (5..13s): iOS 26 Liquid Glass & Purple->Monochrome morph
        (5.00, 4.15, d_maj7, 0.145),
        (9.00, 4.15, b_min7, 0.145),
        # Scene 3 (13..23s): Four Everyday Chapters
        (13.00, 5.15, g_maj7, 0.145),
        (18.00, 5.15, a_6, 0.140),
        # Scene 4 (23..30s): Data Vault & Zero-Fee Sideload Freedom (full cadence cycle)
        (23.00, 1.85, d_maj7, 0.140),
        (24.75, 1.85, b_min7, 0.140),
        (26.50, 1.85, g_maj7, 0.142),
        (28.25, 1.90, a_6, 0.140),
        # Scene 5 (30..34s): Outro Lockup resolution
        (30.00, 4.00, d_maj7, 0.135),
    ]

    for onset, dur, freqs, amp in chord_schedule:
        add_rhodes_chord(left, right, onset, dur, freqs, amp=amp, tremolo_hz=4.1)

    # Delicate mechanical pocket-watch ticks during Scene 1 (0..5s / frames 0..300)
    # 4 beats/sec alternating tick-tock from 0.25s to 4.75s
    tick_times = [0.25 * n for n in range(1, 20)]  # 0.25s .. 4.75s
    for idx, t_tick in enumerate(tick_times):
        # Taper softly in the first 0.6s and final 0.7s before Scene 2
        if t_tick < 0.7:
            taper = 0.55 + 0.45 * (t_tick / 0.7)
        elif t_tick > 4.0:
            taper = max(0.25, 1.0 - (t_tick - 4.0) / 0.9)
        else:
            taper = 1.0
        add_watch_tick(left, right, t_tick, is_tick=(idx % 2 == 0), amp=0.075 * taper, rng=rng)

    # Crystalline glass harmonic chimes at scene transitions (5s, 13s, 23s, 30s)
    transition_chimes = [
        (5.00,  [739.99, 880.00], 2.2, 0.082),          # F#5 + A5 -> Scene 2 entrance
        (13.00, [987.77, 1174.66], 2.2, 0.078),         # B5 + D6  -> Scene 3 entrance
        (23.00, [880.00, 1479.98], 2.3, 0.082),         # A5 + F#6 -> Scene 4 entrance
        (30.00, [1174.66, 1479.98, 880.00], 2.8, 0.088) # D6 + F#6 + A5 -> Scene 5 Outro
    ]
    for onset, freqs, dur, amp in transition_chimes:
        add_glass_chime(left, right, onset, freqs, dur_sec=dur, amp=amp)

    # Whisper-soft chapter harmonic accents inside Scene 3 (15.5s, 18.0s, 20.5s)
    chapter_sparkles = [
        (15.50, [739.99], 1.4, 0.036),
        (18.00, [880.00], 1.4, 0.036),
        (20.50, [1108.73], 1.4, 0.036),
    ]
    for onset, freqs, dur, amp in chapter_sparkles:
        add_glass_chime(left, right, onset, freqs, dur_sec=dur, amp=amp)

    # Apply smooth 0.8s fade-in and 1.5s fade-out
    fade_in_samples = int(FADE_IN_SEC * SAMPLE_RATE)
    fade_out_samples = int(FADE_OUT_SEC * SAMPLE_RATE)
    fade_out_start = NUM_SAMPLES - fade_out_samples

    for i in range(fade_in_samples):
        g = hann_fade(i / fade_in_samples)
        left[i] *= g
        right[i] *= g

    for i in range(fade_out_start, NUM_SAMPLES):
        g = hann_fade((NUM_SAMPLES - 1 - i) / fade_out_samples)
        left[i] *= g
        right[i] *= g

    # Peak normalize cleanly below clipping (-1.5 dBFS)
    peak = 0.0
    for i in range(NUM_SAMPLES):
        al = abs(left[i])
        ar = abs(right[i])
        if al > peak:
            peak = al
        if ar > peak:
            peak = ar

    target_linear = 10.0 ** (TARGET_DBFS / 20.0)
    scale = (target_linear / peak) if peak > 1e-9 else 1.0

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    pcm = bytearray(NUM_SAMPLES * 4)
    offset = 0
    for i in range(NUM_SAMPLES):
        l_val = int(max(-32767, min(32767, round(left[i] * scale * 32767.0))))
        r_val = int(max(-32767, min(32767, round(right[i] * scale * 32767.0))))
        struct.pack_into("<hh", pcm, offset, l_val, r_val)
        offset += 4

    with wave.open(str(OUT_PATH), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(pcm)

    actual_peak_db = 20.0 * math.log10(max(1e-9, peak * scale))
    print(
        f"Generated {OUT_PATH} | {DURATION_SEC:.1f}s | {SAMPLE_RATE} Hz | stereo 16-bit | "
        f"peak={actual_peak_db:.2f} dBFS | size={OUT_PATH.stat().st_size:,} bytes"
    )


if __name__ == "__main__":
    main()
