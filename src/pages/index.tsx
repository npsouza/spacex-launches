import Launch from '@/components/Launch';
import axios from 'axios';
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'

interface ILaunch {
  name: string;
  id: string;
  details: string;
  rocket: string;
  date_utc: string;
}

export default function Home() {
  const [nextLaunch, setNextLaunch] = useState<ILaunch | null>(null)

  const [lastLaunch, setLastLaunch] = useState<ILaunch | null>(null)

  const [pastLaunches, setPastLaunches] = useState(null)

  const [upcomingLaunches, setUpcomingLaunches] = useState<ILaunch[]>([])
  const [showUpcomingLaunches, setShowUpcomingLaunches] = useState(false)

  const fetchNextLaunch = useCallback(
    async () => {
      const {data} = await axios.get('/api/launches/next')

      setNextLaunch(data)
    },
    [],
  )

  const fetchUpcomingLaunches = useCallback(
    async () => {
      const {data:{docs}} = await axios.get('/api/launches/upcoming')

      setUpcomingLaunches(docs)
    },
    [],
  )

  const fetchLastLaunch = useCallback(
    async () => {
      const {data} = await axios.get('/api/launches/latest')

      setLastLaunch(data)
    },
    [],
  )

  useEffect(() => {
    fetchNextLaunch()
    fetchUpcomingLaunches()
    fetchLastLaunch()
  }, [])

  return (
    <main className="container">
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
        <title>SpaceX Launches | by @nathanopereira</title>
      </Head>

      <div className="row">
        <header className="col-12 header-page">
          <h1 className="text-white text-center my-5">
            <img src="/spacex.svg" title="SpaceX" alt="SpaceX"/>
            <span className="d-block">Launches</span>
          </h1>
        </header>

        {upcomingLaunches.length > 0 && !showUpcomingLaunches && (
          <div className="col-12 col-md-10 mx-auto">
            <button type="button" onClick={() => setShowUpcomingLaunches(true)} className="button-show-upcoming" title="See upcoming launches">
              Upcoming Launches
            </button>
          </div>
        )}

        {upcomingLaunches.length > 0 && showUpcomingLaunches && (
          <div className="col-12 col-md-10 mx-auto">
            {upcomingLaunches.map(upcoming => (
              <Launch key={upcoming.id} data={upcoming} type="upcoming" />
            ))}
          </div>
        )}

        {nextLaunch && (
          <div className="col-12 col-md-11 mx-auto">
            <Launch data={nextLaunch} type="next" />
          </div>
        )}

        <div className="col-12 col-md-10 mx-auto">
          {lastLaunch && (
            <Launch data={lastLaunch} type="latest" />
          )}

          <article className="launch is-past">
            <div className="rocket">
              <div className="rocket-name">
                <span>Rocket</span>
                <strong className="highlight">Falcon 9</strong>
              </div>
            </div>
            <div className="launch-details">
              <div className="launch-details-header">
                <div className="launch-name">
                  <span>Name</span>
                  <h2 className="highlight">CRS-22</h2>
                </div>
                <div className="launch-date">
                  <span>Date</span>
                  <strong className="highlight">03/06/2021 - 17:29:00</strong>
                </div>
              </div>
              <p className="launch-details-description">
                SpaceX's 22nd ISS resupply mission on behalf of NASA, this mission sends essential supplies to the International Space Station using the cargo variant of SpaceX's Dragon 2 spacecraft. The external payload for this mission is the first pair of ISS Roll Out Solar Arrays. Falcon 9 and Dragon launch from LC-39A, Kennedy Space Center and the booster is expected to land on an ASDS. The mission will be complete with splashdown and recovery of the capsule and down cargo.
              </p>
            </div>
          </article>

          <button type="button" className="button-show-more-launches" title="See more launches">
            See more launches
          </button>
        </div>
      </div>

      <footer className="text-center text-muted py-4 mt-5">
        <small>by <a target="_blank" href="https://github.com/nathanopereira/spacex-launches">nathanopereira</a> using <a target="_blank" href="https://github.com/r-spacex/SpaceX-API">SpaceX API</a></small>
      </footer>
    </main>
  )
}
