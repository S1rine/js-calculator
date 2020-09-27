import tpl from './index.tpl'
import './index.scss'

export default class ResultComponent {
  constructor() {
    this.name = "ResultComponent"
  }
  tpl () {
    const oDiv = document.createElement('div')
    oDiv.className = "result-wrap"
    oDiv.innerHTML = tpl()
    return oDiv
  }
}