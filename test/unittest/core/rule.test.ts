import { Rule, WhenStatement } from '../../src/core/rule';
import { ComparisonCheck } from '../comparison';

test('test rule arguments', () => {
  const rule = new Rule(
    {
      ifStatement: 'true',
      when: WhenStatement.ONFAILURE,
      allowFailure: true,
      changes: ['changed_file_1', 'changed_file_2'],
      exists: ['file_exists'],
      variables: {
        MY: 'value',
        GCIX: 'so_cool',
      },
    },
  );
  ComparisonCheck(rule.render(), expect);
});

// def test_rule_arguments(pipeline, job_foo):
//     job_foo.append_rules(
//         Rule(
//             if_statement="true",
//             when=WhenStatement.ON_FAILURE,
//             allow_failure=True,
//             changes=["file1", "file2"],
//             exists=["file3"],
//             variables={"MY": "value"},
//         )
//     )
//     conftest.check(pipeline.render())


// def test_on_success(pipeline, job_foo):
//     job_foo.append_rules(rules.on_success())

//     conftest.check(pipeline.render())


// def test_rule_order(pipeline):
//     sequence = Sequence()
//     sequence.prepend_rules(Rule(if_statement="1"))
//     sequence.append_rules(Rule(if_statement="2"))

//     job = Job(stage="testjob", script="foo")
//     sequence.add_children(job)

//     job.append_rules(Rule(if_statement="a"), Rule(if_statement="b"))
//     job.prepend_rules(Rule(if_statement="c"), Rule(if_statement="d"))

//     sequence.append_rules(Rule(if_statement="3"))
//     sequence.prepend_rules(Rule(if_statement="4"))

//     job.append_rules(Rule(if_statement="e"), Rule(if_statement="f"))
//     job.prepend_rules(Rule(if_statement="g"), Rule(if_statement="h"))

//     sequence.append_rules(Rule(if_statement="5"))
//     sequence.prepend_rules(Rule(if_statement="6"))

//     pipeline.add_children(sequence)

//     conftest.check(pipeline.render())


// def test_init_empty_rules(pipeline, job_foo):
//     pipeline.initialize_rules(Rule(if_statement="foo"), Rule(if_statement="bar"))
//     conftest.check(pipeline.render())


// def test_init_non_empty_rules(pipeline, job_foo):
//     pipeline.initialize_rules(Rule(if_statement="foo"), Rule(if_statement="bar"))
//     job_foo.append_rules(Rule(if_statement="keep"), Rule(if_statement="those"), Rule(if_statement="rules"))
//     conftest.check(pipeline.render())


// def test_override_rules(pipeline, job_foo):
//     pipeline.override_rules(Rule(if_statement="new"), Rule(if_statement="values"))
//     job_foo.append_rules(Rule(if_statement="replace"), Rule(if_statement="those"), Rule(if_statement="rules"))
//     conftest.check(pipeline.render())


// def test_never(pipeline, job_foo, job_bar):
//     rule = Rule(if_statement="new")
//     rule_never = rule.never()

//     job_foo.append_rules(rule)
//     job_bar.append_rules(rule_never)

//     assert rule._when == WhenStatement.ON_SUCCESS
//     assert rule_never._when == WhenStatement.NEVER
//     conftest.check(pipeline.render())
