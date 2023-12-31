import gcip
from tests import conftest


def environment_pipeline(environment: str) -> gcip.Sequence:
    sequence = gcip.Sequence()
    sequence.add_children(
        gcip.Job(stage="job1", script=f"job-1-on-{environment}"),
        gcip.Job(stage="job2", script=f"job-2-on-{environment}"),
    )
    return sequence


def test():
    pipeline = gcip.Pipeline()
    for env in ["development", "test"]:
        pipeline.add_children(environment_pipeline(env), stage=env)

    conftest.check(pipeline.render())
