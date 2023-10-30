// 
// prereq setup
// -- checkout repo limiting to only .yaml files & /doc dir for the script to find them
//  > git clone --filter=blob:none --no-checkout git@github.com:IBM/cloud-pak.git
//  > git sparse-checkout set --cone "/repo/case/**/*.yaml"
//  > git sparse-checkout add --cone "/docs"
//  > git checkout
// -- then change the OUTPUT_PATH & REPO_PATH variables below

// CHANGE THESE
const REPO_PATH = '/Users/jhaaken/github/IBM/cloud-pak'
const OUTPUT_PATH = '/Users/jhaaken/github/jhaaken/cloud-pak-poc/case2app/public/ibm/cloud-pak'

const cheerio = require('cheerio');
const axios = require('axios');
// const { Octokit } = require("@octokit/core");  // not used
const fse = require('fs-extra');
const yaml = require('js-yaml');
const path = require('path');

// removed this as it causes rate limiting bu left the logic in 
// const octokitClient = new Octokit( { auth: '' } );

async function main() {
  const result = await axios.get("https://ibm.github.io/cloud-pak/");
  const $ = cheerio.load(result.data);
  const scrapedData = [];

  let index = 0;
  for (const element of $("body > table > tbody > tr")) {

    if (index != 0) {
      const tds = $(element).find("td");
      const caseName = $(tds[0]).text();
      const appVersion = $(tds[1]).text();
      const caseVersion = $(tds[2]).text();
      const description = $(tds[3]).text();
      const airGap = $(tds[4]).text().split("export ").filter(x => x).map(x => `export ${x}`);

      // const resp = await octokitClient.request(`GET /repos/{owner}/{repo}/contents/repo/case/${caseName}/index.yaml`,
      //   {owner: 'IBM',repo: 'cloud-pak'});
      // const decoded = atob(resp.data.content);
      // const caseIndexYaml = yaml.load(decoded);
      const p = path.resolve(REPO_PATH, 'repo', 'case', `${caseName}`, 'index.yaml');
      const caseIndexYaml = yaml.load(fse.readFileSync(p))

      // const resp2 = await octokitClient.request(`GET /repos/{owner}/{repo}/contents/repo/case/${caseName}/${caseVersion}/version.yaml`,
      // {owner: 'IBM',repo: 'cloud-pak'});
      // const decoded2 = atob(resp2.data.content);
      // const versionYaml = yaml.load(decoded2);
      const vp = path.resolve(REPO_PATH, 'repo', 'case', caseName, caseVersion, 'version.yaml');
      const versionYaml = yaml.load(fse.readFileSync(vp))

      caseIndexYaml.versions[caseVersion].airGap = airGap;
      caseIndexYaml.versions[caseVersion].description = versionYaml.case.description;
      caseIndexYaml.versions[caseVersion].displayName = versionYaml.case.displayName;

      const assetTablePath = path.resolve(REPO_PATH, 'docs', 'assets', 'html', `${caseName}-table.html`);
      const assetTable = cheerio.load(fse.readFileSync(assetTablePath));
      // /html/body/table/tbody/tr[1]
      let assetIndex=0;
      for (const assetElement of assetTable("html > body > table > tbody > tr")) {

        if (assetIndex != 0) {
          const tdsAsset = assetTable(assetElement).find("td");
          const caseNameAsset = assetTable(tdsAsset[0]).text();
          const appVersionAsset = assetTable(tdsAsset[1]).text(); // the /repo/case/<case-name>/<case-version>/index.yaml already has appVersion so no reason to overwrite
          const caseVersionAsset = assetTable(tdsAsset[2]).text();
          const descriptionAsset = assetTable(tdsAsset[3]).text();
          const airGapAsset = assetTable(tdsAsset[4]).text().split("export ").filter(x => x).map(x => `export ${x}`);

          const vpAsset = path.resolve(REPO_PATH, 'repo', 'case', caseNameAsset, caseVersionAsset, 'version.yaml');
          const versionYamlAsset = yaml.load(fse.readFileSync(vpAsset))

          caseIndexYaml.versions[caseVersionAsset].airGap = airGapAsset;
          caseIndexYaml.versions[caseVersionAsset].description = descriptionAsset;
          caseIndexYaml.versions[caseVersionAsset].displayName = versionYamlAsset.case.displayName;
        }
        assetIndex++;

      }


      await fse.ensureDir(`${OUTPUT_PATH}/repo/case/${caseName}`)
      fse.writeJSONSync(`${OUTPUT_PATH}/repo/case/${caseName}/case2app.json`, caseIndexYaml, { spaces: 2 })
      const tableRow = { caseName, appVersion, caseVersion, description, airGap };
      scrapedData.push(tableRow);
    }
    index++;
  }
  // );

  // console.log(scrapedData);
}

main();
