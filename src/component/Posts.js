import React from 'react'
import PropTypes from 'prop-types'
import { fetchItems } from '../utils/api'
import Loading from './Loading';
import {ThemeConsumer} from '../contexts/theme'

export function PostsList ({posts}) {
  return (
    <ThemeConsumer>
      {({theme}) => (<ul>
        {posts.map((post, index) => {
          const {by, descendants, time, title, url, id} = post
          const date = new Date(time * 1000)
          return (
            <li className='post' key={index}>
              <a className={`link-${theme}`} href={url}>{title}</a>
              <div className={`meta-info-${theme}`}>
                <span>by <a href={`/user?id=${by}`}>{by}</a> </span>
                <span>on {date.toUTCString()} </span>
                <span>with <a href={`/post?id=${id}`}>{descendants}</a> comments</span>
              </div>
            </li>)
        })}
      </ul>)}
    </ThemeConsumer>
  )
}

PostsList.propTypes = {
  posts: PropTypes.array.isRequired
}

export default class Posts extends React.Component {
  state = {
    posts: {},
    error: null,
  }
  componentDidMount = () => {
    this.updatePosts(this.props.type)
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps !== this.props) {
      this.updatePosts(this.props.type)
    }
  }
  updatePosts = (reqType) => {
    this.setState({
      reqType:reqType,
      error: null,
    })
    fetchItems(reqType)
    .then((data) => {
      this.setState(({posts}) => ({
        posts: {
          ...posts,
          [reqType]: data
        }
      }))
    })
    .catch((error) => {
      console.warn('Error fetching repos: ', error)

      this.setState({
        error: `There was an error fetching the repositories.`
      })
    })
  }
  isLoading = () => {
    const { posts, error, reqType } = this.state
    return !posts[reqType] && error === null
  }

  render() {
    const { posts, error, reqType } = this.state
    return (
      <React.Fragment>
        {this.isLoading() && <Loading text='Fetching Repos'/>}

        {error && <p className='centered-text error'>{error}</p>}

        {posts[reqType] && <PostsList posts={posts[reqType]}/>}
      </React.Fragment>
    )
  }
}