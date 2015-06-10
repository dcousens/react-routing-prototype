let React = require('react')
let Timers = require('react-timers')

let Header = require('./Header')
let ViewController = require('./ViewController')
let View = require('./View')

let blacklist = require('blacklist')
let loremIpsum = require('lorem-ipsum')

let mixins = require('./mixins')

// ////////////////////////////////////////////////

function shuffle (o) {
  o = o.slice()

  for (let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) {
    return o
  }
}

let DATA = {
  songs: ['Tik Tok', 'Get Free', 'Lights', 'Hey there Delilah'],
  artists: [{ name: 'Missy Elliot', songs: ['Work it', 'Pass that dutch'] }, { name: 'Black eyed peas', songs: ['Pump it', 'My humps', 'Boom boom pow'] }],
  playlists: [{ name: 'Shake up', songs: ['Bounce'] }]
}
let lastPlaying = []

// ////////////////////////////////////////////////

let VSignin = React.createClass({
  mixins: [mixins.Routing],

  propTypes: {
    className: React.PropTypes.string
  },

  gotoBrowser () { this.transitionTo('application/main/browser', {}, 'view-transition-fade') },
  gotoLogout () { this.transitionTo('application/logout', {}, 'view-transition-reveal-from-bottom') },

  render () {
    let { className } = this.props

    return (
      <div className={className}>
        <Header title='Prototype'/>
        <div className='list-item'>
          <button onClick={this.gotoBrowser}>Enter</button>
          <button onClick={this.gotoLogout}>Logout (invalid link)</button>
        </div>
      </div>
    )
  }
})

let VEULA = React.createClass({
  mixins: [mixins.History, mixins.Routing],

  propTypes: {
    className: React.PropTypes.string
  },

  render () {
    let { className } = this.props

    return (
      <div className={className}>
        <Header.Proxy title='EULA' primaryOnTap={this.gotoPreviousView} />
        <p>{loremIpsum()}</p>
      </div>
    )
  }
})

let VPrivacy = React.createClass({
  mixins: [mixins.History, mixins.Routing],

  propTypes: {
    className: React.PropTypes.string
  },

  render () {
    let { className } = this.props

    return (
      <div className={className}>
        <Header.Proxy title='Privacy' primary={this.gotoPreviousView} />
        <p>{loremIpsum()}</p>
      </div>
    )
  }
})

let VAboutMenu = React.createClass({
  mixins: [mixins.History, mixins.Routing],

  propTypes: {
    className: React.PropTypes.string
  },

  gotoEULA () { this.transitionToLocalWithHistory('eula', {}, 'view-transition-show-from-right') },
  gotoPrivacy () { this.transitionToLocalWithHistory('privacy', {}, 'view-transition-show-from-right') },

  render () {
    let { className } = this.props

    return (
      <div className={className}>
        <Header.Proxy title='About' primary={this.gotoPreviousView} />

        <div className='list-item'>
          <button onClick={this.gotoEULA}>EULA</button>
          <button onClick={this.gotoPrivacy}>Privacy</button>
        </div>
      </div>
    )
  }
})

let VAbout = React.createClass({
  mixins: [Header.Controller],
  propTypes: {
    className: React.PropTypes.string
  },

  render () {
    let { className } = this.props
    let otherProps = blacklist(this.props, 'className')

    return (
      <div className={className}>
        <Header { ... this.state.headerProps } />
        <ViewController name='about' defaultPath='/menu' { ... otherProps } >
          <View name='menu' component={VAboutMenu} />
          <View name='eula' component={VEULA} />
          <View name='privacy' component={VPrivacy} />
        </ViewController>
      </div>
    )
  }
})

let VError = React.createClass({
  mixins: [mixins.Routing],

  propTypes: {
    className: React.PropTypes.string
  },

  goHome () { this.transitionToLocal('signin', {}, 'view-transition-show-from-bottom') },

  render () {
    let { className } = this.props

    return (
      <div className={className}>
        <Header title='Oooops' />
        <div className='list-item'>
          <button onClick={this.goHome}>Return to signin</button>
        </div>
      </div>
    )
  }
})

let VArtistList = React.createClass({
  mixins: [mixins.Routing],
  propTypes: {
    className: React.PropTypes.string
  },

  getInitialState () {
    return {
      artists: DATA.artists
    }
  },

  gotoDetail (artist) {
    this.transitionToLocalWithHistory('detail', artist, 'view-transition-show-from-right')
  },

  gotoNowPlaying () {
    this.transitionToWithHistory('application/main/now-playing', {}, 'view-transition-show-from-right')
  },

  render () {
    let { className } = this.props
    let { artists } = this.state

    let artistsDom = artists.map((artist, i) => {
      return <button key={'artist' + i} onClick={this.gotoDetail.bind(this, artist)} >{artist.name}</button>
    })

    return (
      <div className={className}>
        <Header.Proxy title='Artists' secondary='Now Playing' secondaryOnTap={this.gotoNowPlaying} />

        <div className='list-item'>
          {artistsDom}
        </div>
      </div>
    )
  }
})

