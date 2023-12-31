import gcip
from tests import conftest


def test():
    pipeline = gcip.Pipeline()
    pipeline.add_children(gcip.Job(stage="print_date", script="date"))

    conftest.check(pipeline.render())
