
### [0.0.56](https://gitlab.com/gcix/gcix/compare/v0.0.55...v0.0.56) (2024-05-13)


### Chore

* **deps:** lock file maintenance ([231bd1d](https://gitlab.com/gcix/gcix/commit/231bd1d8db43d9292122b3e36982d9747fc814d8))
* **deps:** update aws-sdk-client-mock monorepo to v4 ([d3ec909](https://gitlab.com/gcix/gcix/commit/d3ec909137c821f32b4c3e91f8bc965a7c277784))

### [0.0.55](https://gitlab.com/gcix/gcix/compare/v0.0.54...v0.0.55) (2024-02-22)

### [0.0.54](https://gitlab.com/gcix/gcix/compare/v0.0.53...v0.0.54) (2024-02-22)


### Features

* Only run pipeline on git tag if release is triggerd and not on main. ([cba4b1b](https://gitlab.com/gcix/gcix/commit/cba4b1b65affba6c0c1e5eaaf9eee6cbfc7ed6c3))

### [0.0.53](https://gitlab.com/gcix/gcix/compare/v0.0.52...v0.0.53) (2024-02-22)


### Features

* Create a rerelease based on v0.0.52 release. ([430d8e6](https://gitlab.com/gcix/gcix/commit/430d8e600ba084008f91af2a3ef8a65e56ca466c))

### [0.0.52](https://gitlab.com/gcix/gcix/compare/v0.0.51...v0.0.52) (2024-02-22)


### Features

* Increased node lts version to v20. ([e9767c0](https://gitlab.com/gcix/gcix/commit/e9767c0f2419d2caeb32d9380f0af6a4f51a21df))


### Bug Fixes

* **cfnwaiter:** :bug: Fixed wrong types in cfnwaiter script. ([eef78fe](https://gitlab.com/gcix/gcix/commit/eef78fe8b8cbd8727f07f4b8a9a9cc253f0247a7))


### Documentation

* :memo: Migrate to material.extensions.emoji from materialx.emoji. ([dfccd42](https://gitlab.com/gcix/gcix/commit/dfccd428215f180a80b87118cd7e8490384c0930))
* Added automatically detect colorscheme from os by default. ([62d0b40](https://gitlab.com/gcix/gcix/commit/62d0b40d3679f39bb018573f717acfcfdb4eb765))
* Only render/generate git information in CI system. ([0b10970](https://gitlab.com/gcix/gcix/commit/0b10970919c810cbf65377af9fc9760e1ea0ff1e))
* Use better tooltips. ([b1ad16a](https://gitlab.com/gcix/gcix/commit/b1ad16af918fd551a3aacafd55654afc6ce0bdfb))
* Use Materials privacy plugin. ([ee912be](https://gitlab.com/gcix/gcix/commit/ee912be32d8bfc37a0963dd3eea1a5c4a96376f2))
* Using gitlab icon for repository view. ([88941e0](https://gitlab.com/gcix/gcix/commit/88941e02b3149a1baf4f9902e3198b22f419a51d))


### Chore

* **deps:** :arrow_up: Updated dependencies. ([9df961d](https://gitlab.com/gcix/gcix/commit/9df961d8ee299a41505a898e08749f3e7d0d456d))
* **deps:** :arrow_up: Upgraded jsii dependency ([af27667](https://gitlab.com/gcix/gcix/commit/af27667ce52790e81b37448c17a295f4734ad98c))
* **deps:** lock file maintenance ([f223214](https://gitlab.com/gcix/gcix/commit/f2232144b5d40b403bd701c61d4ae1d9b13180cb))
* **deps:** update dependency eslint-config-prettier to v9 ([4645a38](https://gitlab.com/gcix/gcix/commit/4645a381f69072151d57b5590f1d66dde116e403))
* **deps:** update dependency mike to v2 ([093d0a6](https://gitlab.com/gcix/gcix/commit/093d0a6ed46c45f67364c3390590acb2222bd488))
* Migrated to mike version 2.x ([9990adc](https://gitlab.com/gcix/gcix/commit/9990adcc795ea59e4d562d82467eedab60c381bf))
* **release:** 0.0.52 ([055c8a8](https://gitlab.com/gcix/gcix/commit/055c8a8cc8f07b2ed0634d32bac2056e171ac498))
* Trying a rerelease of v0.0.52 ([dfd9fce](https://gitlab.com/gcix/gcix/commit/dfd9fce04d389d5d09e0a01af6592e61be055541))

### [0.0.51](https://gitlab.com/gcix/gcix/compare/v0.0.50...v0.0.51) (2024-02-22)


### Chore

* **deps:** update dependency jsii-docgen to v10 ([f1a9133](https://gitlab.com/gcix/gcix/commit/f1a9133cd8edbdd054ee1005d43632d6fcae608a))

### [0.0.50](https://gitlab.com/gcix/gcix/compare/v0.0.49...v0.0.50) (2023-12-30)


### Features

* :sparkles: Added docker hub container push. ([15cab53](https://gitlab.com/gcix/gcix/commit/15cab5388702837b7b9c45c929b49f21bd1c6941))

### [0.0.49](https://gitlab.com/gcix/gcix/compare/v0.0.48...v0.0.49) (2023-12-21)


### Bug Fixes

* **addons:** :bug: Fixed imagePath for dive jobs. ([889ac5e](https://gitlab.com/gcix/gcix/commit/889ac5e894d9fc6a3a1c16578a77798bdbcb8c4d))

### [0.0.48](https://gitlab.com/gcix/gcix/compare/v0.0.47...v0.0.48) (2023-12-21)


### Bug Fixes

* **addons:** :bug: Fixed bug where kaniko and crane jobs are not creating container image directory. ([c383893](https://gitlab.com/gcix/gcix/commit/c38389373872298feb4a081b38cca634a186a1e6))

### [0.0.47](https://gitlab.com/gcix/gcix/compare/v0.0.46...v0.0.47) (2023-12-21)


### Features

* **addons:** :sparkles: All container jobs and collections are producing a distinct container imagePath/tarPath which contains the imageTag as well. ([d40112a](https://gitlab.com/gcix/gcix/commit/d40112aab1701b2cbca9eec305fbcb054c8843d9))

### [0.0.46](https://gitlab.com/gcix/gcix/compare/v0.0.45...v0.0.46) (2023-12-20)


### Bug Fixes

* :ci: Fixed order of stages. ([3383c3f](https://gitlab.com/gcix/gcix/commit/3383c3f22732f26fb4ac358ff4d68afa1d4d8f61))

### [0.0.45](https://gitlab.com/gcix/gcix/compare/v0.0.44...v0.0.45) (2023-12-20)


### Bug Fixes

* :ci: Dubplicate jobName for container image builds second try :-). ([23d000b](https://gitlab.com/gcix/gcix/commit/23d000b51c5c14b96c1b68676c6890280c1c3fe7))

### [0.0.44](https://gitlab.com/gcix/gcix/compare/v0.0.43...v0.0.44) (2023-12-20)


### Bug Fixes

* :ci: Dubplicate jobName for container image builds. ([8b28981](https://gitlab.com/gcix/gcix/commit/8b28981ffef184cd7026c9e380448847dfaa3487))

### [0.0.43](https://gitlab.com/gcix/gcix/compare/v0.0.42...v0.0.43) (2023-12-20)


### Features

* **container:** :construction: Added container image build for python and typescript images. ([8da1b0e](https://gitlab.com/gcix/gcix/commit/8da1b0e30d90b274337e318bca995a0721b7c961))

### [0.0.42](https://gitlab.com/gcix/gcix/compare/v0.0.41...v0.0.42) (2023-12-20)


### Features

* **addons:** :sparkles: Added BuildGitlabContainerCollection class. ([fdb060f](https://gitlab.com/gcix/gcix/commit/fdb060fb06026a31f7cef063cfd77e4dc2494c1c))

### [0.0.41](https://gitlab.com/gcix/gcix/compare/v0.0.40...v0.0.41) (2023-12-20)


### Bug Fixes

* **addons:** :bug: Fixed another escaping problem in DockerClientConfig class. ([2a97122](https://gitlab.com/gcix/gcix/commit/2a97122ffe889552429e88b6661871113acf010b))

### [0.0.40](https://gitlab.com/gcix/gcix/compare/v0.0.39...v0.0.40) (2023-12-20)


### Bug Fixes

* **addons:** :bug: Fixed json escaping in DockerClientConfig. ([b8363c2](https://gitlab.com/gcix/gcix/commit/b8363c22ea732fd3f7180cbf9767e9e8639331ca))

### [0.0.39](https://gitlab.com/gcix/gcix/compare/v0.0.38...v0.0.39) (2023-11-14)


### Bug Fixes

* **addons:** :ambulance: Second try to get circular dependency between ts and python right. ([729b6e6](https://gitlab.com/gcix/gcix/commit/729b6e6f6cf0c0431b07e7f95456fdb3afad2e45))

### [0.0.38](https://gitlab.com/gcix/gcix/compare/v0.0.37...v0.0.38) (2023-11-14)


### Bug Fixes

* **addons:** :ambulance: Fixed circular dependency in python when importing pages and corresponding jobs from python src into gitlab. ([e31d0c2](https://gitlab.com/gcix/gcix/commit/e31d0c2d999086a159ac65da15fec1c8689effe4))

### [0.0.37](https://gitlab.com/gcix/gcix/compare/v0.0.36...v0.0.37) (2023-09-09)


### Chore

* :wrench: Added check in update_package_json_version.sh script if CI_COMMIT_TAG env var is not set and exit ([f3890c5](https://gitlab.com/gcix/gcix/commit/f3890c5b752bb74babc1c51bf0c4c2ad3351bce6))
* **projen:** :wrench: Added that if pip install fails, trying to use --break-system-packages. ([6dff2d0](https://gitlab.com/gcix/gcix/commit/6dff2d02d899156a692a999afca19fa76b79c53a))
* **projen:** :wrench: Removed requiredEnv CI_COMMIT_TAG from ci:package-all task. ([87c2877](https://gitlab.com/gcix/gcix/commit/87c2877a08dd80c0129a17de459858880d8ebe98))
* **projen:** :wrench: Upgrade setuptools while packaging. ([32131d3](https://gitlab.com/gcix/gcix/commit/32131d37dc49b3e65ecde206f605913b884fe6f1))

### [0.0.36](https://gitlab.com/gcix/gcix/compare/v0.0.35...v0.0.36) (2023-09-08)


### Bug Fixes

* **addons:** :bug: Fixed wrong named cfnwaiter.ts. ([bd98b20](https://gitlab.com/gcix/gcix/commit/bd98b2066060aeed5f0c345e48949648e20843d0))

### [0.0.35](https://gitlab.com/gcix/gcix/compare/v0.0.34...v0.0.35) (2023-09-08)


### Chore

* **deps:** :arrow_up: Updated dependencies. ([c900cfb](https://gitlab.com/gcix/gcix/commit/c900cfbd462f80d46e67122fa66bdd08d2c4ad6b))

### [0.0.34](https://gitlab.com/gcix/gcix/compare/v0.0.33...v0.0.34) (2023-09-08)


### Bug Fixes

* **cfnwaiter:** :bug: Renamed cfnWaiter.ts to cfnwaiter.ts, it was a mistake that cfnwaiter was with a capital W. ([945100b](https://gitlab.com/gcix/gcix/commit/945100b4d5245c456b126b91245e1f1639b32ada))

### [0.0.33](https://gitlab.com/gcix/gcix/compare/v0.0.32...v0.0.33) (2023-09-08)


### Features

* **addons:** :sparkles: Introduce container BuildContainerCollection class which builds,checks, and pushes a new container image. ([01eb92f](https://gitlab.com/gcix/gcix/commit/01eb92f2a22f831889afd8a36791c2fc66049bf3))
* **addons:** :sparkles: Introduce container CopyContainerCollection class which pulls, checks, and pushes a new container image to a registry. ([2c4a8cf](https://gitlab.com/gcix/gcix/commit/2c4a8cf52c74c85f23aae098add284a4ca7ed7cd))
* **addons:** :sparkles: Introduce container DockerBuild class to build and/or push a container image. ([528cbe9](https://gitlab.com/gcix/gcix/commit/528cbe94ed819de0308b7ccf2bdd9ee2822cefe6))
* **addons:** :sparkles: Introduce container KanikoExecute class to build and/or push a container image. ([e405aff](https://gitlab.com/gcix/gcix/commit/e405aff079d3d27817b0b8031129380eed98998e))
* **addons:** :sparkles: Introduce container TrivyScanLocalImage and TrivyIgnoreFileCheck to scan container images for vulnerabilities. ([efd0035](https://gitlab.com/gcix/gcix/commit/efd0035368a97b2580f06dbe120db13a6a78ed74))


### Bug Fixes

* **addons:** :bug: Add missing Registry type for srcRegistry and dstRegistry properties. ([528077d](https://gitlab.com/gcix/gcix/commit/528077d7ec63d127287b0e2425bcae8bf166e6a8))


### Tests

* **addons:** :white_check_mark: Add tests for container BuildContainerCollection class. ([c9771db](https://gitlab.com/gcix/gcix/commit/c9771db1a11d286ffcc1b8ee8579a2d66ed458f5))
* **addons:** :white_check_mark: Add tests for container CopyContainerCollection class. ([e7ad6bb](https://gitlab.com/gcix/gcix/commit/e7ad6bb47bb5297459aa9afc45512adc23b9be0b))
* **addons:** :white_check_mark: Add tests for container DockerBuild class. ([8326660](https://gitlab.com/gcix/gcix/commit/8326660007587a7e4e60f9734790c9aabd56a4fe))
* **addons:** :white_check_mark: Add tests for container KanikoExecute class. ([5c67580](https://gitlab.com/gcix/gcix/commit/5c675809197b1e2a6fc7df9bfc8242e22f2ee553))
* **addons:** :white_check_mark: Add tests for container TrivyScanLocalImage and TrivyIgnoreFileCheck classes. ([de4f7cc](https://gitlab.com/gcix/gcix/commit/de4f7cce18dd9b86bb4aeeaab879acfe3ff10fd7))

### [0.0.32](https://gitlab.com/gcix/gcix/compare/v0.0.31...v0.0.32) (2023-09-07)


### Features

* **addons:** :sparkles: Introduce python FullStack class to allow a collection to test, build and deploy a python project. ([f0846f2](https://gitlab.com/gcix/gcix/commit/f0846f29b2bd68f8fdf6f1b287a713d219898368))


### Tests

* **addons:** :white_check_mark: Add tests for python FullStack class. ([20ffdf7](https://gitlab.com/gcix/gcix/commit/20ffdf7ba127c65602322bec2c3aa6a196698cb2))


### Chore

* :wrench: Added bug and feature request issue templates. ([e883e50](https://gitlab.com/gcix/gcix/commit/e883e50ec42e4e5f8d19791cd8e14b9d82abfb59))
* :wrench: Fixed some issues with the issue/bug and feature request templates. ([2eb323b](https://gitlab.com/gcix/gcix/commit/2eb323bd328071a5ca830435966bd2a56e9910c0))
* **addons:** :truck: Renamed all classes and prefixed them according to their addon domain. This was necessary to prevent name clashing of exports. ([1815b30](https://gitlab.com/gcix/gcix/commit/1815b3017ff0571e62ba602a8a66dec05669eea1))

### [0.0.31](https://gitlab.com/gcix/gcix/compare/v0.0.30...v0.0.31) (2023-09-07)


### Chore

* **projen:** :wrench: Added some useful metadata to projen, that will allow users to have a better way to get in touch with the project. ([58be440](https://gitlab.com/gcix/gcix/commit/58be440252f655e6daea03ec733ef5fdbc6c5b25))
* **projen:** :wrench: Added versionrcOptions to create changelog entries for all conventional commits. ([ded3c0e](https://gitlab.com/gcix/gcix/commit/ded3c0e82b9e5814e4d71d12608a8c8b64fe7105))

### [0.0.30](https://gitlab.com/gcix/gcix/compare/v0.0.29...v0.0.30) (2023-09-07)

### [0.0.29](https://gitlab.com/gcix/gcix/compare/v0.0.28...v0.0.29) (2023-09-03)


### Features

* **addons:** :sparkles: Added new cli tool `gittagpep440conformity`. ([f455a3e](https://gitlab.com/gcix/gcix/commit/f455a3e89a10dd6aa5fc4e17c11db96e4817ccfe))
* **addons:** :sparkles: Introduce python EvaluateGitTagPep440Conformity class to to check if CI_COMMIT_TAG environment variable is conform with Python PEP 440. ([3e8503d](https://gitlab.com/gcix/gcix/commit/3e8503d1748dc8d6c1197598542694c1e970e32d))
* **addons:** :sparkles: Introduce python Pytest class to test python source code. ([a451971](https://gitlab.com/gcix/gcix/commit/a4519719d0db7e9b7c2f8bec8a6f21e34690d2a9))

### [0.0.28](https://gitlab.com/gcix/gcix/compare/v0.0.27...v0.0.28) (2023-09-03)


### Features

* **addons:** :sparkles: Introduce dive Scan class to check container image efficiency in wasted storage. ([0bad91a](https://gitlab.com/gcix/gcix/commit/0bad91ac4ec5e3eb51b2866d59634728bd8ba2cb))


### Bug Fixes

* **addons:** :bug: Fixing readonly properties on IScan interface, they all are writeable. ([aa332dd](https://gitlab.com/gcix/gcix/commit/aa332dd53e13a03a7d6212c7e4c5b296cb64cac1))

### [0.0.27](https://gitlab.com/gcix/gcix/compare/v0.0.26...v0.0.27) (2023-09-03)


### Features

* **addons:** :sparkles: Introduce crane Copy class to copy container images between container registries. ([6220b03](https://gitlab.com/gcix/gcix/commit/6220b03c7e391b235392e65cc8183f5e1338137e))
* **addons:** :sparkles: Introduce crane Pull class to pull container images from container registries. ([25762c3](https://gitlab.com/gcix/gcix/commit/25762c38454ba7de98002c5d718161c1a2dd9197))
* **addons:** :sparkles: Introduce crane Push class to created .tar archives as container images to container image registry. ([3432010](https://gitlab.com/gcix/gcix/commit/3432010f39451981404203e8c0ce4e08d978ba38))

### [0.0.26](https://gitlab.com/gcix/gcix/compare/v0.0.25...v0.0.26) (2023-09-02)


### Features

* **addons:** :sparkles: Introduce DockerClientConfig class to configure the docker client. ([ed90929](https://gitlab.com/gcix/gcix/commit/ed909294c902c8dbfde81c47ad2e39942a224602))

### [0.0.25](https://gitlab.com/gcix/gcix/compare/v0.0.24...v0.0.25) (2023-08-31)


### Features

* **addons:** :sparkles: Add Mirror class for repository mirroring. ([69cf4a7](https://gitlab.com/gcix/gcix/commit/69cf4a71147c7bb827f66ebdafa9e7de92dc5c9c))
* **addons:** :sparkles: Added a new class AWSAccount that provides methods for retrieving AWS Account ID and AWS Region. ([993786f](https://gitlab.com/gcix/gcix/commit/993786f15ea263c75d0b0b9bd945c7636dcc31bc))
* **addons:** :sparkles: Implement PredefinedImages class for commonly used container images ([c0a9140](https://gitlab.com/gcix/gcix/commit/c0a9140ca2c58b28661d35d1472b57ecc95036a4))
* **addons:** :sparkles: Introduce MirrorToCodecommit class for Git repository mirroring to Codecommit ([5630f10](https://gitlab.com/gcix/gcix/commit/5630f101aabc1ebb07bc0061238a17a8ea100cbd))
* **addons:** :sparkles: Introduce Registry class to get registry URLs. ([7fc2a63](https://gitlab.com/gcix/gcix/commit/7fc2a635ca4aa9db0f82c3fc46d1d09a2e620406))


### Bug Fixes

* **core:** :bug: Correct missing colon in Image.tag assignment. ([bec6dfa](https://gitlab.com/gcix/gcix/commit/bec6dfa4e1a031ac617af4318f4448a5c620d1b1))

### [0.0.24](https://gitlab.com/gcix/gcix/compare/v0.0.23...v0.0.24) (2023-08-22)


### Features

* **addons:** :sparkles: Add AsciiDoctor, Sphinx and Pdoc3 job configuration for generating python documentation. ([4364385](https://gitlab.com/gcix/gcix/commit/43643850c846287a6ca17e3f8f9e610e4e8f4142))


### Bug Fixes

* **addons:** :bug: Fixed bug in AsciiDoctory interface, properties should not be readonly. ([2993edb](https://gitlab.com/gcix/gcix/commit/2993edb93c2adbc057c692d651c2a1682ba312ee))

### [0.0.23](https://gitlab.com/gcix/gcix/compare/v0.0.22...v0.0.23) (2023-08-22)

### [0.0.22](https://gitlab.com/gcix/gcix/compare/v0.0.21...v0.0.22) (2023-08-22)


### Features

* :sparkles: Implement isSemver function ([c3a676b](https://gitlab.com/gcix/gcix/commit/c3a676be55b3fcc508e865901c6c56449df329fa))
* **addons:** :sparkles: Add BdistWheel job configuration for building and packaging. ([1d9106e](https://gitlab.com/gcix/gcix/commit/1d9106e797fc01947da9146a9f474279bfe66d5e))
* **addons:** :sparkles: Add Flake8, MyPy and Isort job configuration for linting python projects. ([3591c1a](https://gitlab.com/gcix/gcix/commit/3591c1a0bf9b7ab3345ed115b7c8366c39fe88b8))
* **addons:** :sparkles: Add Scripts class for Linux package install ([526fadc](https://gitlab.com/gcix/gcix/commit/526fadcc81ac3407fe0d99ce51a967b2a003de38))
* **addons:** :sparkles: Add TwineUpload job configuration for uploading packaged python packages. ([8b7f77d](https://gitlab.com/gcix/gcix/commit/8b7f77d6cad4f0d6dcea3123ca6cc6fdc73deca7))
* **addons:** :sparkles: Introduce Scripts utility class with pipInstallRequirements method ([84aa175](https://gitlab.com/gcix/gcix/commit/84aa175dc13d9a0e4f73e874583c707d8ab84a2f))

### [0.0.21](https://gitlab.com/gcix/gcix/compare/v0.0.20...v0.0.21) (2023-08-21)

### [0.0.20](https://gitlab.com/gcix/gcix/compare/v0.0.19...v0.0.20) (2023-08-21)


### Features

* **addons:** :sparkles: Add Sops.exportDecryptedValues method ([9d86ccb](https://gitlab.com/gcix/gcix/commit/9d86ccbe86a41256ec9d7c0db382dc999c7d1add))

### [0.0.19](https://gitlab.com/gcix/gcix/compare/v0.0.18...v0.0.19) (2023-08-21)

### [0.0.18](https://gitlab.com/gcix/gcix/compare/v0.0.17...v0.0.18) (2023-08-21)

### [0.0.17](https://gitlab.com/gcix/gcix/compare/v0.0.16...v0.0.17) (2023-08-12)


### Bug Fixes

* :bug: Removed helper export, it is not used to get consumed by users. ([d5393ca](https://gitlab.com/gcix/gcix/commit/d5393ca77c00145a037e82f3effc9ef7c9d546cb))
* :bug: Removed named exports, it caused problems with api documentation exportation. ([b1bf78a](https://gitlab.com/gcix/gcix/commit/b1bf78a70e7cfea284e5152d326273e19137f82a))

### [0.0.16](https://gitlab.com/gcix/gcix/compare/v0.0.15...v0.0.16) (2023-08-12)

### [0.0.15](https://gitlab.com/gcix/gcix/compare/v0.0.14...v0.0.15) (2023-08-12)

### [0.0.14](https://gitlab.com/gcix/gcix/compare/v0.0.13...v0.0.14) (2023-08-11)


### Features

* **addons:** :sparkles: Export addons as submodule. ([033718f](https://gitlab.com/gcix/gcix/commit/033718f4c23ccc60f3fc101d8d5a058c59d8f778))


### Bug Fixes

* **addons:** :bug: Fixed missing readonly for several non-behavioral interfaces. ([b05956c](https://gitlab.com/gcix/gcix/commit/b05956cf4809b403b712dc9937bc65ef70fe4704))

### [0.0.13](https://gitlab.com/gcix/gcix/compare/v0.0.12...v0.0.13) (2023-08-11)

### [0.0.12](https://gitlab.com/gcix/gcix/compare/v0.0.11...v0.0.12) (2023-08-11)

### [0.0.11](https://gitlab.com/gcix/gcix/compare/v0.0.10...v0.0.11) (2023-08-11)

### [0.0.10](https://gitlab.com/gcix/gcix/compare/v0.0.9...v0.0.10) (2023-08-11)

### [0.0.9](https://gitlab.com/gcix/gcix/compare/v0.0.8...v0.0.9) (2023-08-11)

### [0.0.8](https://gitlab.com/gcix/gcix/compare/v0.0.7...v0.0.8) (2023-08-11)


### Bug Fixes

* :green_heart: Try to fix the ci system for building pages. ([892c047](https://gitlab.com/gcix/gcix/commit/892c047ba3724e147d8a3e6edd0c7386eafeb952))

### [0.0.7](https://gitlab.com/gcix/gcix/compare/v0.0.6...v0.0.7) (2023-08-11)

### [0.0.6](https://gitlab.com/gcix/gcix/compare/v0.0.5...v0.0.6) (2023-08-11)

### [0.0.5](https://gitlab.com/gcix/gcix/compare/v0.0.4...v0.0.5) (2023-08-11)

### [0.0.4](https://gitlab.com/gcix/gcix/compare/v0.0.3...v0.0.4) (2023-08-11)

### [0.0.3](https://gitlab.com/gcix/gcix/compare/v0.0.2...v0.0.3) (2023-08-11)

### [0.0.2](https://gitlab.com/gcix/gcix/compare/v0.0.1...v0.0.2) (2023-08-10)


### Features

* **addons:** :sparkles: Add cdk DiffDeploy class JobCollection and related interfaces. ([6613a3b](https://gitlab.com/gcix/gcix/commit/6613a3b362ab35117a630e2dc3a06b25c0383fd8))

### [0.0.1](https://gitlab.com/gcix/gcix/compare/v0.0.0...v0.0.1) (2023-08-10)


### Features

* **addons:** :sparkles: Added CDK Bootstrap addon to bootstrap CDK into an aws account ([6ce196d](https://gitlab.com/gcix/gcix/commit/6ce196d3e0358b1441c76835ba64ca5bec3afa85))
* **addons:** :sparkles: Added cdk Deploy class. ([5a077f1](https://gitlab.com/gcix/gcix/commit/5a077f1ac032e3105887f16368e37e86694ebcad))
* **addons:** :sparkles: Added cdk Diff class to addons ([3a9534d](https://gitlab.com/gcix/gcix/commit/3a9534d898985b604dd6f57bb894df1ca7698fb2))

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
