import { Link } from 'react-router-dom'
import { usePageTitle } from '../lib/usePageTitle'

export function NotFoundPage() {
  usePageTitle('Page not found')
  return (
    <section className="page-head">
      <div className="wrap">
        <p className="label">404</p>
        <h1>This page isn’t here.</h1>
        <p><Link className="text-link" to="/">Back to the homepage</Link></p>
      </div>
    </section>
  )
}
