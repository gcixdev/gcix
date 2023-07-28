# Core

The *gcix* is a Typescript library designed to facilitate the creation of
dynamic pipelines for Gitlab CI.

Additionally, it provides examples in both Typescript and Python.

Please select the language in which you want to see the examples.
=== "Typescript"
=== "Python"

## Configuring your project to use *gcix*

Your Gitlab project requires the following two files:

```plain
MyProject
├ .gitlab-ci.(ts|py)
└ .gitlab-ci.yml
```

The .gitlab-ci.yml file is the one you are familiar with, responsible for
rendering and triggering the child pipeline created with *gcix*.
The latter is written into the .gitlab-ci.ts file.

Now, let's examine how the .gitlab-ci.yml file should be
structured for this project:

``` yaml
--8<-- ".gitlab-ci.yml"
```

The pipeline code for gcix is written in the file named .gitlab-ci.ts.
The upcoming sections demonstrate how to create this pipeline code.

Alternatively, instead of installing gcix in a Node container,
you have the option to utilize the official Docker image that is
released for each tag.

In this case, the initial job would appear as follows:

``` yaml
generate-pipeline:
  stage: build
  image: gcix/gcix:1.0.0
  script: /usr/src/app/docker/gcip.sh
  artifacts:
    paths:
      - generated-config.yml
```

## Hints regarding the following examples

All the code examples in the upcoming chapters are designed to be
compatible with [Jest][1] or [pytest][2].

As an example, a code snippet could be as follows:

=== "Typescript"

    ``` ts
    import gcix
    import { check } from "../../comparison"

    test("test", () => {
      const pipeline = new gcix.Pipeline()
      pipeline.addChildren({
        job_or_job_collections: [
          new gcix.Job({
            stage: "print_date",
            script: "date"
          }
        )]
      });
      check(pipeline.render(), expect)
    });
    ```

    To transform this Jest test into a valid `.gitlab-ci.ts` file, you need to:

    * Remove the import statement: `import { check } from "../../comparison"`.
    * Place your pipeline code directly in the `gitlab-ci.ts`, outside the `#!ts test("test", () => {})` function.
    * Instead of testing the rendered pipeline with `check(pipeline.render(), expect)`,
    you should write the `generated-pipeline.yml` with `pipeline.writeYaml()`.

    The resulting `.gitlab-ci.ts` code derived from the example would look like the following:

=== "Python"

    ``` python
    import gcip
    from tests import conftest

    def test():
        pipeline = gcip.Pipeline()
        pipeline.add_children(jobs_or_job_collections: [gcip.Job(stage="print_date", script="date")])

        conftest.check(pipeline.render())
    ```

    To transform this [Pytest][2] code into a valid `.gitlab-ci.oy` file, you need to:

    * Remove the import statement: `from tests import conftest`..
    * Place your pipeline code directly in the `gitlab-ci.py`, outside the `def test():` function.
    * Instead of testing the rendered pipeline with `conftest.check(pipeline.render())`,
    you should write the `generated-pipeline.yml` with `pipeline.write_yaml()`.

The resulting `.gitlab-ci.(ts|py)` file, derived from the example, would look like the following:

=== "Typescript"

    ``` typescript
    import gcix

    pipeline = new gcix.Pipeline()
    pipeline.addChildren({
      jobsOrJobCollections: [
        new gcix.Job(stage="print_date", script="date")
      ]
    });

    pipeline.writeYaml()
    ```

=== "Python"

    ``` python
    import gcix

    pipeline = gcix.Pipeline()
    pipeline.add_children(jobs_or_job_collection=[gcix.Job(stage="print_date", script="date")])

    pipeline.write_yaml()
    ```

## Create a pipeline with one job

**Input:**

