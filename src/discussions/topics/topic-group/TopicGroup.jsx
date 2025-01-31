import React from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { Routes } from '../../../data/constants';
import { discussionsPath } from '../../utils';
import { selectTopicFilter, selectTopicsById } from '../data/selectors';
import Topic from './topic/Topic';

function TopicGroup({
  sequence,
}) {
  const { courseId } = useParams();
  const topicsIds = sequence.topics;
  const topics = useSelector(selectTopicsById(topicsIds));
  const filter = useSelector(selectTopicFilter);
  const hasTopics = topics.length > 0;
  const matchesFilter = filter
    ? sequence.displayName?.toLowerCase()
      .includes(filter)
    : true;
  const topicElements = topics.filter(
    topic => (
      filter
        ? topic.name.toLowerCase()
          .includes(filter)
        : true
    ),
  )
    .map(topic => (<Topic topic={topic} key={topic.id} />));
  const hasFilteredSubtopics = (topicElements.length > 0);
  if (!hasTopics || (!matchesFilter && !hasFilteredSubtopics)) {
    return null;
  }

  return (
    <div
      className="discussion-topic-group d-flex flex-column"
      data-topic-id={sequence.id}
      data-testid="topic-group"
    >
      <Link
        className="topic-name list-group-item p-4 text-primary-500"
        to={discussionsPath(Routes.TOPICS.CATEGORY, {
          courseId,
          category: sequence.id,
        })}
      >
        {sequence.displayName}
      </Link>
      {topicElements}
    </div>
  );
}

TopicGroup.propTypes = {
  sequence: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    topics: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default TopicGroup;
