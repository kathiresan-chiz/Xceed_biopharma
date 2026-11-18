import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import Preloader from './components/Preloader.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import PageTransition from './components/PageTransition.jsx'
import Home from './pages/Home.jsx'
import { Team } from './pages/About.jsx'
import Vision from './pages/vision/Vision.jsx'
import Mission from './pages/mission/Mission.jsx'
import Gsi from './pages/gsi/Gsi.jsx'
import Ksm from './pages/ksm/Ksm.jsx'
import Biopavilion from './pages/biopavilion/Biopavilion.jsx'
import Project from './pages/Project.jsx'
import Insights from './pages/Insights.jsx'
import Collaborate from './pages/Collaborate.jsx'
import Legal from './pages/Legal.jsx'
import NotFound from './pages/NotFound.jsx'
import { initSmoothScroll, lockScroll, ScrollTrigger } from './lib/scroll.js'
import { ReadyContext } from './lib/ready.js'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initSmoothScroll()
  }, [])

  useEffect(() => {
    lockScroll(loading)
    if (!loading) ScrollTrigger.refresh()
  }, [loading])

  return (
    <ReadyContext.Provider value={!loading}>
      {loading && <Preloader onFinish={() => setLoading(false)} />}

      <Navbar ready={!loading} />

      <PageTransition>
        {(location) => (
          <>
            <main id="top">
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/mission" element={<Mission />} />
                <Route path="/vision" element={<Vision />} />
                <Route path="/team" element={<Team />} />
                <Route path="/projects/gsi-cdmo" element={<Gsi />} />
                <Route path="/projects/ksm-api" element={<Ksm />} />
                <Route path="/projects/biopavilion" element={<Biopavilion />} />
                <Route path="/projects/:slug" element={<Project />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/collaborate" element={<Collaborate />} />
                <Route path="/privacy-policy" element={<Legal title="Privacy Policy" />} />
                <Route path="/cookies-policy" element={<Legal title="Cookies Policy" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </>
        )}
      </PageTransition>
    </ReadyContext.Provider>
  )
}

export default App
