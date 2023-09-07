import {
  PythonTestEvaluateGitTagPep440Conformity,
  PythonBuildBdistWheel,
  PythonDeployTwineUpload,
  PythonLintMyPy,
  PythonLintIsort,
  PythonLintFlake8,
  PythonDeployTwineUploadProps,
  PythonLintMyPyProps,
  PythonLintIsortProps,
  PythonTestPytestProps,
  PythonBuildBdistWheelProps,
  PythonTestEvaluateGitTagPep440ConformityProps,
  PythonLintFlake8Props,
  PythonTestPytest,
} from ".";
import { RuleLib, JobCollection } from "../";
import { PagesSphinx, PagesSphinxProps } from "../gitlab";

export interface PythonFullStackProps {
  readonly twineProdJobProps: PythonDeployTwineUploadProps;
  readonly twineDevJobProps?: PythonDeployTwineUploadProps;
  readonly mypyJobProps?: PythonLintMyPyProps;
  readonly isortJobProps?: PythonLintIsortProps;
  readonly flake8JobProps?: PythonLintFlake8Props;
  readonly pytestJobProps?: PythonTestPytestProps;
  readonly evaluateGitTagPep440ConformityJobProps?: PythonTestEvaluateGitTagPep440ConformityProps;
  readonly bDistWheelJobProps?: PythonBuildBdistWheelProps;
  readonly sphinxPropsJobProps?: PagesSphinxProps;
}
export interface IPythonFullStack {
  twineProdJob: PythonDeployTwineUpload;
  twineDevJob?: PythonDeployTwineUpload;
  mypyJob?: PythonLintMyPy;
  isortJob: PythonLintIsort;
  flake8Job: PythonLintFlake8;
  pytestJob: PythonTestPytest;
  evaluateGitTagPep440ConformityJob: PythonTestEvaluateGitTagPep440Conformity;
  bDistWheelJob: PythonBuildBdistWheel;
  sphinxJob?: PagesSphinx;
}

/**
 * Returns a sequence containing following jobs:
 * - isort
 * - flake8
 * - pytest
 * - evaluating CI_COMMIT_TAG as valid PyPI version string (if exists)
 * - bdist_wheel
 * - Gitlab Pages sphinx
 * - twine upload
 *
 * Optional jobs:
 * - mypy
 *
 * The `varname_dev_password` and `varname_stable_password` arguments are
 * **only** used to specify the variable name and **not** the actuall password.
 * The variable name has to be set outside of the pipeline itself,
 * if you set it within the pipline, that would be a security risk.
 */
export class PythonFullStack extends JobCollection implements IPythonFullStack {
  twineDevJob?: PythonDeployTwineUpload;
  twineProdJob: PythonDeployTwineUpload;
  mypyJob?: PythonLintMyPy;
  isortJob: PythonLintIsort;
  flake8Job: PythonLintFlake8;
  pytestJob: PythonTestPytest;
  evaluateGitTagPep440ConformityJob: PythonTestEvaluateGitTagPep440Conformity;
  bDistWheelJob: PythonBuildBdistWheel;
  sphinxJob?: PagesSphinx;

  constructor(props: PythonFullStackProps) {
    super();
    this.isortJob = new PythonLintIsort(props.isortJobProps ?? {});
    this.flake8Job = new PythonLintFlake8(props.flake8JobProps ?? {});
    this.pytestJob = new PythonTestPytest(props.pytestJobProps ?? {});
    this.evaluateGitTagPep440ConformityJob =
      new PythonTestEvaluateGitTagPep440Conformity(
        props.evaluateGitTagPep440ConformityJobProps ?? {},
      );
    this.bDistWheelJob = new PythonBuildBdistWheel(
      props.bDistWheelJobProps ?? {},
    );

    this.addChildren({
      jobsOrJobCollections: [
        this.isortJob,
        this.flake8Job,
        this.pytestJob,
        this.evaluateGitTagPep440ConformityJob,
        this.bDistWheelJob,
      ],
    });

    if (props.mypyJobProps) {
      this.mypyJob = new PythonLintMyPy(props.mypyJobProps);
      this.addChildren({ jobsOrJobCollections: [this.mypyJob] });
    }

    if (props.sphinxPropsJobProps) {
      this.sphinxJob = new PagesSphinx(props.sphinxPropsJobProps);
      this.sphinxJob.appendRules([
        RuleLib.onMain(),
        RuleLib.onMaster(),
        RuleLib.onTags(),
      ]);
      this.addChildren({ jobsOrJobCollections: [this.sphinxJob] });
    }

    if (props.twineDevJobProps) {
      this.twineDevJob = new PythonDeployTwineUpload(props.twineDevJobProps);
      this.twineDevJob.appendRules([
        RuleLib.onTags().never(),
        RuleLib.onSuccess(),
      ]);
      this.addChildren({
        jobsOrJobCollections: [this.twineDevJob],
        name: "dev",
      });
    }

    this.twineProdJob = new PythonDeployTwineUpload(props.twineProdJobProps);
    this.twineProdJob.appendRules([RuleLib.onTags()]);
    this.addChildren({
      jobsOrJobCollections: [this.twineProdJob],
      name: "stable",
    });
  }
}
