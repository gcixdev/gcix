import { PredefinedVariables } from '../core';

/**
 * Sanitizes the given path.
 *
 * Uses `path.normalize()` to normalize path.
 * Shorten `PredefinedVariables.CI_PROJECT_DIR` at the very beginning of the path to just '.'.
 *
 * @param path Path to get sanitized.
 * @throws Error If path begins with `/` and is not `PredefinedVariables.CI_PROJECT_DIR`.
 * @returns Sanitized path
 */
export function sanitizePath(path: string): string {
  path = path.normalize();
  if (path.startsWith(PredefinedVariables.CI_PROJECT_DIR)) {
    path = path.replace(PredefinedVariables.CI_PROJECT_DIR, '.');
  }
  if (path.startsWith('/')) {
    throw new Error(`Path ${path} not relative to ${PredefinedVariables.CI_PROJECT_DIR}.`);
  }
  return path;
}
