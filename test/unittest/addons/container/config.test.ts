import { Registry, DockerClientConfig } from "../../../../src/container";
import { check } from "../../../comparison";

let dcc: DockerClientConfig;
beforeEach(() => {
  dcc = new DockerClientConfig();
});

test("docker client config", () => {
  dcc.addAuth("index.docker.com");
  check({ shell_command: dcc.shellCommand() }, expect);
});

test("complex docker client config", () => {
  dcc.addAuth("index.docker.com", "CUSTOM_DOCKER_USER", "CUSTOM_DOCKER_PW");
  dcc.addCredHelper(
    "123456789.dkr.ecr.eu-central-1.amazonaws.com",
    "ecr-login",
  );
  dcc.assignCredsStore("gcr");
  dcc.addRaw({ proxies: { default: { httpProxy: "127.0.0.1:1234" } } });
  check({ shell_command: dcc.shellCommand() }, expect);
});

test("docker client config set config file path", () => {
  const _dcc = new DockerClientConfig({
    configFilePath: "/kaniko/.docker/other.json",
  });
  check({ shell_command: _dcc.shellCommand() }, expect);
});

test("docker client config registry constant", () => {
  dcc.addAuth(Registry.DOCKER);
  dcc.addCredHelper(Registry.GCR, (Registry.GCR, "gcr-login"));
  check({ shell_command: dcc.shellCommand() }, expect);
});

test("docker client config with props", () => {
  const _dcc = new DockerClientConfig({});
  _dcc.addCredHelper(Registry.GCR, (Registry.GCR, "gcr-login"));
  _dcc.addCredHelper(Registry.DOCKER, (Registry.DOCKER, "docker-login"));
  _dcc.addAuth(Registry.DOCKER, "DOCKER_HUB_IO_USER", "DOCKER_HUB_IO_PASSWORD");
  _dcc.addAuth(Registry.QUAY, "QUAY_USER", "QUAY_PASSWORD");
  check({ shell_command: dcc.shellCommand() }, expect);
});
