// Jest global teardown - force exit after tests
export default async function globalTeardown() {
  // Force process exit after a short delay to allow any cleanup
  setTimeout(() => {
    process.exit(0);
  }, 1000);
}
