export async function wait() {
  return new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
}
