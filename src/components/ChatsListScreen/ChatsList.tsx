import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { History } from 'history'
import * as moment from 'moment'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styled from 'styled-components'
import { useGetChats } from '../../graphql-hooks'

const name = 'ChatsList'

const Style = styled.div `
  height: calc(100% - 56px);
  overflow-y: overlay;

  .${name}-chats-list {
    padding: 0;
  }

  .${name}-chat-item {
    height: 76px;
    padding: 0 15px;
    display: flex;
  }

  .${name}-profile-pic {
    height: 50px;
    width: 50px;
    object-fit: contain;
    border-radius: 50%;
  }

  .${name}-info {
    width: calc(100% - 60px);
    height: calc(100% - 30px);
    padding: 15px 0;
    margin-left: 10px;
    border-bottom: .5px solid silver;
    position: relative;
  }

  .${name}-name {
    margin-top: 5px;
  }

  .${name}-last-message {
    color: gray;
    font-size: 15px;
    margin-top: 5px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .${name}-timestamp {
    position: absolute;
    color: gray;
    top: 20px;
    right: 0;
    font-size: 13px;
  }
`

interface ChatsListProps {
  history: History
}

export default ({ history }: ChatsListProps) => {
  const { data: { chats } } = useGetChats()

  const navToChat = (chatId) => {
    history.push(`chats/${chatId}`)
  }

  const pluckRecentMessage = (chat) => {
    return chat.messages[chat.messages.length - 1] || {}
  }

  return (
    <Style className={name}>
      <List className={`${name}-chats-list`}>
        {chats && chats.map(chat => {
          const recentMessage = pluckRecentMessage(chat)

          return (
            <ListItem key={chat.id} className={`${name}-chat-item`} button onClick={navToChat.bind(null, chat.id)}>
              <img className={`${name}-profile-pic`} src={chat.picture || (chat.isGroup ? '/assets/default-group-pic.jpg' : '/assets/default-profile-pic.jpg')} />
              <div className={`${name}-info`}>
                <div className={`${name}-name`}>{chat.name}</div>
                <div className={`${name}-last-message`}>{recentMessage.content}</div>
                <div className={`${name}-timestamp`}>{moment(recentMessage.createdAt).format('HH:mm')}</div>
              </div>
            </ListItem>
          )
        })}
      </List>
    </Style>
  )
}