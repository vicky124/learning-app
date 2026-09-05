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
import ControlledUncontrolled from './pages/basics/ControlledUncontrolled.jsx'

import EffectsLifecycle from './pages/intermediate/EffectsLifecycle.jsx'
import RefsDom from './pages/intermediate/RefsDom.jsx'
import ContextApi from './pages/intermediate/ContextApi.jsx'
import ReducerState from './pages/intermediate/ReducerState.jsx'
import CustomHooks from './pages/intermediate/CustomHooks.jsx'
import FragmentsStrict from './pages/intermediate/FragmentsStrict.jsx'
import Accessibility from './pages/intermediate/Accessibility.jsx'

import Performance from './pages/advanced/Performance.jsx'
import HOC from './pages/advanced/HOC.jsx'
import RenderProps from './pages/advanced/RenderProps.jsx'
import ErrorBoundaries from './pages/advanced/ErrorBoundaries.jsx'
import Portals from './pages/advanced/Portals.jsx'
import ForwardRefImperative from './pages/advanced/ForwardRefImperative.jsx'
import CodeSplitting from './pages/advanced/CodeSplitting.jsx'
import DataFetching from './pages/advanced/DataFetching.jsx'
import RoutingDeepDive from './pages/advanced/RoutingDeepDive.jsx'
import Testing from './pages/advanced/Testing.jsx'
import Animation from './pages/advanced/Animation.jsx'
import SuspenseBoundaries from './pages/advanced/SuspenseBoundaries.jsx'

import GlobalStateReducerContext from './pages/expert/GlobalStateReducerContext.jsx'
import ConcurrentFeatures from './pages/expert/ConcurrentFeatures.jsx'
import React19Features from './pages/expert/React19Features.jsx'
import CustomHookLibrary from './pages/expert/CustomHookLibrary.jsx'
import CapstoneTodoApp from './pages/expert/CapstoneTodoApp.jsx'
import DevToolsProfiler from './pages/expert/DevToolsProfiler.jsx'

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

            <Route path="/react-guide/jsx" element={<JsxBasics />} />
            <Route path="/react-guide/components-props" element={<ComponentsProps />} />
            <Route path="/react-guide/state" element={<StateHooks />} />
            <Route path="/react-guide/events" element={<EventHandling />} />
            <Route path="/react-guide/conditional-rendering" element={<ConditionalRendering />} />
            <Route path="/react-guide/lists-keys" element={<ListsAndKeys />} />
            <Route path="/react-guide/forms" element={<FormsControlled />} />
            <Route path="/react-guide/controlled-uncontrolled" element={<ControlledUncontrolled />} />

            <Route path="/react-guide/effects" element={<EffectsLifecycle />} />
            <Route path="/react-guide/refs" element={<RefsDom />} />
            <Route path="/react-guide/context" element={<ContextApi />} />
            <Route path="/react-guide/reducer" element={<ReducerState />} />
            <Route path="/react-guide/custom-hooks" element={<CustomHooks />} />
            <Route path="/react-guide/fragments" element={<FragmentsStrict />} />
            <Route path="/react-guide/a11y" element={<Accessibility />} />

            <Route path="/react-guide/performance" element={<Performance />} />
            <Route path="/react-guide/hoc" element={<HOC />} />
            <Route path="/react-guide/render-props" element={<RenderProps />} />
            <Route path="/react-guide/error-boundaries" element={<ErrorBoundaries />} />
            <Route path="/react-guide/portals" element={<Portals />} />
            <Route path="/react-guide/forward-ref" element={<ForwardRefImperative />} />
            <Route path="/react-guide/code-splitting" element={<CodeSplitting />} />
            <Route path="/react-guide/data-fetching" element={<DataFetching />} />
            <Route path="/react-guide/routing/*" element={<RoutingDeepDive />} />
            <Route path="/react-guide/testing" element={<Testing />} />
            <Route path="/react-guide/animation" element={<Animation />} />
            <Route path="/react-guide/suspense-boundaries" element={<SuspenseBoundaries />} />

            <Route path="/react-guide/global-state" element={<GlobalStateReducerContext />} />
            <Route path="/react-guide/concurrent" element={<ConcurrentFeatures />} />
            <Route path="/react-guide/react19" element={<React19Features />} />
            <Route path="/react-guide/hook-library" element={<CustomHookLibrary />} />
            <Route path="/react-guide/capstone" element={<CapstoneTodoApp />} />
            <Route path="/react-guide/devtools-profiler" element={<DevToolsProfiler />} />

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
