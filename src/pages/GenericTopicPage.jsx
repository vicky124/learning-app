import { useParams } from 'react-router-dom'
import TopicPage from '../components/TopicPage.jsx'
import ContentBlocks from '../components/ContentBlocks.jsx'
import QAAccordion from '../components/QAAccordion.jsx'
import NotFound from './NotFound.jsx'
import { findContentTopic } from '../data/topics.js'

/**
 * Renders every non-React lesson (Python, Git, LLD, ...): a content-driven
 * article or a Q&A list, looked up by route params from the same
 * menuSections tree that drives the sidebar. React's own lessons keep
 * their hand-built interactive page components instead of going through
 * this generic path — see App.jsx.
 */
export default function GenericTopicPage() {
  const { groupId, topicId } = useParams()
  const found = findContentTopic(groupId, topicId)

  if (!found) return <NotFound />

  const { topic, group, section } = found
  const level = topic.qa ? 'qa' : 'guide'

  return (
    <TopicPage
      groupId={group.id}
      topicId={topic.id}
      level={level}
      title={topic.title}
      summary={topic.summary}
      keyPoints={topic.keyPoints}
    >
      <div className="demo-section">
        <span className="pill">{section.label}</span>
        {topic.qa ? <QAAccordion qa={topic.qa} /> : <ContentBlocks blocks={topic.blocks} />}
      </div>
    </TopicPage>
  )
}
