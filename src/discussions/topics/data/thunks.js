/* eslint-disable import/prefer-default-export */
import { camelCaseObject } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';

import { getCourseTopics } from './api';
import { fetchCourseTopicsFailed, fetchCourseTopicsRequest, fetchCourseTopicsSuccess } from './slices';

function normaliseTopics(data) {
  const topicsInCategory = {};
  const topics = {};
  const categoryIds = [];
  data.coursewareTopics.forEach(category => {
    topicsInCategory[category.name] = category.children.map(topic => {
      topics[topic.id] = {
        categoryId: category.name, ...topic,
      };
      return topic.id;
    });
    categoryIds.push(category.name);
  });
  const nonCoursewareIds = data.nonCoursewareTopics.map(topic => {
    topics[topic.id] = topic;
    return topic.id;
  });
  return {
    categoryIds, topicsInCategory, topics, nonCoursewareIds,
  };
}

export function fetchCourseTopics(courseId) {
  return async (dispatch) => {
    try {
      dispatch(fetchCourseTopicsRequest({ courseId }));
      const data = await getCourseTopics(courseId);
      dispatch(fetchCourseTopicsSuccess(normaliseTopics(camelCaseObject(data))));
    } catch (error) {
      dispatch(fetchCourseTopicsFailed());
      logError(error);
    }
  };
}
