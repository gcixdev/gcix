import { PredefinedVariables } from "../";

/**
 * Sanitizes the given path.
 *
 * Uses `path.normalize()` to normalize path.
 * Shorten `PredefinedVariables.ciProjectDir` at the very beginning of the path to just '.'.
 *
 * @param path Path to get sanitized.
 * @throws Error If path begins with `/` and is not `PredefinedVariables.ciProjectDir`.
 * @returns Sanitized path
 */
export function sanitizePath(path: string): string {
  path = path.normalize();
  if (path.startsWith(PredefinedVariables.ciProjectDir)) {
    path = path.replace(PredefinedVariables.ciProjectDir, ".");
  }
  if (path.startsWith("/")) {
    throw new Error(
      `Path ${path} not relative to ${PredefinedVariables.ciProjectDir}.`,
    );
  }
  return path;
}
