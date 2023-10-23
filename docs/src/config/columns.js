import {List, Tag, message, Typography} from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import {CopyToClipboard} from 'react-copy-to-clipboard';


import caseData from '../data/caseData.json';

const showMessage = (msg) => {
  message.info(msg);
};

const columns = [
  {
    title: "Application",
    dataIndex: "application",
    key: "application",
    filters: [...new Set(caseData.map(x=>x.application))].map(y=>{return {text: y, value: y}}),
    filterMultiple: true,
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.application.startsWith(value),
    sorter: (a, b) => a.application < b.application,
  },
  {
    title: "Product Version",
    dataIndex: "productVersion",
    key: "productVersion",
    render: (tag) => (
      <span>
        <Tag color={'green'} key={tag}>
          {tag.toUpperCase()}
        </Tag>
      </span>
    ),
  },
  {
    title: "Case Version",
    dataIndex: "caseVersion",
    key: "caseVersion",
    render: (tag) => (
      <span>
        <Tag color={'geekblue'} key={tag}>
          {tag.toUpperCase()}
        </Tag>
      </span>
    ),
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description"
  },
  {
    title: "Airgap Variables",
    dataIndex: "airgapVariables",
    key: "airgapVariables",
    render: (items) => (
      <List bordered={false}>
        {items.map(x =>
          {return (
          <List.Item>
              <Typography.Text code copyable={true}>{x}</Typography.Text>
          </List.Item>)}
        )}
      </List>
    ), 
  }
]

export default columns;

{/* <CopyToClipboard text={x} onCopy={() => showMessage(`Copied to clipboard: ${x}`) }>
<span> <CopyOutlined title={"copy"}/> </span>
</CopyToClipboard> */}
