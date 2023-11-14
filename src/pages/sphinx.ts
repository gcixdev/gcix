import { Artifacts, Job, PredefinedVariables } from "..";
import { gitlabPagesPath } from "../gitlab";
import { PipInstallRequirementsProps, PythonScripts } from "../python/scripts";

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
