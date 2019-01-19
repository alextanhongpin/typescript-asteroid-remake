export function sleep(duration: number) {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve();
    }, duration);
  });
}
