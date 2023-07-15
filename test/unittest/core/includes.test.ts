import {
  IncludeFile,
  IncludeLocal,
  IncludeRemote,
  IncludeArtifact,
  IncludeTemplate,
} from "../../../src";
import { check } from "../../comparison";

test("include local", () => {
  check(new IncludeLocal({ local: "gitlab_local.yml" }).render(), expect);
});

test("include file", () => {
  check(
    new IncludeFile({
      file: "/test/file/gitlab.yml",
      project: "test/project",
    }).render(),
    expect,
  );
});

test("include file with ref", () => {
  check(
    new IncludeFile({
      file: "/test/file/gitlab.yml",
      project: "test/project",
      ref: "staging",
    }).render(),
    expect,
  );
});

test("include remote", () => {
  check(
    new IncludeRemote({ remote: "https://test.com/testfile.yml" }).render(),
    expect,
  );
});

test("include remote exception", () => {
  expect(() => {
    new IncludeRemote({ remote: "httq:/www.foobar.com" });
  }).toThrowError(" is not a valid URL: ");
});

test("include template", () => {
  check(
    new IncludeTemplate({ template: "Gitlab-Ci-Template.yml" }).render(),
    expect,
  );
});

test("include artifact", () => {
  check(
    new IncludeArtifact({
      job: "generator",
      artifact: "pipeline.yml",
    }).render(),
    expect,
  );
});

test("equality", () => {
  const includeFileToCompareTo = new IncludeFile({
    file: "include.yaml",
    project: "gcix/gcix",
  });
  const includeFileEqualsToCompareTo = new IncludeFile({
    file: "include.yaml",
    project: "gcix/gcix",
  });
  const includeFileNotEqualsToCompareTo = new IncludeFile({
    file: "include.yaml",
    project: "gcix/tools",
  });
  expect(includeFileToCompareTo.isEqual(includeFileEqualsToCompareTo)).toBe(
    true,
  );
  expect(
    includeFileToCompareTo.isEqual(includeFileNotEqualsToCompareTo),
  ).not.toBe(true);

  const includeLocalToCompareTo = new IncludeLocal({ local: "gitlab-ci.yaml" });
  const includeLocalEqualsToCompareTo = new IncludeLocal({
    local: "gitlab-ci.yaml",
  });
  const includeLocalNotEqualsToCompareTo = new IncludeLocal({
    local: "gitlab.yaml",
  });
  expect(includeLocalToCompareTo.isEqual(includeLocalEqualsToCompareTo)).toBe(
    true,
  );
  expect(
    includeLocalToCompareTo.isEqual(includeLocalNotEqualsToCompareTo),
  ).not.toBe(true);

  const includeRemoteToCompareTo = new IncludeRemote({
    remote: "https://my.domain/foobar.yaml",
  });
  const includeRemoteEqualsToCompareTo = new IncludeRemote({
    remote: "https://my.domain/foobar.yaml",
  });
  const includeRemoteNotEqualsToCompareTo = new IncludeRemote({
    remote: "https://not.my.domain/foobar.yaml",
  });
  expect(includeRemoteToCompareTo.isEqual(includeRemoteEqualsToCompareTo)).toBe(
    true,
  );
  expect(
    includeRemoteToCompareTo.isEqual(includeRemoteNotEqualsToCompareTo),
  ).not.toBe(true);

  const includeArtifactToCompareTo = new IncludeArtifact({
    job: "foo_job",
    artifact: "test",
  });
  const includeArtifactEqualsToCompareTo = new IncludeArtifact({
    job: "foo_job",
    artifact: "test",
  });
  const includeArtifactNotEqualsToCompareTo = new IncludeArtifact({
    job: "bar_job",
    artifact: "test",
  });
  expect(
    includeArtifactToCompareTo.isEqual(includeArtifactEqualsToCompareTo),
  ).toBe(true);
  expect(
    includeArtifactToCompareTo.isEqual(includeArtifactNotEqualsToCompareTo),
  ).not.toBe(true);

  const IncludeTemplateToCompareTo = new IncludeTemplate({
    template: "template.yaml",
  });
  const IncludeTemplateEqualsToCompareTo = new IncludeTemplate({
    template: "template.yaml",
  });
  const IncludeTemplateNotEqualsToCompareTo = new IncludeTemplate({
    template: "not_a_template.yaml",
  });
  expect(
    IncludeTemplateToCompareTo.isEqual(IncludeTemplateEqualsToCompareTo),
  ).toBe(true);
  expect(
    IncludeTemplateToCompareTo.isEqual(IncludeTemplateNotEqualsToCompareTo),
  ).not.toBe(true);
});
