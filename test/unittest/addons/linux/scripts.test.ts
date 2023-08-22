import { LinuxScripts } from "../../../../src/linux";

test("package installation test", () => {
  expect(LinuxScripts.installPackages({ packages: ["git"] })).toBe(
    `if [ -x "$(command -v apk)" ]; then apk update && apk add --yes --no-cache git;
    elif [ -x "$(command -v apt-get)" ]; then apt-get update && apt-get install --yes git;
    elif [ -x "$(command -v yum)" ]; then yum install -y git;
    elif [ -x "$(command -v dnf)" ]; then dnf install -y git;
    elif [ -x "$(command -v zypper)" ]; then zypper install -y git;
    else echo "FAILED TO INSTALL PACKAGE: Package manager not found. You must manually install: git">&2; fi
    `.replace(/  +/g, ""),
  );
});
