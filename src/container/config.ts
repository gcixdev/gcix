/**
 * This module represents a Docker client configuration.
 *
 * Example:
 *
 * ```
 * from gcip.addons.container.config import DockerClientConfig
 * import { DockerClientConfig } from "@gcix/gcix/container"
 * cfg = DockerClientConfig()
 * cfg.add_cred_helper("1234567890.dkr.ecr.us-east-1.amazonaws.com", "ecr-login")
 * cfg.render()
 * ```
 *
 * This will render a Client configuration and dumps it as a json string.
 *
 */

import * as path from "path";
import { merge } from "lodash";
import { Registry } from "./registries";

// import json
// from typing import Any, Dict, List, Union
// from os.path import dirname, normpath

// from gcip.tools.dict import merge_dict
// from gcip.addons.container.registries import Registry

// DockerConfig = Dict[str, Any]

export interface DockerClientConfigProps {
  /**
   * Docker client config path
   * @default $HOME/.docker/config.json
   */
  readonly configFilePath?: string;
}

export interface IDockerClientConfig {
  /**
   * Docker client config path
   * @default $HOME/.docker/config.json
   */
  configFilePath: string;
  /**
   * Docker client configuration
   */
  config: IDockerClientConfigType;
}

export interface IDockerClientConfigType {
  credsStore?: string;
  credHelpers?: { [key in keyof typeof Registry | string]: string };
  auths?: Record<any, any>;
  rawInput?: Record<string, string>; // Include rawInput property here
  // You can add more properties as needed based on your actual usage
}

/**
 * Class which represents a docker client configuration.
 *
 * After creating an instance of this class you can add new credential helper,
 * basic authentication settings or default credential store.
 */
export class DockerClientConfig implements IDockerClientConfig {
  configFilePath: string;
  config: IDockerClientConfigType;

  constructor(props?: DockerClientConfigProps) {
    if (props && props.configFilePath) {
      this.configFilePath = path.normalize(props.configFilePath);
    } else if (props && !props.configFilePath) {
      this.configFilePath = "$HOME/.docker/config.json";
    } else {
      this.configFilePath = "$HOME/.docker/config.json";
    }
    this.config = {};
  }

  /**
   * Sets the `credsStore` setting for clients.
   * See [docker login#credentials-store](https://docs.docker.com/engine/reference/commandline/login/#credentials-store)
   *
   * Be aware, that if you set the `credsStore` and add creds_helper or
   * username and password authentication, those authentication methods
   * are not used.
   *
   * Clients which can authenticate against a registry can handle the credential
   * store itself, mostly you do not want to set the `credsStore`.
   * Use `credsHelpers` instead.
   *
   * @param credsStore Should be the suffix of the program to use
   * (i.e. everything after docker-credential-).
   * `osxkeychain`, to use docker-credential-osxkeychain or
   * `ecr-login`, to use docker-crendential-ecr-login
   * @returns DockerClientConfig
   */
  assignCredsStore(credsStore: string): DockerClientConfig {
    this.config.credsStore = credsStore;
    return this;
  }

  /**
   * Adds a Credentials helper `credHelpers` for a registry.
   * See [docker login#credential-helpers](https://docs.docker.com/engine/reference/commandline/login/#credential-helpers)
   * @param registry Name of the container registry to set `creds_helper` for.
   * @param credHelper Name of the credential helper to use together with the `registry`
   */
  addCredHelper(
    registry: keyof typeof Registry | string,
    credHelper: string,
  ): DockerClientConfig {
    const compose = { [registry]: credHelper };
    if (!this.config.credHelpers) {
      this.config.credHelpers = compose;
    } else {
      this.config.credHelpers = { ...this.config.credHelpers, ...compose };
    }
    return this;
  }

  /**
   * Adds basic authentication `auths` setting to the configuration.
   *
   * This method acts a little special, because of some security aspects.
   * The method, takse three arguments, `registry`, `username_env_var` and `password_env_var`.
   * Arguments ending wit *_env_var, are ment to be available as a `gcip.Job` variable.
   *
   * @param registry  Name of the container registry to set `creds_helper` for.
   *
   * @param usernameEnvVar Name of the environment variable which as the registry username stored.
   * @default REGISTRY_USERNAME
   *
   * @param passwordEnvVar  Name of the environment variable which as the registry password stored.
   * @default REGISTRY_PASSWORD
   */
  addAuth(
    registry: keyof typeof Registry | string,
    usernameEnvVar: string = "REGISTRY_USERNAME",
    passwordEnvVar: string = "REGISTRY_PASSWORD",
  ): DockerClientConfig {
    if (registry === Registry.DOCKER) {
      registry = `https://${registry}/v1/`;
    }
    const compose = {
      [registry]: {
        username: `'$${usernameEnvVar}'`,
        password: `'$${passwordEnvVar}'`,
      },
    };

    if (!this.config.auths) {
      this.config.auths = compose;
    } else {
      this.config.auths = { ...this.config.auths, ...compose };
    }
    return this;
  }

  /**
   * Adds arbitrary settings to configuration.
   *
   * Be aware and warned! You can overwrite any predefined settings with this method.
   * This method is intendet to be used, if non suitable method is available and you
   * have to set a configuration setting.
   *
   * @param rawInput Dictionary of non-available settings to be set.
   */
  addRaw(rawInput: Record<any, any>): DockerClientConfig {
    merge(this.config, rawInput);
    return this;
  }

  /**
   *
   * Renders the shell command for creating the docker client config.
   *
   * The render method uses `json.dumps()` to dump the configuration as a json
   * string and escapes it for the shell. In Jobs which needed the
   * configuration the rendered output should be redirected to the appropriate
   * destination e.g. ~/.docker/config.json. This ensures, that environment
   * variables are substituted.
   *
   * @returns Returns a list with `mkdir -p config_file_path` and a shell escaped JSON string
   * echoed to `config_file_path`/`config_file_name`
   */
  shellCommand(): string[] {
    const script = [
      `mkdir -p ${path.dirname(this.configFilePath)}`,
      `echo '${JSON.stringify(this.config)}' > ${this.configFilePath}`,
    ];
    return script;
  }
}
