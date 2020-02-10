import React from 'react'
import _ from 'lodash'
import queryString from 'query-string'
import {fetchUser, fetchItem, decodeHTMLEntities} from '../utils/api'
import Loading from './Loading'
import {ThemeConsumer} from '../contexts/theme'
import {PostsList} from './Posts'


function UserCard ({ user }) {
  const {id, about, created, karma} = user
  const date = new Date(created * 1000)
  return (
    <ThemeConsumer>
      {({theme}) => (
        <>
          <h1 className='header'>{id}</h1>
          <div className={`meta-info-${theme}`}>
            <span>joined <b>{date.toUTCString()}</b> </span>
            <span>has <b>{karma}</b> karma</span>
          </div>
          <p>{decodeHTMLEntities(about)}</p>
        </>
      )}
    </ThemeConsumer>
  )
}

export default class User extends React.Component {
  state = {
    user:null,
    error:null,
    posts:null
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
    const { error, user, posts} = this.state
    console.log(posts)
    return (
      <React.Fragment>
        {error && <p className='centered-text error'>{error}</p>}

        {user && (
          <>
            <UserCard user={user}/>
            <h2>Posts</h2>
          </>)}

        {this.isLoading() && <Loading text='Fetching Repos'/>}

        {posts && <PostsList posts={posts}/>}

      </React.Fragment>
    )
  }
}