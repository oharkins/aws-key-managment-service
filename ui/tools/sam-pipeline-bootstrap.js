const { program } = require('commander');
const { readFileSync } = require('fs-extra');
const { execSync } = require('child_process');
const { parse } = require('toml');
const replace = require('replace-in-file');

/*
  * To utilize this you need to:
  *   - Validate you have CLI access to the destination account (either access keys or "aws sso login")
  *   - Run the command "node --unhandled-rejections=strict .\tools\sam-pipeline-bootstrap.js --stage qa"
  *     - Add the optional --profile command as needed if the desired SSO account is not your default
  *     - For Github, the workflow file name should match the passed in stage (eg "--stage qa" and "qa.yaml")
*/

program
    .option('-s, --stage <string>', 'Deployment stage')
    .option('-e, --config-env [string]', 'Sam config file environemnt')
    .option('-p, --profile [string]', 'AWS Profile to use')
    .option('-u, --bitbucket-uuid [string]', 'Bitbucket repository UUID');

program.parse();

const parseMajorSections = (config) => {
  const sections = {};
  const lines = config.split('\n');

  let currentSection = '';

  lines.forEach((line) => {
    if (/^\[.*\]$/.test(line)) {
      const sectionName = line
          .substring(1, line.length - 1) // Remove [] (eg [branch "master"] => branch "master")
          .split(' ')
          .map((part) => /^".*"$/.test(part) ? part.substring(1, part.length - 1) : part) // remove any quotes (eg "master" => master)
          .filter((x) => !!x)
          .join('_');

      currentSection = sectionName;
      sections[currentSection] = {};
    } else if (currentSection && line.trim().length) {
      const kvp = line.trim().split(' = ').map((x) => x.trim());
      sections[currentSection][kvp[0]] = kvp[1];
    }
  });

  return sections;
};

const getPrimaryBranchName = (sections) => {
  if (sections.branch_master) {
    return 'master';
  } else if (sections.branch_main) {
    return 'main';
  }

  return null;
};

const getRepoInfo = (sections) => {
  const info = {};

  if (sections.remote_origin?.url) {
    let url = sections.remote_origin.url;

    info.url = url;

    const host = /github.com/.test(url) ?
        'github' :
        /bitbucket.org/.test(url) ?
            'bitbucket' :
            /gitlab.com/.test(url) ?
                'gitlab' :
                'UNKNOWN';

    if (/https:\/\//.test(url)) {
      url = url.substring(url.indexOf('https://') + 1);
    } else if (/:/.test(url)) {
      url = url.substring(url.indexOf(':') + 1); // Remove SSH ident (eg git@github.com:)
    }

    const parts = url.split('/');

    info.host = host;
    info.org = parts[parts.length - 2]?.replace(/.git$/, '');
    info.repo = parts[parts.length - 1]?.replace(/.git$/, '');
  }

  info.branch = getPrimaryBranchName(sections);

  return info;
};

const getGitInfo = () => {
  const config = readFileSync('./.git/config', 'utf-8');
  const sections = parseMajorSections(config);

  const gitInfo = getRepoInfo(sections);

  if (!gitInfo.branch || !gitInfo.repo || !gitInfo.host) {
    throw Error(`Required fields are missing. ${JSON.stringify(gitInfo)}`);
  }

  return gitInfo;
};

const getCommands = (gitInfo) => {
  const options = program.opts();

  const commands = [
    `--no-interactive`,
    `--deployment-branch ${gitInfo.branch}`,
    `--stage ${options.stage}`,
    ...(options.configEnv ? [`--config-env ${options.configEnv}`] : []),
    ...(options.profile ? [`--profile ${options.profile}`] : [])
  ];

  if (gitInfo.host === 'github') {
    commands.push(`--oidc-provider github-actions`);
    commands.push(`--github-repo ${gitInfo.repo}`);

    if (gitInfo.org) {
      commands.push(`--github-org ${gitInfo.org}`);
    }
  } else if (gitInfo.host === 'gitlab') {
    commands.push(`--oidc-provider gitlab`);
    commands.push(`--gitlab-group ${gitInfo.repo}`);

    if (gitInfo.org) {
      commands.push(`--gitlab-project ${gitInfo.org}`);
    }
  } else if (gitInfo.host === 'bitbucket') {
    commands.push(`--oidc-provider bitbucket-pipelines`);

    const bitbucketUuid = options.bitbucketUuid;

    if (!bitbucketUuid) {
      throw Error(`Argument --bitbucket-repo-uuid is required in the form "--bitbucket-repo-uuid 5a6074f9-4922-4cc7-8993-65ef6e9a22d3"`);
    }

    commands.push(`--bitbucket-repo-uuid ${bitbucketUuid}`);
  }

  return commands;
};

const replaceInFile = async (options) => {
  try {
    await replace(options);
  } catch (err) {
    console.error('Error during replacement:', err);

    throw err;
  }
};

const updateGithubWorkflows = async () => {
  const options = program.opts();
  const stage = options.stage;
  const updateFiles = [`./.github/workflows/${stage}.yaml`];

  const pipelineConfig = parse(readFileSync('./.aws-sam/pipeline/pipelineconfig.toml', 'utf-8'));
  const parameters = pipelineConfig[stage].pipeline_bootstrap.parameters;

  await replaceInFile({
    files: updateFiles,
    from: /{SAM_ARTIFACT_BUCKET_NAME}/g,
    to: parameters.artifacts_bucket
  });

  await replaceInFile({
    files: updateFiles,
    from: /{PIPELINE_EXECUTION_ROLE_ARN}/g,
    to: parameters.pipeline_execution_role
  });

  await replaceInFile({
    files: updateFiles,
    from: /{CLOUDFORMATION_EXECUTION_ROLE_ARN}/g,
    to: parameters.cloudformation_execution_role
  });
};

const updateConfigurationFiles = async (gitInfo) => {
  if (gitInfo.host === 'github') {
    await updateGithubWorkflows();
  }
};

(async () => {
  const gitInfo = getGitInfo();

  const commands = getCommands(gitInfo);
  const commandString = commands.join(' ');

  const execCommand = `sam pipeline bootstrap ${commandString}`;

  execSync(execCommand, { stdio: 'inherit' });

  await updateConfigurationFiles(gitInfo);
})();