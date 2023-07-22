[![pipeline status](https://gitlab.com/gcix/gcix/badges/main/pipeline.svg)](https://gitlab.com/gcix/gcix/-/commits/main)
![coverage](https://gitlab.com/gcix/gcix/badges/main/coverage.svg?job=test-jest-test)
<https://gitlab.com/gcix/gcix/badges/main/-/badges/release.svg?order_by=release_at>

# gcip - Write your Gitlab CI pipelines in Python

The Gitlab CI Python Library (gcip) is a Library to create dynamic pipelines for Gitlab CI.

[User Documentation](https://dbsystel.gitlab.io/gitlab-ci-python-library/user/index.html) | [API Reference](https://dbsystel.gitlab.io/gitlab-ci-python-library/api/gcip/index.html) | [Developer Documentation](https://dbsystel.gitlab.io/gitlab-ci-python-library/developer/index.html) | [PyPI](https://pypi.org/project/gcip/) | [Docker Hub](https://hub.docker.com/r/thomass/gcip)

With the gcip and the ease and power of Python you can write Gitlab CI pipelines
of any complexity in well manageable Python code.

A simple starting pipeline could look like following:

```
from gcip import Pipeline, Job

pipeline = Pipeline()
job      = Job(stage="build", script="docker build .")

pipeline.add_children(job)
pipeline.write_yaml()
```

For a more complex and real world example, just check out [.gitlab-ci.py](https://gitlab.com/dbsystel/gitlab-ci-python-library/-/blob/main/.gitlab-ci.py). This is the Python Gitlab CI pipeline of this project written with its own library. And second check out the [generated yaml file](https://gitlab.com/dbsystel/gitlab-ci-python-library/-/jobs/artifacts/main/browse?job=generate-pipeline) of the Python code.

The gcip is using the Gitlab feature of [dynamic child pipelines](https://docs.gitlab.com/ee/ci/parent_child_pipelines.html#dynamic-child-pipelines). First the `.gitlab-ci.py` generates the common Gitlab CI yaml file which is then started as child pipeline.

Creating your pipelines in Python code allows you all the features of that language, like:

* re-use code (DRY - Dont Repeat Yourself)
* use variables, control flow (if-then-else, loops, ...), complex data structures, input/output, error handling, ...
* programming paradigms like object-oriented or functional programming
* use 3rd party libraries in your pipelines, like boto3
* test driven development of Pipelines with pytest
* package management and distribution of your pipeline code
* ... anything you can imagine to do with Python code

## Documentation

Please read the [User Documentation](https://dbsystel.gitlab.io/gitlab-ci-python-library/user/index.html) to get a quick introduction into most
features of the gcip.

You can consult the [API Reference](https://dbsystel.gitlab.io/gitlab-ci-python-library/api/gcip/index.html) to get an overview of all classes and methods
and a deeper view into their parameters.

For more information on how to create your own library based on gcip, please read the [Developer Documentation](https://dbsystel.gitlab.io/gitlab-ci-python-library/developer/index.html)
to learn about good practices and conventions.

## Why pipelines as code?

There has been a really good discussion on [Hacker News](https://news.ycombinator.com/item?id=26986493#26988105) about _configuration vs code_.
Comments stating that when struggeling around with the limitations of static configuration we start writing pipelines as code, until we hassle
around with complex code and start re-writing complex pipelines in static configuration and so forth.

It is absolutely right that piplines as code are not new and have lots of drawbacks. Chances are good that you have the one guru in you company
loving this project and is writing weird piplines that nobody else understands. Also comments state that pipelines are those basic things that
build and test your code and shouldn't be in code too, because then you might have a pipeline that build and test your pipeline code.

All those statements are quite true. However all those statements could be applied to static configuration. We started this project because of
Gitlab CI yaml files growing over thousands of lines. We tried to implement some logic with clunky rule sets. We tried to re-use code with yaml templates.
We tried to write predefined pipelines by using includes. We started to write bash scripts that do bulk loads of work within a job. All in all
those felt like a bad workaround, while having in mind how much cleaner this might be, writing our pipelines in code. That is why we started
this project and since using it with great success.

However it is absolutely important to understand the gcip as a supplement and not as a substitution to Gitlab CI yaml files. As long you are fine
with having a couple of jobs you could easily describe in static configuration, just do it. If you feel that you can't manage the complexity of
you static yaml configuration and started to build lots of helper scripts, you could consider writing your pipelines in code. This considerations
should include, if the pipeline code you write is definitly an advantage over the static scripts you had before - and not just for you but also
for your colleagues and the company you are writing the code for.

The gcip should be a choice - not a standard.

## Author

gcip was created by [Thomas Steinbach](mailto:thomas.t.steinbach@deutschebahn.com) in 2020.

Thanks to initial contributions from [Daniel von Eßen](mailto:daniel.von-essen@deutschebahn.com)

## Licence

The content of this repository is licensed under the [Apache 2.0 license](http://www.apache.org/licenses/LICENSE-2.0).

Copyright DB Systel GmbH
