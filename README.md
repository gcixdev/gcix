# gcix - Write your GitLab CI pipelines in X languages

[![Apache License 2.0](https://img.shields.io/gitlab/license/gcix%2Fgcix)](https://gitlab.com/gcix/gcix/-/blob/main/LICENSE)

[![GitLab tag (self-managed)](https://img.shields.io/gitlab/v/tag/gcix%2Fgcix?logo=git&color=bright%20green)
](https://gitlab.com/gcix/gcix/-/tags)
[![GitLab pipeline status](https://img.shields.io/gitlab/pipeline-status/gcix%2Fgcix?logo=gitlab)
](https://gitlab.com/gcix/gcix/-/pipelines)
[![GitLab last commit](https://img.shields.io/gitlab/last-commit/Gcix%2Fgcix?logo=git)](https://gitlab.com/gcix/gcix/-/commits/main/)
[![GitLab contributors](https://img.shields.io/gitlab/contributors/gcix%2Fgcix?logo=git&color=bright%20green)](https://gitlab.com/gcix/gcix)

[![PyPI - Downloads](https://img.shields.io/pypi/dm/gcix?label=PyPI%20Downloads&logo=python&color=blue)](https://pypi.org/project/gcix/)
[![npm - Downloads](https://img.shields.io/npm/dm/%40gcix/gcix?label=NPM%20downloads&color=blue)](https://www.npmjs.com/package/@gcix/gcix)
[![Docker Pulls](https://img.shields.io/docker/pulls/gcix/gcix?label=Docker%20Pulls&logo=docker&color=blue)](https://hub.docker.com/r/gcix/gcix)

![Matrix](https://img.shields.io/matrix/gcix%3Amatrix.org?logo=matrix&label=Matrix)

The complete documentation is found at <https://gcix.gitlab.io/gcix/>

The GitLab CI X Library (*gcix*) is a library to create dynamic pipelines for GitLab CI.

With the *gcix* you can write your GitLab CI pipelines in multiple languages.

## Supported languages

* Typescript/JavaScript (**native**)
* Python

**A simple pipeline could look like...**

...this in **Typescript**

``` typescript
import { Pipeline, Job } from "gcix"

const pipeline = new Pipeline()
const job = new Job({stage: "build", scripts: ["docker build ."]})

pipeline.addChildren({jobsOrJobCollections: [job]})
pipeline.writeYaml()
```

...this in **Python**

``` python
from gcip import Pipeline, Job

pipeline = Pipeline()
job      = Job(stage="build", scripts=["docker build ."])

pipeline.add_children(jobs_or_job_collections=[job])
pipeline.write_yaml()
```

## Intro

The *gcix* is a rewrite of the *gcip*, the reason behind the rewrite is, that I wanted to learn Typescript, and give
developers the choice to use the language they are familiar with. This is because I chose Typescript and a tool called [jsii][10] made by [AWS][11].
*jsii* translates the different language API's to typescript. The user which uses Python is using Pythons syntax, behind the scenes they are getting
translated to Typescript.

### Examples

For a more complex and real world example, just check out our projects [.gitlab-ci.ts][1]. The [.gitlab-ci.ts][1] is the written example of a working *gcix* in Typescript. The Typescript code is getting rendered and stored as an artifact in the pipeline see [generated yaml file][2].

The *gcix* is using the GitLab feature of [dynamic child pipelines][3]. First the `.gitlab-ci.ts` generates the common GitLab CI yaml file which is then started as child pipeline. To get the generated pipeline it is necessary to invoke the `.gitlab-ci.ts` with `ts-node`. To get an idea of a [dynamic child pipelines][3] setup, you can have a look into [.gitlab-ci.yml][4].

Creating your pipelines in [any supported programming language](#supported-languages) code allows you all the features of that language, like:

* re-use code (DRY - Don't repeat yourself)
* use variables, control flow (if-then-else, loops, ...), complex data structures, input/output, error handling, ...
* programming paradigms like object-oriented or functional programming
* use 3rd party libraries in your pipelines
* test driven development of pipelines with Jest(Typescript), pytest(Python)...
* package management and distribution of your pipeline code
* ... anything you can imagine to do with Python code

## Documentation

Please read the [User Documentation][12] to get a quick introduction into most
features of the *gcix*.

You can consult the [API Reference][13] to get an overview of all classes and methods
and a deeper view into their parameters.

For more information on how to create your own library based on *gcix*, please read the [Developer Documentation][14]
to learn about good practices and conventions.

## Why pipelines as code?

There has been a really good discussion on [Hacker News][5] about *configuration vs code*.
Comments stating that when struggling around with the limitations of static configuration we start writing pipelines as code, until we hassle
around with complex code and start re-writing complex pipelines in static configuration and so forth.

It is absolutely right that pipelines as code are not new and have lots of drawbacks. Chances are good that you have the one guru in you company
loving this project and is writing weird pipelines that nobody else understands. Also comments state that pipelines are those basic things that
build and test your code and shouldn't be in code too, because then you might have a pipeline that build and test your pipeline code.

All those statements are quite true. However all those statements could be applied to static configuration. We started this project because of
GitLab CI yaml files growing over thousands of lines. We tried to implement some logic with clunky rule sets. We tried to re-use code with yaml templates.
We tried to write predefined pipelines by using includes. We started to write bash scripts that do bulk loads of work within a job. All in all
those felt like a bad workaround, while having in mind how much cleaner this might be, writing our pipelines in code. That is why we started
this project and since using it with great success.

However it is absolutely important to understand the *gcix* as a supplement and not as a substitution to GitLab CI yaml files. As long you are fine
with having a couple of jobs you could easily describe in static configuration, just do it. If you feel that you can't manage the complexity of
you static yaml configuration and started to build lots of helper scripts, you could consider writing your pipelines in code. This considerations
should include, if the pipeline code you write is definitely an advantage over the static scripts you had before - and not just for you but also
for your colleagues and the company you are writing the code for.

The *gcix* should be a choice - not a standard.

## Thanks

First of all, I have to thank [**Thomas Steinbach**][7] he created the [GitLab CI Python Library (gcip)][6] and started a great journey with GitLab CI pipelines as code.
Another thank you goes to the [DB Systel GmbH][8].

## Author

*gcix* was created by [Daniel von Eßen][9] in 2023.

## License

The content of this repository is licensed under the [Apache 2.0 license][15].

Copyright [Daniel von Eßen][9]

[1]: https://gitlab.com/gcix/gcix/-/blob/main/.gitlab-ci.ts
[2]: https://gitlab.com/gcix/gcix/-/jobs/artifacts/main/browse?job=generate-pipeline
[3]: https://docs.gitlab.com/ee/ci/parent_child_pipelines.html#dynamic-child-pipelines
[4]: https://gitlab.com/gcix/gcix/-/blob/main/.gitlab-ci.yml
[5]: https://news.ycombinator.com/item?id=26986493#26988105
[6]: https://gitlab.com/dbsystel/gitlab-ci-python-library
[7]: https://gitlab.com/thomassteinbach
[8]: https://www.dbsystel.de/
[9]: https://gitlab.com/dvonessen
[10]: https://aws.github.io/jsii/
[11]: https://aws.amazon.com/de/
[12]: https://gcix.gitlab.io/gcix
[13]: https://gcix.gitlab.io/gcix/api/
[14]: https://gcix.gitlab.io/gcix/developer/
[15]: http://www.apache.org/licenses/LICENSE-2.0
