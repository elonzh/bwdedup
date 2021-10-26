import { useEffect, useRef } from 'react'

import JSONEditor, { JSONEditorOptions } from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'


interface EditorOptions extends JSONEditorOptions {
  initData: object
}

function Editor (props: EditorOptions) {
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const editor = new JSONEditor(container.current as HTMLElement, props)
    editor.update(props.initData)
    return function destroy () {
      editor.destroy()
    }
  })
  return (
    <div className="jsoneditor-container" ref={container} />
  )
}

export default Editor
