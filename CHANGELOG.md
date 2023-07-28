
## 0.0.0 (2023-07-24)


### Features

* :art: Added readonly properties to IArtifacts interface. ([3f65e9d](https://gitlab.com/gcix/gcix/commit/3f65e9ddb492b0cc330d4f97bde8bd90ac54bde8))
* :art: Now it is possible to omit paths property for ArtifactsProps ([2aa3b25](https://gitlab.com/gcix/gcix/commit/2aa3b254ad444b52aa965be9d8e983a988ffa3e9))
* :sparkles:  Added pipeline.ts ([a354017](https://gitlab.com/gcix/gcix/commit/a354017fc49828517e9bc8cb51e8ba94b453ecc3))
* :sparkles: Added artifacts.ts ([7fc23bf](https://gitlab.com/gcix/gcix/commit/7fc23bff428aff39ecba77a1cadfaf4f12529ba3))
* :sparkles: Added base module. ([1576df3](https://gitlab.com/gcix/gcix/commit/1576df3286a1485f48515f1145a65a16c08f96a9))
* :sparkles: Added cache.ts ([6696409](https://gitlab.com/gcix/gcix/commit/669640921b2800b51afea10e3aa430ad32c305f4))
* :sparkles: Added image module. ([f08d8a3](https://gitlab.com/gcix/gcix/commit/f08d8a3ac3f6daac8f520fa8b39ebd0d48c89d4e))
* :sparkles: Added include.ts ([a5acf59](https://gitlab.com/gcix/gcix/commit/a5acf59b4b653aea0d914aa46c6b4858836cce56))
* :sparkles: Added needs.ts. ([304442e](https://gitlab.com/gcix/gcix/commit/304442ef5d577eba42c2627b30b452eac6f0fc64))
* :sparkles: Added specialized TriggerJob class to job.ts. ([2510525](https://gitlab.com/gcix/gcix/commit/251052524528ec8a77607636d5c77e6ae2d6b37e))
* :sparkles: Added valid-url.ts ([0e5e5d7](https://gitlab.com/gcix/gcix/commit/0e5e5d72b3776312e46c73d1efedc1635c9f8d20))
* :sparkles: Added variables.ts. ([1573417](https://gitlab.com/gcix/gcix/commit/1573417528f959236e7ccea3536c43022d3beb30))
* **internal:** :sparkles: Added OrderedStringSet class to allow ordered sets without using map. ([82d69e2](https://gitlab.com/gcix/gcix/commit/82d69e2b87962321d4b944c2fcef8a7dfd733c4c))
* **internal:** :sparkles: Added simple deepcopy function. ([042db86](https://gitlab.com/gcix/gcix/commit/042db86b8821fd60b49774cced0abaf26052d47e))
* **job:** :sparkles: Added Job and JobCollection classes. ([94cc719](https://gitlab.com/gcix/gcix/commit/94cc7190ad09ef7d7f9711b49b9a2e0762a1798d))
* **rules:** :sparkles: Added rules.ts. ([a86c320](https://gitlab.com/gcix/gcix/commit/a86c3208f9e3ff5458190026ec66ee072991914a))
* **services:** :sparkles: Added service.ts. ([55dfdae](https://gitlab.com/gcix/gcix/commit/55dfdaef50f452ec2776e92dbe804dfd6933580c))


### Bug Fixes

* :bug: add parent to child instead of `this´ ([f14545f](https://gitlab.com/gcix/gcix/commit/f14545f465b1dd7ad00a59b27624097bd768e34b))
* :bug: Added missing import ([1065b1c](https://gitlab.com/gcix/gcix/commit/1065b1cc8278c2882517ba0f692d268d2b4ff56e))
* :bug: Added readonly to interfaces and classes to fix JSII compile ([d8f156e](https://gitlab.com/gcix/gcix/commit/d8f156e4e5d5ac5ace51583d37b1110349812774))
* :bug: Better checkinf for CI env var if it is actually "true" and not initialized. ([2d07c0a](https://gitlab.com/gcix/gcix/commit/2d07c0a7bbbcdad480279b2c19f1f86479f64f60))
* :bug: Check job.dependencies for initialization instead of this. ([56e0200](https://gitlab.com/gcix/gcix/commit/56e0200b1630d788b1d9ea35df0f8cb2f235cdc9))
* :bug: Converted orderedTagsForOverride to orderedTagsForReplacement ([ecdd41d](https://gitlab.com/gcix/gcix/commit/ecdd41d6b543d7fdf74222e01b185b820aeb6a74))
* :bug: Do not use yaml anchor or references. ([87d322c](https://gitlab.com/gcix/gcix/commit/87d322c98baa2da9e13368968c3c0ffaa8270f38))
* :bug: Fixed Artifacts class to allow compilation with JSII ([9886b32](https://gitlab.com/gcix/gcix/commit/9886b322ca9385560601953ae93296bedb5067ca))
* :bug: Fixed bug where overrideTags method did replace tags on jobs. ([f788db8](https://gitlab.com/gcix/gcix/commit/f788db896b7942cacd5afc633cccabf2435ee1e6))
* :bug: Fixed call of normalize() in sanitize-path.ts. ([981dab8](https://gitlab.com/gcix/gcix/commit/981dab8dd3fdcfc73f5b146aa102a2d94ef30284))
* :bug: Fixed closing forEach block in consturctor to initialize this.path. ([0fe9678](https://gitlab.com/gcix/gcix/commit/0fe96782e58a2ffc2e49a604b7896b0592054109))
* :bug: Fixed Image.withTag and Image.withEntrypoint method ([962d388](https://gitlab.com/gcix/gcix/commit/962d38801c72e190672f9bf16e40a3c06d59b57e))
* :bug: Fixed missing initialization for collection name if only stage is instead of stage and name is given to a collection. ([286c56c](https://gitlab.com/gcix/gcix/commit/286c56c679f838263aa948d3b4f32900f8ca0055))
* :bug: Fixed PredefinedVariables for optional values. ([96e2004](https://gitlab.com/gcix/gcix/commit/96e200463976f6f2e193b3399677dca8f90cc458))
* :bug: Fixed Rules.never() method. ([5eef626](https://gitlab.com/gcix/gcix/commit/5eef626aaf0ad0def9213508507313947382265c))
* :bug: Fixed that that if checking of truthiness with an OrderedStringSet to use .size property. ([0a1b5b8](https://gitlab.com/gcix/gcix/commit/0a1b5b8cd468b616a36bdec9f2657f132b3491db))
* :bug: Fixed typing for ArtifactsReport ([9b25e57](https://gitlab.com/gcix/gcix/commit/9b25e576bbec45d41899aecea07dab66873aebf2))
* :bug: Fixed wrong return for OrderedStringSet, it must be Array. ([365b9d9](https://gitlab.com/gcix/gcix/commit/365b9d95d42ee66d4d5b9edcf87e54d50381dd94))
* :bug: Initialize allowFailure with nullish operator and fixe assignement if exit_codes are used. ([e95a97d](https://gitlab.com/gcix/gcix/commit/e95a97d5e09087f89b4484e5c2fed12631fb1f11))
* :bug: Method overrideRules did not override rules. ([4f1ef75](https://gitlab.com/gcix/gcix/commit/4f1ef75f63d738c9b4a322e860d7068cc6387a7a))
* :bug: Missing `readonly` for interface. ([90bda42](https://gitlab.com/gcix/gcix/commit/90bda42247089f55440c2e2092b85a27ac2f82e0))
* :bug: Removed [] from addNeeds() method. ([a0b119f](https://gitlab.com/gcix/gcix/commit/a0b119f0470175b3c70736e4e73a065adf806707))
* :bug: Removed unintentionally used nested Array for assignNeeds. ([5e0e28d](https://gitlab.com/gcix/gcix/commit/5e0e28db3e278d793f42ebbf110e60a6a83d206c))
* :bug: Renamed Pipeline.write_yaml to Pipeline.writeYaml ([e5155bc](https://gitlab.com/gcix/gcix/commit/e5155bcc7f0d858c6839bb7baa8bd2746f982acb))
* :bug: Use length property in if statement of ownInstanceNames ([ebda028](https://gitlab.com/gcix/gcix/commit/ebda02864e42829c03a2123f5381bb4a13884fc5))
* :bug: Using JSON.stringify inside Artifacts.isEqual method. ([7317cb9](https://gitlab.com/gcix/gcix/commit/7317cb9549d4ecbb11046e7d9cf8c6b2fdcaf80c))
* :bug: Using JSON.stringify inside Cache.isEqual and CacheKey.isEqual methods. ([9e5401d](https://gitlab.com/gcix/gcix/commit/9e5401d8eab20ee5a8dc1555853e5885c3e80048))
* :bug: Using JSON.stringify inside Image.isEqual method. ([b1483de](https://gitlab.com/gcix/gcix/commit/b1483de98c5ac618c9fb1af638cc183a2bb2894e))
* :bug: Using JSON.stringify inside Include.isEqual methods. ([e22d140](https://gitlab.com/gcix/gcix/commit/e22d140f57ae0637828a91e500bddf70c31808a3))
* :bug: Using JSON.stringify inside Need.isEqual methods. ([e2a34f2](https://gitlab.com/gcix/gcix/commit/e2a34f2ce166008ee93a17f1fd446cf5497e9bf6))
* :bug: Using JSON.stringify inside Rule.isEqual method. ([1227d41](https://gitlab.com/gcix/gcix/commit/1227d416a088e11219fe1340c2fe04f0b5e09867))
* :bug: Using JSON.stringify inside Service.isEqual methods. ([a5d65ad](https://gitlab.com/gcix/gcix/commit/a5d65add46a8926a38938b8e56f89ca5d2edc930))
* :bug: Using lodash.cloneDeep to clone objects ([8adc5fe](https://gitlab.com/gcix/gcix/commit/8adc5fef6f1538d54fff0600df4d79773954d7ae))
* :bug: Using rulesToPrepend instead of rulesToAppend to prependRules to a Job ([1d04732](https://gitlab.com/gcix/gcix/commit/1d047325a1fecd8dbd05a93165f0d4ae89cd7d7c))
* :rewind: Revert back quotingType ([88418db](https://gitlab.com/gcix/gcix/commit/88418db1324e379cfcab2dca9883e18fce156fce))
* :truck: Renamed all static methods in PredefinedVariables class to match camel case style, that allow compiling and packaging. ([0af172c](https://gitlab.com/gcix/gcix/commit/0af172c2ad4376c03fa646bb8e64cff1efca7610))
* **job:** :bug: Fixed various bugs in job.ts and job-collection.ts ([1d0dab9](https://gitlab.com/gcix/gcix/commit/1d0dab9baf14f7a1bdb9a6255b9e58b22ec3216e))
* **pipeline:** :bug: Do not sortKeys and use now flow style when generated-config.yml is written to disk from pipeline. ([2389b82](https://gitlab.com/gcix/gcix/commit/2389b82693ed5b08bff593ec3a010776cee63b4a))