let VArtistDetail = React.createClass({
  mixins: [mixins.History, mixins.Routing],
  propTypes: {
    className: React.PropTypes.string,
    songs: React.PropTypes.array
  },

  playASong () {
    let { songs } = this.props

    this.transitionToWithHistory('application/main/now-playing', { songs: [songs[1]] }, 'view-transition-show-from-right')
  },

  playShuffledSongs () {
    let { songs } = this.props

    this.transitionToWithHistory('application/main/now-playing', { songs: shuffle(songs) }, 'view-transition-show-from-right')
  },

  gotoNowPlaying () {
    this.transitionToWithHistory('application/main/now-playing', {}, 'view-transition-show-from-right')
  },

  render () {
    let { className } = this.props

    return (
      <div className={className}>
        <Header.Proxy title='Artist Detail' primaryOnTap={this.gotoPreviousView} secondary='Now Playing' secondaryOnTap={this.gotoNowPlaying} />

        <div className='list-item'>
          <button onClick={this.playShuffledSongs}>Shuffle play</button>
          <button onClick={this.playASong}>Play song 1</button>
        </div>
      </div>
    )
  }
})

let VArtists = React.createClass({
  propTypes: {
    className: React.PropTypes.string
  },

  render () {
    let { className } = this.props
    let otherProps = blacklist(this.props, 'className')

    return (
      <div className={className}>
        <ViewController name='artists' defaultPath='/list' { ... otherProps }>
          <View name='list' component={VArtistList} />
          <View name='detail' component={VArtistDetail} />
        </ViewController>
      </div>
    )
  }
})

let VLatest = React.createClass({
  mixins: [mixins.Routing],
  propTypes: {
    className: React.PropTypes.string
  },

  gotoNowPlaying () {
    this.transitionToWithHistory('application/main/now-playing', {}, 'view-transition-show-from-right')
  },

  gotoSignIn () {
    this.transitionTo('application/signin', {}, 'view-transition-show-from-bottom')
  },

  render () {
    let { className } = this.props

    return (
      <div className={className}>
        <Header.Proxy title='Latest' secondary='Now Playing' secondaryOnTap={this.gotoNowPlaying} />

        <div className='list-item'>
          <button onClick={this.gotoSignIn}>Signin</button>
        </div>
      </div>
    )
  }
})

let VPlaylistDetail = React.createClass({
  mixins: [mixins.History, mixins.Routing],
  propTypes: {
    className: React.PropTypes.string,
    name: React.PropTypes.string,
    songs: React.PropTypes.array
  },

  gotoNowPlaying () {
    this.transitionToWithHistory('application/main/now-playing', {}, 'view-transition-show-from-right')
  },

  playPlaylist () {
    let { songs } = this.props

    this.transitionToWithHistory('application/main/now-playing', { songs }, 'view-transition-show-from-right')
  },

  render () {
    let { className, name } = this.props

    return (
      <div className={className}>
        <Header.Proxy title={name} primaryOnTap={this.gotoPreviousView} secondary='Now Playing' secondaryOnTap={this.gotoNowPlaying} />

        <div className='list-item'>
          <button onClick={this.playPlaylist}>Play '{name}' playlist</button>
        </div>
      </div>
    )
  }
})

let VPlaylistList = React.createClass({
  mixins: [mixins.Routing],
  propTypes: {
    className: React.PropTypes.string
  },

  gotoDetail (playlist) {
    this.transitionToLocalWithHistory('detail', playlist, 'view-transition-show-from-right')
  },

  gotoNowPlaying () {
    this.transitionToWithHistory('application/main/now-playing', {}, 'view-transition-show-from-right')
  },

  render () {
    let { className } = this.props
    let playlists = DATA.playlists
    let playlistsDom = playlists.map((playlist, i) => {
      return (
        <button key={'playlist' + i} onClick={this.gotoDetail.bind(this, playlist)} >{playlist.name}</button>
      )
    })

    return (
      <div className={className}>
        <Header.Proxy title='Playlists' secondary='Now Playing' secondaryOnTap={this.gotoNowPlaying} />

        <div className='list-item'>
          {playlistsDom}
        </div>
      </div>
    )
  }
})

let VPlaylists = React.createClass({
  propTypes: {
    className: React.PropTypes.string
  },

  render () {
    let { className } = this.props
    let otherProps = blacklist(this.props, 'className')

    return (
      <div className={className}>
        <ViewController name='playlists' defaultPath='/list' { ... otherProps }>
          <View name='list' component={VPlaylistList} />
          <View name='detail' component={VPlaylistDetail} />
        </ViewController>
      </div>
    )
  }
})

let VSongs = React.createClass({
  mixins: [mixins.Routing],
  propTypes: {
    className: React.PropTypes.string
  },

  getInitialState () {
    return {
      songs: DATA.songs
    }
  },

  gotoNowPlaying () {
    this.transitionToWithHistory('application/main/now-playing', {}, 'view-transition-show-from-right')
  },

  playShuffledSongs () {
    let { songs } = this.state

    this.transitionToWithHistory('application/main/now-playing', { songs: shuffle(songs) }, 'view-transition-show-from-right')
  },

  render () {
    let { className } = this.props

    return (
      <div className={className}>
        <Header.Proxy title='Songs' secondary='Now Playing' secondaryOnTap={this.gotoNowPlaying} />

        <div className='list-item'>
          <button onClick={this.playShuffledSongs}>Shuffle play</button>
        </div>
      </div>
    )
  }
})

