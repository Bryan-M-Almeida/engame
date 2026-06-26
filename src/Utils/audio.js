let isMuted = false;

export function setMuted(muted) {
    isMuted = muted;
    localStorage.setItem('engame_muted', JSON.stringify(muted));
}

export function getMuted() {
    const saved = localStorage.getItem('engame_muted');
    if (saved !== null) {
        isMuted = JSON.parse(saved);
    }
    return isMuted;
}

function getAudioContext() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        return AudioCtx ? new AudioCtx() : null;
    } catch (e) {
        return null;
    }
}

export function playSound(type) {
    if (isMuted) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (browser security)
    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
        case 'correct': {
            // Nice ascending 2-tone bell chime
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.setValueAtTime(880.00, now + 0.1); // A5
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
            break;
        }
        case 'incorrect': {
            // Lower buzzer sound
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.3);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
            break;
        }
        case 'streak': {
            // Beautiful fast arpeggio (Major C9)
            const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50]; // C5, E5, G5, B5, C6
            osc.type = 'triangle';
            freqs.forEach((f, idx) => {
                osc.frequency.setValueAtTime(f, now + idx * 0.08);
            });
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
            break;
        }
        case 'tick': {
            // Quiet organic high wood-click
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, now);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;
        }
        case 'victory': {
            // Beautiful game show victory scale
            const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
            osc.type = 'sine';
            notes.forEach((f, idx) => {
                osc.frequency.setValueAtTime(f, now + idx * 0.12);
            });
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
            osc.start(now);
            osc.stop(now + 1.2);
            break;
        }
    }
}