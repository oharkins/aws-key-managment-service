const { readdirSync, readFileSync } = require('fs-extra');
const { parse } = require('toml');
const { execSync } = require('child_process');
const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const s3Client = new S3Client({ signatureVersion: 'v4', region: process.env.AWS_REGION, useFipsEndpoint: true });

const distDirectoryRegex = /^dist\//;
const removalDelayDuration = process.env.S3_ITEM_REMOVAL_DELAY_DURATION && Number(process.env.S3_ITEM_REMOVAL_DELAY_DURATION) || 30000;
let bucketName;

const getBucketName = () => {
  const env = process.env.CONFIG_ENV ?? 'sandbox';

  const config = parse(readFileSync(env === 'sandbox' ? './samconfig.sandbox.toml' : './samconfig.toml', 'utf-8'));
  const name = config[env].deploy.parameters.parameter_overrides.find((o) => o.startsWith('BucketName=')).split('=')[1];

  return `${name}-${process.env.AWS_REGION}`;
};

const getExistingS3Items = async () => {
  console.log(`Getting existing S3 items`);
  const s3Keys = [];
  let nextToken;

  do {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      ...nextToken && {
        ContinuationToken: nextToken
      }
    });

    const response = await s3Client.send(listCommand);

    if (response.Contents) {
      s3Keys.push(...response.Contents.filter((x) => x.Key).map((x) => x.Key));
    }

    nextToken = response.ContinuationToken;
  } while (nextToken);

  console.log(`Retrieved ${s3Keys.length} items from S3`);

  return s3Keys;
};

const getBaseBuildDirectories = () => {
  return readdirSync(`dist`, { withFileTypes: true }).filter((x) => x.isDirectory()).map((x) => x.name.replace(distDirectoryRegex, ''));
};


const getBuildItems = () => {
  const buildItems = [];
  const distDirectory = `dist`;

  getDirectoryContents(buildItems, distDirectory);

  return buildItems;
};

const getDirectoryContents = (contents, directory) => {
  readdirSync(directory, { withFileTypes: true })
      .filter((x) => x.isDirectory() || x.isFile())
      .forEach((value) => {
        if (value.isDirectory()) {
          getDirectoryContents(contents, `${directory}/${value.name}`);
        } else {
          contents.push(`${directory}/${value.name}`.replace(distDirectoryRegex, ''));
        }
      });
};

const removeS3Items = async (itemsToRemove) => {
  console.log(`Identified ${itemsToRemove.length} items for removal from S3`);
  const batches = [];

  while (itemsToRemove.length) {
    batches.push(itemsToRemove.splice(0, 900));
  }

  await Promise.all(batches.map(async (items) => {
    const command = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: items.map((item) => ({ Key: item }))
      }
    });

    const result = await s3Client.send(command);

    result.Deleted?.forEach((item) => console.log(`deleted: ${item.Key}`));
  }));
};

const copyItemsToS3 = () => {
  console.log(`Starting item sync with S3`);

  // Perform a staged upload of all assets, ending with the index.html, which should minimize any interruptions
  // Deploy updates assets
  const buildDirectories = getBaseBuildDirectories();
  buildDirectories.forEach((directory) => {
    execSync(`aws s3 sync ./dist/${directory} s3://${bucketName}/${directory}`, { stdio: 'inherit' });
  });

  // Upload root folder contents
  execSync(`aws s3 sync ./dist s3://${bucketName} --exclude "*/*" --exclude "index.html"`, { stdio: 'inherit' });
  execSync(`aws s3 sync ./dist s3://${bucketName} --exclude "*" --include "index.html"`, { stdio: 'inherit' });
};

(async () => {
  bucketName = getBucketName();

  const s3Items = await getExistingS3Items();
  const newBuildItems = getBuildItems();

  copyItemsToS3();

  const itemsToRemove = s3Items.filter((x) => !newBuildItems.includes(x));

  if (itemsToRemove.length) {
    // Delay removal of items to avoid interruption of existing downloads
    console.log(`Pausing for ${removalDelayDuration / 1000} seconds before initiating item removal from S3`);
    setTimeout(async () => await removeS3Items(itemsToRemove), removalDelayDuration);
  } else {
    console.log(`No items to remove from S3`);
  }
})();