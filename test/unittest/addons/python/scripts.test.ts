import { PythonScripts } from "../../../../src/python";

describe("pip install requirements", () => {
  test("without properties", () => {
    expect(PythonScripts.pipInstallRequirements({})).toBe(
      `if test -f Pipfile.lock; then
  pip install pipenv;
  pipenv install --dev --system;
  fi;
  if test -f requirements.txt; then
  pip install --upgrade -r requirements.txt;
  fi`.replace(/  +/g, ""),
    );
  });
  test("change requirements.txt", () => {
    expect(
      PythonScripts.pipInstallRequirements({
        requirementsFile: "changed_requirements.txt",
      }),
    ).toBe(
      `if test -f Pipfile.lock; then
  pip install pipenv;
  pipenv install --dev --system;
  fi;
  if test -f changed_requirements.txt; then
  pip install --upgrade -r changed_requirements.txt;
  fi`.replace(/  +/g, ""),
    );
  });
  test("change pipenv version specifier", () => {
    expect(
      PythonScripts.pipInstallRequirements({
        pipenvVersionSpecifier: "==1.2.3",
      }),
    ).toBe(
      `if test -f Pipfile.lock; then
  pip install pipenv==1.2.3;
  pipenv install --dev --system;
  fi;
  if test -f requirements.txt; then
  pip install --upgrade -r requirements.txt;
  fi`.replace(/  +/g, ""),
    );
  });
});
