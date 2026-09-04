import { Component } from 'react'

/**
 * Error boundaries must currently be class components — there is no hook
 * equivalent of getDerivedStateFromError / componentDidCatch. They catch
 * render-time errors thrown by their descendants and render a fallback
 * instead of unmounting the whole app.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // In a real app: report to an error-tracking service (Sentry, etc).
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, () => this.setState({ error: null }))
    }
    return this.props.children
  }
}
