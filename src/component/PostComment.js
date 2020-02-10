import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import queryString from 'query-string'
import { fetchItems, fetchUser, fetchItem, decodeHTMLEntities } from '../utils/api'
import Loading from './Loading';
import {ThemeConsumer} from '../contexts/theme'


function CommentCard ({comments}) {
  return (
    <ThemeConsumer>
      {({theme}) => (<>
        {comments.map((comment, index) => {
          const {by, kids, parent, text, time, id} = comment
          const date = new Date(time * 1000)
          return (
            <div className='comment'>
              <div className={`meta-info-${theme}`}>
                <span>by <a href={`/user?id=${by}`}>{by}</a> </span>
                <span>on {date.toUTCString()}</span>
              </div>
              <p>{decodeHTMLEntities(text)}</p>
            </div>
          )
        })}
      </>)}
    </ThemeConsumer>
  )
}

function CommentHeader ({post}) {
  const {by, descendants, time, title, url, id} = post
  const date = new Date(time * 1000)
  return (
    <ThemeConsumer>
      {({theme}) => (
      <>
        <h1>
          <a href={url} className="link">{title}</a>
        </h1>
        <div className={`meta-info-${theme}`}>
          <span>by <a href={`/user?id=${by}`}>{by}</a> </span>
          <span>on {date.toUTCString()} </span>
          <span>with <a href={`/post?id=${id}`}>{descendants}</a> comments</span>
        </div>
      </>)}
    </ThemeConsumer>
  )
}

export default class PostComment extends React.Component {
  state = {
    post:null,
    error:null,
    comments:null
  }
  componentDidMount = () => {
    const { id } = queryString.parse(this.props.location.search);
    this.updateUser(id);
  }
  updateUser = (id) => {
    fetchUser(id)
      .then((data) => {
        this.setState({
          user: data
        })
        return data.submitted.slice(0, 50)
      })
      .then((ids) => Promise.all(ids.map((id) => fetchItem(id))))
      .then((posts) => _.filter(posts, (post) => {
        return post.type === 'story' && !post.deleted
      }))
      .then((posts) => {
        this.setState({
          posts: posts
        })
      })
      .catch((error) => {
        console.warn('Error fetching repos: ', error)
        this.setState({
          error: `There was an error fetching the repositories.`
        })
      })
  }

  isLoading = () => {
    const { error, user, posts } = this.state
    return !posts && user && error === null
  }

  render() {
    const { post, error, comments } = this.state
    return (
      <React.Fragment>
        {error && <p className='centered-text error'>{error}</p>}

        {post && <CommentHeader post={post}/>}
        {comments && (<CommentCard comments={comments}/>)}

        {this.isLoading() && <Loading text='Fetching Repos'/>}
      </React.Fragment>
    )
  }
}