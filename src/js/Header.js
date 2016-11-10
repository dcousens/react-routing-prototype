let React = require('react')
// let CSSTransitionGroup = React.addons.CSSTransitionGroup

module.exports = React.createClass({
  propTypes: {
    primary: React.PropTypes.string,
    primaryOnTap: React.PropTypes.func,
    secondary: React.PropTypes.string,
    secondaryOnTap: React.PropTypes.func,
    title: React.PropTypes.string,
    transitionName: React.PropTypes.string
  },

  getDefaultProps () {
    return {
      primary: '',
      secondary: '',
      title: ''
    }
  },

  render () {
    let {
      primary,
      primaryOnTap,
      secondary,
      secondaryOnTap,
      title
    } = this.props

    if (primaryOnTap) {
      primary = <button onClick={primaryOnTap}>
        {primary || '<'}
      </button>
    } else {
      primary = <div className='Header__text'>
        {primary}
      </div>
    }

    if (secondaryOnTap) {
      secondary = <button onClick={secondaryOnTap}>
        {secondary || ':'}
      </button>
    } else {
      secondary = <div className='Header__text'>
        {secondary}
      </div>
    }

    return (
      <div className='Header'>
        <div className='Header__group Header__button'>
          {primary}
        </div>

        <div className='Header__group'>
          <div className='Header__text'>
            {title}
          </div>
        </div>

        <div className='Header__group Header__button'>
          {secondary}
        </div>
      </div>
    )
  }
})

module.exports.Controller = {
  childContextTypes: { header: React.PropTypes.object },

  getInitialState () {
    return {
      headerProps: {}
    }
  },

  getChildContext () {
    return {
      header: {
        update: (headerProps) => {
          let { headerProps: oldHeaderProps } = this.state
          if (JSON.stringify(oldHeaderProps) === JSON.stringify(headerProps)) return

          this.setState({ headerProps })
        }
      }
    }
  }
}

module.exports.Proxy = React.createClass({
  contextTypes: {
    header: React.PropTypes.object.isRequired
  },

  componentDidMount () {
    this.context.header.update(this.props)
  },

  componentWillReceiveProps (newProps) {
    this.context.header.update(newProps)
  },

  render () { return null }
})
