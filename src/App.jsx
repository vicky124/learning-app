import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import GenericTopicPage from './pages/GenericTopicPage.jsx'

import JsxBasics from './pages/basics/JsxBasics.jsx'
import ComponentsProps from './pages/basics/ComponentsProps.jsx'
import StateHooks from './pages/basics/StateHooks.jsx'
import EventHandling from './pages/basics/EventHandling.jsx'
import ConditionalRendering from './pages/basics/ConditionalRendering.jsx'
import ListsAndKeys from './pages/basics/ListsAndKeys.jsx'
import FormsControlled from './pages/basics/FormsControlled.jsx'

import EffectsLifecycle from './pages/intermediate/EffectsLifecycle.jsx'
import RefsDom from './pages/intermediate/RefsDom.jsx'
import ContextApi from './pages/intermediate/ContextApi.jsx'
import ReducerState from './pages/intermediate/ReducerState.jsx'
import CustomHooks from './pages/intermediate/CustomHooks.jsx'
import FragmentsStrict from './pages/intermediate/FragmentsStrict.jsx'

import Performance from './pages/advanced/Performance.jsx'
import HOC from './pages/advanced/HOC.jsx'
import RenderProps from './pages/advanced/RenderProps.jsx'
import ErrorBoundaries from './pages/advanced/ErrorBoundaries.jsx'
import Portals from './pages/advanced/Portals.jsx'
import ForwardRefImperative from './pages/advanced/ForwardRefImperative.jsx'
import CodeSplitting from './pages/advanced/CodeSplitting.jsx'
import DataFetching from './pages/advanced/DataFetching.jsx'
import RoutingDeepDive from './pages/advanced/RoutingDeepDive.jsx'

import GlobalStateReducerContext from './pages/expert/GlobalStateReducerContext.jsx'
import ConcurrentFeatures from './pages/expert/ConcurrentFeatures.jsx'
import React19Features from './pages/expert/React19Features.jsx'
import CustomHookLibrary from './pages/expert/CustomHookLibrary.jsx'
import CapstoneTodoApp from './pages/expert/CapstoneTodoApp.jsx'

export default function App() {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div style={{ padding: '2rem' }}>
          <h1>Something went wrong</h1>
          <p>{error.message}</p>
        </div>
      )}
    >
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />

            <Route path="/basics/jsx" element={<JsxBasics />} />
            <Route path="/basics/components-props" element={<ComponentsProps />} />
            <Route path="/basics/state" element={<StateHooks />} />
            <Route path="/basics/events" element={<EventHandling />} />
            <Route path="/basics/conditional-rendering" element={<ConditionalRendering />} />
            <Route path="/basics/lists-keys" element={<ListsAndKeys />} />
            <Route path="/basics/forms" element={<FormsControlled />} />

            <Route path="/intermediate/effects" element={<EffectsLifecycle />} />
            <Route path="/intermediate/refs" element={<RefsDom />} />
            <Route path="/intermediate/context" element={<ContextApi />} />
            <Route path="/intermediate/reducer" element={<ReducerState />} />
            <Route path="/intermediate/custom-hooks" element={<CustomHooks />} />
            <Route path="/intermediate/fragments" element={<FragmentsStrict />} />

            <Route path="/advanced/performance" element={<Performance />} />
            <Route path="/advanced/hoc" element={<HOC />} />
            <Route path="/advanced/render-props" element={<RenderProps />} />
            <Route path="/advanced/error-boundaries" element={<ErrorBoundaries />} />
            <Route path="/advanced/portals" element={<Portals />} />
            <Route path="/advanced/forward-ref" element={<ForwardRefImperative />} />
            <Route path="/advanced/code-splitting" element={<CodeSplitting />} />
            <Route path="/advanced/data-fetching" element={<DataFetching />} />
            <Route path="/advanced/routing/*" element={<RoutingDeepDive />} />

            <Route path="/expert/global-state" element={<GlobalStateReducerContext />} />
            <Route path="/expert/concurrent" element={<ConcurrentFeatures />} />
            <Route path="/expert/react19" element={<React19Features />} />
            <Route path="/expert/hook-library" element={<CustomHookLibrary />} />
            <Route path="/expert/capstone" element={<CapstoneTodoApp />} />

            {/* Every content-driven subject (Python, Git, LLD, ...) shares this
                one generic route — see GenericTopicPage + src/content/*.js. */}
            <Route path="/:groupId/:topicId" element={<GenericTopicPage />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
