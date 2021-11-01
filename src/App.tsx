import './App.css'
import { Button, Checkbox, Form, Layout, Spin, Upload, UploadProps } from 'antd'
import MonacoEditor, { MonacoDiffEditor } from 'react-monaco-editor'
import { useState } from 'react'
import { CaretRightOutlined, DownloadOutlined, UndoOutlined, UploadOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/lib/upload/interface'
import { dedup, DedupOptions } from './dedup'
import FileSaver from 'file-saver'

const { Header, Content, Sider } = Layout

function App (): JSX.Element {
  const [input, setInput] = useState<string>('[]')
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [outputFileName, setOutputFileName] = useState<string>('')

  const uploadProps: UploadProps = {
    accept: 'application/json',
    showUploadList: false,
    maxCount: 1,
    beforeUpload (file: RcFile, FileList: RcFile[]) {
      file.text().then(setInput)
      setOutput('')
      setOutputFileName('dedup_' + file.name)
      return false
    }
  }

  function run (opts: DedupOptions) {
    setIsRunning(true)
    try {
      setOutput(JSON.stringify(dedup(JSON.parse(input), opts), undefined, 2))
    } catch (e) {
      console.error(e)
    }
    setIsRunning(false)
  }

  function save () {
    FileSaver.saveAs(
      new Blob([output], { type: 'application/json' }),
      outputFileName
    )
  }

  const editorProps = {
    language: 'json',
    options: {
      automaticLayout: true,
    }
  }

  let editor: JSX.Element
  if (output) {
    editor = <MonacoDiffEditor
      {...editorProps}
      original={input}
      value={output}
    />
  } else {
    editor = <MonacoEditor
      {...editorProps}
      value={input}
    />
  }

  let submitIcon: JSX.Element
  if (isRunning) {
    submitIcon = <Spin size="small"/>
  } else {
    submitIcon = <CaretRightOutlined/>
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Header className="header">
      </Header>
      <Layout>
        <Sider width={240} style={{
          backgroundColor: 'white',
          borderRightColor: 'black',
          borderRightStyle: 'solid',
          borderRightWidth: 1,
          padding: 40
        }}>
          <Form onFinish={run}>
            <Form.Item>
              <Upload {...uploadProps}>
                <Button type="primary" icon={<UploadOutlined/>}>打开</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="removeEmptyFolders" valuePropName="checked"><Checkbox>删除空文件夹</Checkbox></Form.Item>
            <Form.Item name="mergeSameFolders" valuePropName="checked"><Checkbox>合并同名文件夹</Checkbox></Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary" icon={submitIcon} disabled={isRunning}>执行</Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" icon={<UndoOutlined/>} onClick={() => setOutput('')}>恢复</Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" icon={<DownloadOutlined/>} disabled={!output} onClick={save}>下载</Button>
            </Form.Item>
          </Form>
        </Sider>
        <Content>
          {editor}
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
