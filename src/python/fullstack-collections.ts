import {
  Pytest,
  EvaluateGitTagPep440Conformity,
  BdistWheel,
  TwineUpload,
  MyPy,
  Isort,
  Flake8,
  TwineUploadProps,
  MyPyProps,
  IsortProps,
  PytestProps,
  BdistWheelProps,
  EvaluateGitTagPep440ConformityProps,
  Flake8Props,
} from ".";
import { RuleLib, JobCollection } from "../";
import { Sphinx, SphinxProps } from "../gitlab";

export interface FullStackProps {
  readonly twineProdJobProps: TwineUploadProps;
  readonly twineDevJobProps?: TwineUploadProps;
  readonly mypyJobProps?: MyPyProps;
  readonly isortJobProps?: IsortProps;
  readonly flake8JobProps?: Flake8Props;
  readonly pytestJobProps?: PytestProps;
  readonly evaluateGitTagPep440ConformityJobProps?: EvaluateGitTagPep440ConformityProps;
  readonly bDistWheelJobProps?: BdistWheelProps;
  readonly sphinxPropsJobProps?: SphinxProps;
}
export interface IFullStack {
  twineProdJob: TwineUpload;
  twineDevJob?: TwineUpload;
  mypyJob?: MyPy;
  isortJob: Isort;
  flake8Job: Flake8;
  pytestJob: Pytest;
  evaluateGitTagPep440ConformityJob: EvaluateGitTagPep440Conformity;
  bDistWheelJob: BdistWheel;
  sphinxJob?: Sphinx;
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
export class FullStack extends JobCollection implements IFullStack {
  twineDevJob?: TwineUpload;
  twineProdJob: TwineUpload;
  mypyJob?: MyPy;
  isortJob: Isort;
  flake8Job: Flake8;
  pytestJob: Pytest;
  evaluateGitTagPep440ConformityJob: EvaluateGitTagPep440Conformity;
  bDistWheelJob: BdistWheel;
  sphinxJob?: Sphinx;

  constructor(props: FullStackProps) {
    super();
    this.isortJob = new Isort(props.isortJobProps ?? {});
    this.flake8Job = new Flake8(props.flake8JobProps ?? {});
    this.pytestJob = new Pytest(props.pytestJobProps ?? {});
    this.evaluateGitTagPep440ConformityJob = new EvaluateGitTagPep440Conformity(
      props.evaluateGitTagPep440ConformityJobProps ?? {},
    );
    this.bDistWheelJob = new BdistWheel(props.bDistWheelJobProps ?? {});

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
      this.mypyJob = new MyPy(props.mypyJobProps);
      this.addChildren({ jobsOrJobCollections: [this.mypyJob] });
    }

    if (props.sphinxPropsJobProps) {
      this.sphinxJob = new Sphinx(props.sphinxPropsJobProps);
      this.sphinxJob.appendRules([
        RuleLib.onMain(),
        RuleLib.onMaster(),
        RuleLib.onTags(),
      ]);
      this.addChildren({ jobsOrJobCollections: [this.sphinxJob] });
    }

    if (props.twineDevJobProps) {
      this.twineDevJob = new TwineUpload(props.twineDevJobProps);
      this.twineDevJob.appendRules([
        RuleLib.onTags().never(),
        RuleLib.onSuccess(),
      ]);
      this.addChildren({
        jobsOrJobCollections: [this.twineDevJob],
        name: "dev",
      });
    }

    this.twineProdJob = new TwineUpload(props.twineProdJobProps);
    this.twineProdJob.appendRules([RuleLib.onTags()]);
    this.addChildren({
      jobsOrJobCollections: [this.twineProdJob],
      name: "stable",
    });
  }
}
