import gcip
from tests import conftest


def job_for(service: str) -> gcip.Job:
    return gcip.Job(stage="update_service", script=f"./update-service.sh {service}")


def test():
    pipeline = gcip.Pipeline()
    for env in ["development", "test"]:
        for service in ["service1", "service2"]:
            pipeline.add_children(job_for(f"{service}_{env}"), stage=env, name=service)

    conftest.check(pipeline.render())
