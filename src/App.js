import './App.css';

import React, { useMemo } from 'react';
import { Table, Divider, List, Typography } from 'antd';
// import yaml from 'js-yaml';
// import * as fs from 'fs';

// import YAML from 'yamljs';

import dataSource from './data/caseData.json';
import columns from './config/columns';

// import doc from 'js-yaml-loader!./data/repo/case/index.yaml';
// => returns a javascript object. see https://github.com/nodeca/js-yaml

import yamlData from './data/repo/case/index.yaml';

// function YAMLtoJSON(yamlStr) { 
//   var obj = YAML.parse(yamlStr); 
//   var jsonStr = JSON.stringify(obj); 
//   return jsonStr; 
// } 

const listData =   [
  "export OFFLINEDIR=\$HOME/offline",
  "export CASE_REPO_PATH=https://github.com/IBM/cloud-pak/raw/master/repo/case",
  "export CASE_LOCAL_PATH=$OFFLINEDIR/$CASE_ARCHIVE",
  "export CASE_ARCHIVE=$CASE_NAME-$CASEVERSION.tgz" ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

function App() {

  console.log('yamlData', {d: yamlData});
  // const yamlJson = YAMLtoJSON(yamlData);
  // console.log('yamlJson', {yamlJson});

  // fetch(yamlData)
  //   .then(r => r.text())
  //   .then(text => {
  //     console.log('text decoded:', text);
  //     // [Actual file contents!]
  //   });


  // const yamlDoc = useMemo(() => {
  //   return yaml.load(fs.readFileSync('/Users/jhaaken/github-ibm/ibmprivatecloud/cloud-pak/repo/case/index.yaml', 'utf8'));
  // }, [])

  // console.log(yamlDoc);

  return (

    <div className="App">
    <Typography.Title> {'IBM: Product CASE to Application Version test'}</Typography.Title>

    <Typography.Paragraph>This page describes a summary of what CASE version contains what Application version</Typography.Paragraph>
    <div>

    <List
      header={<div><strong>Common Airgap Environmental Variables</strong></div>}
      bordered={true}
      dataSource={listData}
      renderItem={item => (
        <List.Item>
          <Typography.Text code copyable={true}>{item}</Typography.Text>
        </List.Item>
      )}
    />
    </div>

    <Divider orientation="left"></Divider>

    <Typography.Title level={2}>CASE to Application reference</Typography.Title>
    <div>
      <Table dataSource={dataSource} columns={columns} onChange={onChange}/>;  
    </div>

  </div>
  );
}

export default App;
