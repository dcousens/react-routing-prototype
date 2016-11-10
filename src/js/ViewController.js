let React = require('react')
let classnames = require('classnames')

let ViewController = React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    children: React.PropTypes.node.isRequired,
    currentPath: React.PropTypes.string,
    currentViewProps: React.PropTypes.object,
    defaultPath: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    transition: React.PropTypes.string
  },

  contextTypes: { viewController: React.PropTypes.object },
  childContextTypes: { viewController: React.PropTypes.object.isRequired },
  getChildContext () { return { viewController: this } },

  getDefaultProps () {
    return {
      currentPath: '',
      transition: 'view-transition-instant'
    }
  },

  componentDidMount () { this.verifyPath(this.props) },
  componentWillReceiveProps (newProps) { this.verifyPath(newProps) },
  verifyPath (props) {
    let { currentPath, name } = props
    let splitPath = currentPath.split('/')
    let firstLevel = splitPath[0]

    if (firstLevel !== '' && firstLevel !== name) {
      console.warn('Unknown path', currentPath)
    }
  },

  getPath () {
    let basePath = ''

    if (this.context.viewController) {
      basePath += this.context.viewController.getPath()
    }

    if (basePath) {
      basePath += '/'
    }

    return basePath + this.props.name
  },

  transitionTo (... args) {
    if (this.context.viewController) {
      this.context.viewController.transitionTo(... args)
    }
  },

  find (viewName) {
    let found = null

    React.Children.forEach(this.props.children, (child, i) => {
      if (found) return
      if (viewName !== child.props.name) return

      found = child
    })

    return found
  },

  renderPath (path, pathProps, transition) {
    let { defaultPath, name } = this.props
    let splitPath = path.split('/')
    let targetViewName = splitPath[1]
    let remainingPath = splitPath.slice(1).join('/')
    let foundTarget = this.find(targetViewName)

    if (!targetViewName || !foundTarget) {
      return this.renderPath(defaultPath, pathProps, transition)
    }

    let targetViewProps

    // keep on passing through?
    if (targetViewName !== remainingPath) {
      targetViewProps = {
        currentPath: remainingPath,
        currentViewProps: pathProps,
        transition: transition
      }

    // assume we reached final node
    } else {
      targetViewProps = pathProps
    }

    let toRender = React.cloneElement(foundTarget, {
      key: targetViewName,
      viewProps: targetViewProps
    })

    let transitionClassName = classnames('ViewController', 'ViewController--' + name)

    return (
//       <CSSTransitionGroup className={transitionClassName} transitionName={transition} component='div'>
      <div className={transitionClassName}>{toRender}</div>
//       </CSSTransitionGroup>
    )
  },

  render () {
    let {
      currentPath,
      currentViewProps,
      transition
    } = this.props

    return this.renderPath(currentPath, currentViewProps, transition)
  }
})

module.exports = ViewController
