import { cloneRepository } from "../../../../../src/addons/gitlab";

describe("clone repository script", () => {
  test("with leading slash", () => {
    expect(cloneRepository("/foo/bar/baz")).toBe(
      "git clone --branch main --single-branch https://gitlab-ci-token:${CI_JOB_TOKEN}@${CI_SERVER_HOST}/foo/bar/baz.git",
    );
  });
  test("missing leading slash", () => {
    expect(cloneRepository("foo/bar/baz")).toBe(
      "git clone --branch main --single-branch https://gitlab-ci-token:${CI_JOB_TOKEN}@${CI_SERVER_HOST}/foo/bar/baz.git",
    );
  });
  test("changed branch name", () => {
    expect(cloneRepository("foo/bar/baz", "new_branch_name")).toBe(
      "git clone --branch new_branch_name --single-branch https://gitlab-ci-token:${CI_JOB_TOKEN}@${CI_SERVER_HOST}/foo/bar/baz.git",
    );
  });
});
