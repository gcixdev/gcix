import { Artifacts, Job } from "..";
import { gitlabPagesPath } from "../gitlab";

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