=== "Typescript"

    ``` typescript
    --8<-- "test/unittest/docs/pipe_with_one_job.test.ts"
    ```
    Keep in mind that, as mentioned in the
    [Hints regarding the following examples](#hints-regarding-the-following-examples),
    your pipeline code should conclude with `#!ts pipeline.writeYaml()`.

=== "Python"

    ``` python
    --8<-- "pytest/unittest/docs/test_pipe_with_one_job.py"
    ```
    Keep in mind that, as mentioned in the
    [Hints regarding the following examples](#hints-regarding-the-following-examples),
    your pipeline code should conclude with `#!py pipeline.write_yaml()`.

**Output:**

``` yaml
--8<-- "test/unittest/docs/comparison_files/pipe_with_one_job.test/test.yaml"
```

## Configure jobs

To configure jobs, you can utilize the following methods:

**Input:**

=== "Typescript"

    ```typescript
    --8<-- "test/unittest/docs/configure_jobs.test.ts"
    ```
=== "Python"

    ```python
    --8<-- "pytest/unittest/docs/test_configure_jobs.py"
    ```

**Output:**

``` yaml
--8<-- "test/unittest/docs/comparison_files/configure_jobs.test/test.yaml"
```

## Bundling jobs as collections

The class `JobCollection` allows you to group jobs together to apply a
common configuration to all included jobs. This collection shares the same
configuration methods as demonstrated in the previous example
for individual jobs.

**Input:**

=== "Typescript"

    ```typescript
    --8<-- "test/unittest/docs/bundling_jobs.test.ts"
    ```
    As evident from the output, jobs can have their own configurations
    (indicated by `#!py job1.prependScripts([...])`), and they can also inherit
    common configurations from their collection (indicated by
    `#!py collection.prependScripts([...])`).

=== "Python"

    ```python
    --8<-- "pytest/unittest/docs/test_bundling_jobs.py"
    ```

    As evident from the output, jobs can have their own configurations
    (indicated by `#!py job1.prepend_scripts([...])`), and they can also inherit
    common configurations from their collection (indicated by
    `#!py collection.prepend_scripts([...])`).

*Output:*

``` yaml
--8<-- "test/unittest/docs/comparison_files/bundling_jobs.test/test.yaml"
```

## Stacking collections

*Input:*

=== "Typescript"

    ```ts
    --8<-- "test/unittest/docs/stacking_collections.test.ts"
    ```

=== "Python"

    ```py
    --8<-- "pytest/unittest/docs/test_stacking_collections.py"
    ```

*Output:*

``` yaml
--8<-- "test/unittest/docs/comparison_files/stacking_collections.test/test.yaml"
```

## Pipelines are collections

`Pipelines` are an expanded version of a `JobCollection` and include all of
its capabilities (in addition to pipeline-specific abilities).
This includes configuration options and the ability to stack
other collections within them.

*Input:*

=== "Typescript"

    ```ts
    --8<-- "test/unittest/docs/pipelines_are_collections.test.ts"
    ```

=== "Python"

    ```py
    --8<-- "pytest/unittest/docs/test_pipelines_are_collections.py"
    ```

*Output:*

``` yaml
--8<-- "test/unittest/docs/comparison_files/pipelines_are_collections.test/test.yaml"

```

## Stages allow reuse of jobs and collections

Suppose you intend to reuse a parameterized job. The following code illustrates an *incorrect* example:

=== "Typescript"

    ```ts
    --8<-- "test/unittest/docs/missing_stage.test.ts"
    ```

=== "Python"

    ```py
    --8<-- "pytest/unittest/docs/test_missing_stage.py"
    ```

When rendering this pipeline, it results in an error.

``` plain

Error: Two jobs have the same name 'do-something' when rendering the pipeline
Please fix this by providing a different name and/or stage when adding those jobs to their collections/pipeline.
```

The error arises because both jobs were added with the same name to the
pipeline, causing the second job to overwrite the first one.

To avoid such conflicts, when adding jobs or collections to a collections,
you should use the `.addChildren()` method, which accepts the `stage` property.
You can utilize this property to modify the name of the jobs added.
The value of `stage` will be appended to the jobs' `name` and `stage`.
However, please note that this modification only applies to the jobs or
collections added at that moment and not to the jobs and collections already
present within the collection.

### Reuse jobs

*Input:*

=== "Typescript"

    ```ts
    --8<-- "test/unittest/docs/stage_job.test.ts"
    ```

=== "Python"

    ```py
    --8<-- "pytest/unittest/docs/test_stage_job.py"
    ```

The error occurred because we added both jobs to the collection with different
stage values. By doing so, in the output, we correctly populate one job per
environment, ensuring that each job is appropriately associated with its
respective environment.

*Output:*

``` yaml
--8<-- "test/unittest/docs/comparison_files/stage_job.test/test.yaml"
```

### Reuse collections

Namespacing significantly enhances the reusability of collections.
You can encapsulate an entire Gitlab CI pipeline within a collection and then
reuse that collection for each environment. By repeating the collection within
a loop for all environments, namespacing ensures that all jobs of the
collection are populated uniquely for each environment, enabling efficient
configuration management and deployment.

*Input:*

=== "Typescript"

    ```ts
    --8<-- "test/unittest/docs/stage_collections.test.ts"
    ```

=== "Python"

    ```py
    --8<-- "pytest/unittest/docs/test_stage_collections.py"
    ```

*Output:*

``` yaml
--8<-- "test/unittest/docs/comparison_files/stage_collections.test/test.yaml"
```

## Parallelization - name, stage

As evident from the previous examples, all jobs possess a distinct `stage`,
causing them to run within collections. This behavior occurs because the
`stage` property always extends the job's `name` and `stage`. This principle
applies universally to all `stage` properties, be it for the constructor of a
Job object or the `.add_*()` methods of a collection.

When adding jobs to a collection, whether directly or within another
collection, the objective is to merely extend the `name` of the jobs, leaving
their `stage` unchanged. This approach ensures that jobs with equal stages
can run in parallel.

To achieve this, you can set identical values for the `stage` property while
providing different values for the `name` property when creating jobs or
adding them to collections. By doing so, the `name` property will extend only
the name of a job without affecting its `stage`.

### `name` property when creating jobs

*Input:*

=== "Typescript"

    ```ts
    --8<-- "test/unittest/docs/parallel_jobs.test.ts"
    ```

=== "Python"

    ```py
    --8<-- "pytest/unittest/docs/test_parallel_jobs.py"
    ```

*Output:*

``` yaml
--8<-- "test/unittest/docs/comparison_files/parallel_jobs.test/test.yaml"
```

In this scenario, we have chosen an equal value for the `stage` parameter,
ensuring that both jobs have the same stage. To prevent their `name` values
from being identical (and risking the second job overwriting the first one),
we have also provided the `name` property. The `name` property's value will be
appended to the existing `name` of the jobs. Consequently, both jobs will run
in parallel within the same stage.

You might wonder why there is no dedicated `stage` property. When considering
collections, the `stage` property would extend both the `name` and `stage` of
a job, while the `name` property would only extend the `name` of a job.
Extending means appending values to the current `name` or `stage` values of a
job. However, there's no practical reason to solely extend the `stage` of a job
so that two jobs have distinct stages but unique names. In Gitlab CI, a job
must have a unique name, so extending just the `stage` wouldn't serve any
purpose. Therefore, the consistent concept of using only the `name` and `stage`
properties applies to both jobs and collections.

As for not omitting the `stage` property when creating the jobs, it is because
of the explanation in the previous paragraph. When creating jobs, we cannot
directly set the `stage` value. Omitting the `stage` property means leaving it
unset, which would default the Gitlab CI jobs to the `test` stage. To define a
stage other than `test`, we used the `stage` property. Yes, this implies that
the job's `name` will include the value of the `stage`. However, this design
decision clarifies the concept of `name` and `stage` more effectively than
providing a `stage` property for jobs, especially when collections lack such a
(superfluous) `stage` property.

No worries! Here's a simple guide to keep in mind when creating Jobs:

1. For distinct jobs that will run in separate stages within a collection,
set different values only for the `stage` property.
2. For distinct jobs that will run in parallel with equal stages, set different
values only for the `name` property.
3. For distinct jobs that will run in parallel with equal stages and a defined
stage name, set different values for the `name` properties but equal values for
the `stage` properties.
4. Setting different values for both properties is not advisable and will
result in the first scenario of distinct jobs running in separate stages
within a collection.

### `name` parameter when adding jobs (and collections) to collections

Let's consider the collection example from the chapter
[Stages allow reuse of jobs and collections](#stages-allow-reuse-of-jobs-and-collections).
Instead of using the `stage` parameter when adding the collection multiple
times to the pipeline, we will now utilize the `name` parameter.

*Input:*

=== "Typescript"

    ```ts
    --8<-- "test/unittest/docs/parallel_collections.test.ts"
    ```

=== "Python"

    ```py
    --8<-- "pytest/unittest/docs/test_parallel_collections.py"
    ```

Now the environments run in parallel, because just the job names are populated per environment but
not the stage names.

*Output:*

``` yaml
--8<-- "test/unittest/docs/comparison_files/parallel_collections.test/test.yaml"
```

You can also combine the usage of `stage` and `name` when adding jobs.
This approach is particularly useful when dealing with a large number of jobs,
where some groups of jobs should run sequentially while jobs within each group
should run in parallel. Here's an example to illustrate this scenario:

*Input:*

=== "Typescript"

    ```ts
    --8<-- "test/unittest/docs/mix_stage_and_name.test.ts"
    ```

=== "Python"

    ```py
    --8<-- "pytest/unittest/docs/test_mix_stage_and_name.py"
    ```

The output shows that two services are being updated in parallel but within
consecutive stages.

*Output:*

``` yaml
--8<-- "test/unittest/docs/comparison_files/mix_stage_and_name.test/test.yaml"
```
