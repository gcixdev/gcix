import * as path from "path";
import { Artifacts, Job, PredefinedVariables } from "..";
import { PipInstallRequirementsProps, PythonScripts } from "../python";

/**
 * Ensures `subpath` is a subpath under `./public`.
 * @param subPath path which will be sanitized and appended to `./public`
 * @returns path `public/${subPath}`
 */
export function gitlabPagesPath(subPath: string): string {
  if (subPath !== "") {
    subPath = path.normalize(subPath);

    if (path.isAbsolute(subPath)) {
      subPath = subPath.replace(/\//, "");
    }
  }
  return path.join("public", subPath);
}

export interface PagesAsciiDoctorProps {
  /**
   * Source .adoc files to translate to HTML files.
   */
  readonly source: string;
  /**
   * Output HTML file.
   */
  readonly outFile: string;
  /**
   * The name of the job.
   */
  readonly jobName?: string;
  /**
   * The stage of the job.
   */
  readonly jobStage?: string;
}
export interface IPagesAsciiDoctor {
  /**
   * Source .adoc files to translate to HTML files.
   */
  source: string;
  /**
   * Output HTML file.
   */
  outFile: string;
}

/**
 * Translate the AsciiDoc source FILE as Gitlab Pages HTML5 file.
 *
 * Runs `asciidoctor {source} -o public{out_file}`and stores the output
 * as artifact under the `public` directory.
 *
 * This subclass of `Job` will configure following defaults for the superclass:
 *
 * - name: asciidoctor-pages
 * - stage: build
 * - image: ruby:3-alpine
 * - artifacts: Path 'public'
 */
export class PagesAsciiDoctor extends Job implements IPagesAsciiDoctor {
  source: string;
  outFile: string;

  constructor(props: PagesAsciiDoctorProps) {
    super({
      scripts: [""],
      name: props.jobName ?? "asciidoctor-pages",
      stage: props.jobStage ?? "build",
      image: "ruby:3-alpine",
      artifacts: new Artifacts({ paths: ["public"] }),
    });
    this.source = props.source;
    this.outFile = props.outFile;
  }

  render() {
    this.scripts = [
      "gem install asciidoctor",
      `asciidoctor ${this.source} -o ${gitlabPagesPath(this.outFile)}`,
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