let VBrowser = React.createClass({
  mixins: [mixins.Routing],
  propTypes: {
    className: React.PropTypes.string,
    currentPath: React.PropTypes.string
  },

  getDefaultProps () {
    return {
      currentPath: ''
    }
  },

  onTabSelect (value) {
    if (value === 'about') {
      return this.transitionToWithHistory('application/about/menu', {}, 'view-transition-show-from-right')
    }

    this.transitionToLocal('browser/' + value, {}, 'view-transition-fade')
  },

  render () {
    let { className, currentPath } = this.props

    let selectedTab = currentPath.split('/')[1]
    if (!selectedTab) selectedTab = 'songs'

    let otherProps = blacklist(this.props, 'className')

    return (
      <div className={className}>
        <ViewController name='browser' defaultPath={'/' + selectedTab} {... otherProps} >
          <View name='latest' component={VLatest} />
          <View name='artists' component={VArtists} />
          <View name='playlists' component={VPlaylists} />
          <View name='songs' component={VSongs} />
        </ViewController>

        <div className='Footer'>
          <button
            className={selectedTab === 'about' && 'is-selected'}
            onClick={this.onTabSelect.bind(this, 'about')} >

            About
          </button>

          <button
            className={selectedTab === 'latest' && 'is-selected'}
            onClick={this.onTabSelect.bind(this, 'latest')} >

            Latest
          </button>

          <button
            className={selectedTab === 'artists' && 'is-selected'}
            onClick={this.onTabSelect.bind(this, 'artists')} >

            Artists
          </button>

          <button
            className={selectedTab === 'playlists' && 'is-selected'}
            onClick={this.onTabSelect.bind(this, 'playlists')} >

            Playlists
          </button>

          <button
            className={selectedTab === 'songs' && 'is-selected'}
            onClick={this.onTabSelect.bind(this, 'songs')} >

            Songs
          </button>
        </div>
      </div>
    )
  }
})

let VNowPlaying = React.createClass({
  mixins: [mixins.History, mixins.Routing, Timers],
  propTypes: {
    className: React.PropTypes.string,
    songs: React.PropTypes.array
  },

  getDefaultProps () {
    return { songs: [] }
  },

  getInitialState () {
    let { songs } = this.props
    if (!songs.length) songs = lastPlaying

    return {
      playing: songs[0],
      remaining: songs.slice(1),
      time: 0
    }
  },

  componentDidMount () {
    // FIXME
//     this.setInterval(() => {
//       this.setState({
//         time: this.state.time + 1
//       })
//     }, 1000)

    let { songs } = this.props

    if (songs.length) {
      lastPlaying = songs
    }
  },

  render () {
    let { className } = this.props
    let { playing, remaining } = this.state

    let unplayed = remaining.map((song, i) => {
      return <p key={'queued' + i} className='queued'>{song}</p>
    })

    return (
      <div className={className}>
        <Header.Proxy title='Now playing' primaryOnTap={this.gotoPreviousView} />

        <p className='playing'>{playing}</p>
        <div className='list-item'>
          {unplayed}
        </div>
      </div>
    )
  }
})

let VMain = React.createClass({
  mixins: [Header.Controller],
  propTypes: {
    className: React.PropTypes.string
  },

  render () {
    let { className } = this.props
    let otherProps = blacklist(this.props, 'className')

    return (
      <div className={className}>
        <Header { ... this.state.headerProps } />
        <ViewController name='main' defaultPath='/browser' {... otherProps}>
          <View name='browser' component={VBrowser} />
          <View name='now-playing' component={VNowPlaying} />
        </ViewController>
      </div>
    )
  }
})

// The app
let App = React.createClass({
  childContextTypes: { viewController: React.PropTypes.object.isRequired },
  getChildContext () { return { viewController: this } },
  getPath () { return '' },

  getInitialState () {
    return {
      currentPath: '/signin'
    }
  },

  transitionTo (path, props, transition) {
    let newState = {}
    if (path) newState.currentPath = path
    if (props) newState.currentViewProps = props
    if (transition) newState.transition = transition

    this.setState(newState)
  },

  render () {
    console.info('Application path:', this.state.currentPath)

    return (
      <ViewController name='application' defaultPath='/error' { ... this.state } >
        <View name='about' component={VAbout} />
        <View name='error' component={VError} />
        <View name='main' component={VMain} />
        <View name='signin' component={VSignin} />
      </ViewController>
    )
  }
})

// Start-up
function startApp () {
  React.render(<App />, document.getElementById('app'))
}

// native? wait for deviceready
if (window.cordova) {
  document.addEventListener('deviceready', startApp, false)

// browser, start asap
} else {
  startApp()
}
