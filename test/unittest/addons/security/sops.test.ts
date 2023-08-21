import { Sops } from "../../../../src/security";

test("sops export decrypted values", () => {
  expect(
    Sops.exportDecryptedValues("secrets/encrypted_file.env", false),
  ).toStrictEqual([
    "set -eo pipefail; SOPS_OUTPUT=$(sops -d secrets/encrypted_file.env); export $SOPS_OUTPUT",
  ]);
});

test("sops export decrypted values with download", () => {
  expect(
    Sops.exportDecryptedValues("secrets/encrypted_file.env"),
  ).toStrictEqual([
    "curl -L https://github.com/getsops/sops/releases/download/v3.7.3/sops-v3.7.3.linux.amd64 -o /usr/local/bin/sops",
    "chmod +x /usr/local/bin/sops",
    "set -eo pipefail; SOPS_OUTPUT=$(sops -d secrets/encrypted_file.env); export $SOPS_OUTPUT",
  ]);
});
