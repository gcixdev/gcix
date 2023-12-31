import gcip
from tests import conftest


def test():
    pipeline = gcip.Pipeline()

    job = gcip.Job(stage="print_date", script="date")
    job.set_image("docker/image:example")
    job.prepend_scripts("./before-script.sh")
    job.append_scripts("./after-script.sh")
    job.add_variables(USER="Max Power", URL="https://example.com")
    job.add_tags("test", "europe")
    job.artifacts.add_paths("binaries/", ".config")
    job.append_rules(gcip.Rule(if_statement="$MY_VARIABLE_IS_PRESENT"))

    pipeline.add_children(job)

    conftest.check(pipeline.render())
