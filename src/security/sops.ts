export class Sops {
  /**
   * Returns a helper string that can be embedded into jobs to allow exporting
   * values that are decrypted using `sops`, for example: 'export $(sops -d sops/encrypted_file.env)'.
   *
   * This function is useful if you want to use environment variables to authenticate, for instance, with a container registry.
   *
   * The script has been successfully tested with SOPS version 3.7 and is intentionally NOT COMPATIBLE with SOPS version 3.6.
   * This is due to a bug in the latter version, which wraps the values to be exported in quotes.
   *
   * @param path - Path to the `sops`-encrypted file. The path must be relative to the project directory.
   * @param installSops - Enable downloading `sops` from the provided `download_url`.ue.
   * @default true
   * @param downloadUrl - Download URL to acquire `sops` from. Defaults to the GitHub Mozilla SOPS releases.
   * @default https://github.com/getsops/sops/releases/download/v3.7.3/sops-v3.7.3.linux.amd64
   * @returns An array of strings representing the export statement for the `sops`-decrypted file.
   */
  static exportDecryptedValues(
    path: string,
    installSops: boolean = true,
    downloadUrl: string = "https://github.com/getsops/sops/releases/download/v3.7.3/sops-v3.7.3.linux.amd64",
  ): string[] {
    const sopsCmd: string[] = [];
    if (installSops) {
      sopsCmd.push(`curl -L ${downloadUrl} -o /usr/local/bin/sops`);
      sopsCmd.push("chmod +x /usr/local/bin/sops");
    }
    sopsCmd.push(
      `set -eo pipefail; SOPS_OUTPUT=$(sops -d ${path}); export $SOPS_OUTPUT`,
    );
    return sopsCmd;
  }

  private constructor() {}
}
