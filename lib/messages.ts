export const encouragements = [
  "Momentum counts more than perfection. One small step is enough.",
  "You do not need to finish everything. You only need to begin the next tiny piece.",
  "A checked box is proof that the task is becoming lighter.",
  "You are building clarity every time you finish one step.",
  "Progress is still progress when it happens gently.",
];

export function getEncouragement(progress: number) {
  if (progress === 100) {
    return "You finished this task. Take a breath and enjoy the win.";
  }

  if (progress >= 60) {
    return "You are already in motion. Keep it soft and keep it simple.";
  }

  if (progress > 0) {
    return "Nice start. You only need to do the next small thing.";
  }

  return encouragements[0];
}

export function getStuckMessage() {
  return "That is okay. We made it smaller so it is easier to start.";
}
