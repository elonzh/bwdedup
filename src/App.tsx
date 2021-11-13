import './App.css'
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Layout,
  Modal,
  notification,
  Row,
  Space,
  Spin,
  Steps,
  Upload,
  UploadProps
} from 'antd'
import MonacoEditor, { MonacoDiffEditor } from 'react-monaco-editor'
import React, { useEffect, useState } from 'react'
import {
  CaretRightOutlined,
  DownloadOutlined,
  GithubOutlined,
  QuestionCircleOutlined,
  UndoOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { RcFile } from 'antd/lib/upload/interface'
import { dedup, DedupOptions, DefaultDedupOptions } from './dedup'
import FileSaver from 'file-saver'
import { BitWardenExports } from './models'
import { useRequest } from 'ahooks'

const { Header, Content } = Layout
const { Step } = Steps

interface FileState {
  filename: string
  text: string
  data?: BitWardenExports
}

function showHelp (visible ?: boolean) {
  const key = 'seen-howto'
  const seen = localStorage.getItem(key) === 'yes'
  if (visible === undefined) {
    visible = !seen
  }
  if (visible) {
    Modal.info({
      title: '如何使用',
      content: (
        <div>
          <Steps progressDot direction="vertical" current={6}>
            <Step
              title={
                <p><a href="https://bitwarden.com/help/article/export-your-data/" target="_blank">Export your vault as .json or .json(Encrypted)</a></p>
              }/>
            <Step title={'Click "Dedup" to remove duplicates.'}/>
            <Step title={'Download the result json file'}/>
            <Step title={'Clean your vault data'}/>
            <Step
              title={<p><a href="https://bitwarden.com/help/article/import-data/" target="_blank">Import data</a></p>}/>
          </Steps>
        </div>
      ),
      onOk: () => localStorage.setItem(key, 'yes')
    })
  }
}

function App (): JSX.Element {
  const [input, setInput] = useState<FileState>({ filename: '', text: '' })
  const [output, setOutput] = useState<FileState>({ filename: '', text: '' })

  const [dedupOptions, setDedupOptions] = useState<DedupOptions>(DefaultDedupOptions)
  const { loading, run } = useRequest(async () => {
    try {
      const i = JSON.parse(input.text)
      const total = i.items.length
      dedup(i, dedupOptions)
      const removed = total - i.items.length
      setOutput({ ...output, text: JSON.stringify(i, undefined, 2) })

      notification.success({ message: `Removed ${removed} items of ${total}.`, placement: 'topRight' })
    } catch (e: any) {
      console.error(e)
      notification.error({ message: e.toString(), placement: 'topRight' })
    }
  }, {
    debounceInterval: 500,
    manual: true,
  })

  useEffect(showHelp)

  const uploadProps: UploadProps = {
    accept: 'application/json',
    showUploadList: false,
    maxCount: 1,
    async beforeUpload (file: RcFile, FileList: RcFile[]) {
      const text = await file.text()
      setInput({
        filename: file.name,
        text: text,
      })
      setOutput({
        filename: 'dedup_' + file.name,
        text: ''
      })
      return false
    }
  }

  function save () {
    FileSaver.saveAs(
      new Blob([output.text], { type: 'application/json' }),
      output.filename
    )
  }

  const editorProps = {
    language: 'json',
    options: {
      automaticLayout: true,
    }
  }

  let editor: JSX.Element
  if (output.text) {
    editor = <MonacoDiffEditor
      {...editorProps}
      original={input.text}
      value={output.text}
    />
  } else {
    editor = <MonacoEditor
      {...editorProps}
      value={input.text}
    />
  }

  function toggleRemoveEmptyFolders () {
    setDedupOptions({ ...dedupOptions, removeEmptyFolders: !dedupOptions.removeEmptyFolders })
  }

  function toggleMergeSameFolders () {
    setDedupOptions({ ...dedupOptions, mergeSameFolders: !dedupOptions.mergeSameFolders })
  }

  return (
    <>
      <Layout style={{ height: '100vh' }}>
        <Header>
          <Row align="middle" justify="space-between">
            <Col span={4}>
              <Row>
                <Space>
                  <img src={'/logo.svg'} alt={'logo'} style={{ height: 28 }}/>
                  <Divider type={'vertical'}/>
                  <Upload {...uploadProps}>
                    <Button type="primary" icon={<UploadOutlined/>}>打开</Button>
                  </Upload>
                  <Button onClick={toggleRemoveEmptyFolders}>
                    <Checkbox checked={dedupOptions.removeEmptyFolders}
                              style={{ pointerEvents: 'none' }}>删除空文件夹</Checkbox>
                  </Button>
                  <Button onClick={toggleMergeSameFolders}>
                    <Checkbox checked={dedupOptions.mergeSameFolders}
                              style={{ pointerEvents: 'none' }}>合并同名文件夹</Checkbox>
                  </Button>
                  <Spin spinning={loading}>
                    <Button type="primary" icon={<CaretRightOutlined/>} disabled={loading} onClick={run}>执行</Button>
                  </Spin>
                  <Button type="primary" icon={<UndoOutlined/>}
                          onClick={() => setOutput({ ...output, text: '' })} disabled={!output.text}>恢复</Button>
                  <Button type="primary" icon={<DownloadOutlined/>} onClick={save} disabled={!output.text}>下载</Button>
                </Space>
              </Row>
            </Col>
            <Col span={4}>
              <Row justify={'end'} align="middle">
                <Space>
                  <Button type="primary" icon={<QuestionCircleOutlined/>}
                          onClick={() => showHelp(true)}>帮助</Button>
                  <a target={'_blank'} href={'https://github.com/elonzh/bwdedup'}><GithubOutlined
                    style={{ 'color': 'white', 'fontSize': '20px' }}/></a>
                </Space>
              </Row>
            </Col>
          </Row>
        </Header>
        <Content>
          <Row style={{ height: '32px', padding: '0 50px' }} align="middle">
            {input.filename || 'No input file'}
          </Row>
          <Row style={{ height: 'calc(100vh - 64px - 32px)' }}>
            {editor}
          </Row>
        </Content>
      </Layout>
    </>
  )
}

export default App
