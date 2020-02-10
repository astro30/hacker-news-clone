import _ from 'lodash'
const api = 'https://hacker-news.firebaseio.com/v0'
const params = '.json?print=pretty'


export function fetchItems (req) {
  return fetch(`${api}/${req}stories${params}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data) {
        throw new Error(data.message)
      }
      return data.slice(0, 50)
    })
    .then((ids) => Promise.all(ids.map(id => fetchItem(id))))
    .then((posts) => _.filter(posts, (post) => {
      return post.type === 'story'
    }))
}

export function fetchComments(postid) {

}


export function fetchItem(id) {
  return fetch(`${api}/item/${id}${params}`)
    .then((res) => res.json())
}

export function fetchUser(userId) {
  return fetch(`${api}/user/${userId}${params}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data) {
        throw new Error(data.message)
      }
      return data
    })
}

export function decodeHTMLEntities(text) {
  var textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}


