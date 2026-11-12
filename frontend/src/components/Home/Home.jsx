import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="card">
      <h2>Welcome to the Cars Dealership Review Application</h2>
      <p>
        Find car dealerships across the country, read honest customer
        reviews with automatic sentiment detection, and share your own
        experience after a purchase or service visit.
      </p>
      <p>
        <Link to="/dealers">Browse all dealers &rarr;</Link>
      </p>
    </div>
  )
}
