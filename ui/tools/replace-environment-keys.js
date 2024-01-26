const replace = require('replace-in-file');

const environmentFiles = [
  'src/environments/environment.ts',
  'src/environments/environment.prod.ts',
  'src/environments/environment.test.ts'
];

const updatePdfTronLicenseKey = async () => {
  const options = {
    files: environmentFiles,
    from: /{PDFTRON_LICENSE_KEY}/g,
    to: process.env.PDFTRON_LICENSE_KEY
  };

  try {
    await replace(options);
  } catch (err) {
    console.error('Error during replacement:', err);

    throw err;
  }
};

(async () => {
  // Replace the function as needed with any values you need to replace in the environment files
  // await updatePdfTronLicenseKey();
})();