import React from 'react'
import Debug from 'debug'

import Content, { ContentProps } from '../../Content'
import { ContactDoc } from '.'

import { createDocumentLink } from '../../../ShareLink'
import { DEFAULT_AVATAR_PATH } from '../../../constants'

import './ContactInVarious.css'
import { useSelfId, useDocument } from '../../../Hooks'
import { useContactOnlineStatus } from '../../../PresenceHooks'
import OwnDeviceConnectionStatus from './OwnDeviceConnectionStatus'
import ColorBadge from '../../ColorBadge'
import ListItem from '../../ListItem'
import ContentDragHandle from '../../ContentDragHandle'
import TitleWithSubtitle from '../../TitleWithSubtitle'

const log = Debug('pushpin:settings')

ContactInVarious.minWidth = 4
ContactInVarious.minHeight = 5

export default function ContactInVarious(props: ContentProps) {
  const [contact] = useDocument<ContactDoc>(props.hypermergeUrl)
  const selfId = useSelfId()

  const avatarDocId = contact ? contact.avatarDocId : null
  const name = contact ? contact.name : null

  const isSelf = selfId === props.hypermergeUrl
  const isOnline = useContactOnlineStatus(props.hypermergeUrl)

  if (!contact) {
    return null
  }

  const { context, url, hypermergeUrl } = props
  const { color } = contact

  const avatarImage = avatarDocId ? (
    <Content context="workspace" url={createDocumentLink('image', avatarDocId)} />
  ) : (
    <img alt="avatar" src={DEFAULT_AVATAR_PATH} />
  )

  const avatar = (
    <div className="Contact-avatar">
      <a href={props.url}>
        <div
          className={`Avatar Avatar--${context}`}
          style={{ ['--highlight-color' as any]: color }}
        >
          {avatarImage}
        </div>
        <div className="Contact-status">
          {isSelf ? (
            <OwnDeviceConnectionStatus contactId={props.hypermergeUrl} />
          ) : (
            isOnline && <ColorBadge color="green" />
          )}
        </div>
      </a>
    </div>
  )

  switch (context) {
    case 'list':
      return (
        <ListItem>
          <ContentDragHandle url={url}>{avatar}</ContentDragHandle>
          <TitleWithSubtitle title={name || 'Unknown Contact'} hypermergeUrl={hypermergeUrl} />
        </ListItem>
      )

    case 'thread':
      return (
        <div className="Contact-user">
          {avatar}
          <div className="username Contact-username">{name}</div>
        </div>
      )

    case 'title-bar':
      return <ContentDragHandle url={url}>{avatar}</ContentDragHandle>

    case 'board':
      return (
        <div className="Contact--board">
          {avatar}
          <div className="Contact-boardLabel">{name}</div>
        </div>
      )

    default:
      log('contact render called in an unexpected context')
      return null
  }
}
