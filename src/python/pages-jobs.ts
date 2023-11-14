import { PipInstallRequirementsProps, PythonScripts } from ".";
import { Artifacts, Job, PredefinedVariables } from "..";
import { gitlabPagesPath } from "../gitlab";

export interface PagesPdoc3Props {
  /**
   * The Python module name. This may be an import path resolvable in the
   * current environment, or a file path to a Python module or package.
   */
  readonly module: string;
  /**
   * A sub path of the Gitlab Pages `public` directory to output generated
   * HTML/markdown files to. Defaults to "/".
   */
  readonly outputPath?: string;
  /**
   * The name of the job.
   */
  readonly jobName?: string;
  /**
   * The stage of the job.
   */
  readonly jobStage?: string;
}
export interface IPagesPdoc3 {
  /**
   * The Python module name. This may be an import path resolvable in the
   * current environment, or a file path to a Python module or package.
   */
  module: string;
  /**
   * A sub path of the Gitlab Pages `public` directory to output generated
   * HTML/markdown files to. Defaults to "/".
   */
  outputPath: string;
}

/**
 * Generate a HTML API documentation of you python code as Gitlab Pages.
 *
 * Runs `pdoc3 --html -f --skip-errors --output-dir public{path} {module}` and stores the output
 * as artifact under the `public` directory.
 *
 * This subclass of `Job` will configure following defaults for the superclass:
 *
 * - name: pdoc3-pages
 * - stage: build
 * - artifacts: Path 'public'
 */
export class PagesPdoc3 extends Job implements IPagesPdoc3 {
  module: string;
  outputPath: string;
  constructor(props: PagesPdoc3Props) {
    super({
      scripts: [""],
      name: props.jobName ?? "pdoc3-pages",
      stage: props.jobStage ?? "build",
      artifacts: new Artifacts({ paths: ["public"] }),
    });
    this.module = props.module;
    this.outputPath = props.outputPath ?? "";
  }

  render() {
    this.scripts = [
      "pip3 install pdoc3",
      `pdoc3 --html -f --skip-errors --output-dir ${gitlabPagesPath(
        this.outputPath,
      )} ${this.module}`,
    ];
    return super.render();
  }
}

export interface PagesSphinxProps {
  readonly pip?: PipInstallRequirementsProps;
  /**
   * The name of the job.
   */
  readonly jobName?: string;
  /**
   * The stage of the job.
   */
  readonly jobStage?: string;
}
export interface IPagesSphinx {
  pip?: PipInstallRequirementsProps;
}

/**
 * Runs `sphinx-build -b html -E -a docs public/${CI_COMMIT_REF_NAME}` and
 * installs project requirements.
 * Uses: (`PythonScripts.PipInstallRequirements()`)
 *
 * - Requires a `docs/requirements.txt` in your project folder` containing
 *   at least `sphinx`
 * - Creates artifacts for Gitlab Pages under `pages`
 *
 * This subclass of `Job` will configure following defaults for the superclass:
 *
 * - name: sphinx-pages
 * - stage: build
 * - artifacts: Path 'public'
 */
export class PagesSphinx extends Job implements IPagesSphinx {
  pip?: PipInstallRequirementsProps;
  constructor(props: PagesSphinxProps) {
    super({
      scripts: [""],
      name: props.jobName ?? "sphinx-pages",
      stage: props.jobStage ?? "build",
      artifacts: new Artifacts({ paths: ["public"] }),
    });

    this.pip = props.pip;
  }

  render() {
    this.scripts = [
      PythonScripts.pipInstallRequirements({
        requirementsFile: this.pip?.requirementsFile ?? "docs/requirements.txt",
        pipenvVersionSpecifier: this.pip?.pipenvVersionSpecifier,
      }),
      `sphinx-build -b html -E -a docs ${gitlabPagesPath(
        PredefinedVariables.ciCommitRefSlug,
      )}`,
    ];
    return super.render();
  }
}
