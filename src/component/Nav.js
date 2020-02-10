import React from 'react';
import { ThemeConsumer } from '../contexts/theme';
import { NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <ThemeConsumer>
      {({theme, toggleTheme}) => (
        <nav className='row space-between'>
          <ul className='row nav'>
            <li>
              <NavLink exact activeClassName='nav-link-active' className='nav-link' to='/'>Top</NavLink>
            </li>
            <li>
              <NavLink activeClassName='nav-link-active' className='nav-link' to='/new'>New</NavLink>
            </li>
          </ul>
          <button
          style={{fontSize: 30}}
          className='btn-clear'
          onClick={toggleTheme}>
            {theme === 'light' ? '🔦' : '💡'}
          </button>
        </nav>
      )}
    </ThemeConsumer>
  )
}