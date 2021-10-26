import './App.css'
import Editor from './Editor'

function App () {
  return (
    <div className="App">
      <Editor initData={{}} modes={['code', 'view']}/>
    </div>
  )
}

export default App
