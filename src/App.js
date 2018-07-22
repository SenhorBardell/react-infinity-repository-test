import React, { Component } from 'react';
import styles from './App.css';
import { List } from 'react-virtualized';
import Chance from 'chance';

const chance = new Chance()

const textRow = 18
const userNameRow = 12
const textLength = t => t * 7.6
const lineWidth = 600
const textLines = text => 
  Math.ceil(textLength(text.length) / lineWidth) * textRow

// 78 text.length = 600 px length
// 1 px length = 7.7

const user = () => {
  const i = Math.floor(Math.random() * 4)
  switch (i) {
    case 0: return 'user1'
    case 1: return 'user2'
    case 2: return 'user3'
    case 3: return 'user3'
  }
}

const requestMessages = _ => new Promise(r =>
  r(Array(15)
    .fill({})
    .map((o, i) => ({
      ...o, 
      id: i + 1, 
      username: user(), 
      text: chance.sentence({ words: Math.floor(Math.random() * 35) + 1 })
    }))
  ))

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      initial: true,
    }
  }
  componentDidMount() {
    this.fetchMore()
  }
  fetchMore() {
    return requestMessages().then(m => {
      const messages = [...this.state.messages, ...m]
      this.setState({messages})
      this.refs.List.scrollToRow(m.length)
      this.setState({initial: false})
    })
  }
  messageForRow = ({key, index, style, isVisible}) => {
    if (isVisible && index == 0 && !this.state.initial) {
      // this.fetchMore()
    }
    const message = this.state.messages[index]
    let prevMessageUsername = ""
    let followUp = false
    if (this.state.messages[index-1]) {
      prevMessageUsername = this.state.messages[index-1].username
      followUp = prevMessageUsername == message.username
    }
    // console.log(`${prevMessageUsername}: ${message.username}`, textLines(message.text))
    return (
      <div key={key} className="row" style={style}>
        <div className={`message ${followUp ? 'followup': ''}`}>
          {!followUp ? <h6 className="name">{message.username}</h6> : ""}
          <p className="index">{message.text}</p>
        </div>
      </div>
    )
  }
  render() {
    return (
      <div>
        <List 
          className="List"
          width={600}
          height={600}
          rowHeight={({index}) => {
            let height;
            const previosMessage = this.state.messages[index-1]
            const currentMessage = this.state.messages[index]
            if (previosMessage && previosMessage.username == currentMessage.username) {
              height = textLines(currentMessage.text)
            } else {
              height = userNameRow + textLines(currentMessage.text) + 10
            }

            return height
          }}
          rowRenderer={this.messageForRow}
          rowCount={this.state.messages.length}
          ref="List" />
      </div>
    );
  }
}

export default App;
