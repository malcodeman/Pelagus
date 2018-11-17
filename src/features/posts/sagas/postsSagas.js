import { call, put, takeLatest } from "redux-saga/effects";

import axios from "../../../core/http/axiosInstance";

import {
  GET_POSTS_FAILURE,
  GET_POSTS_REQUEST,
  GET_POSTS_SUCCESS,
  GET_POPULAR_SUBS_FAILURE,
  GET_POPULAR_SUBS_REQUEST,
  GET_POPULAR_SUBS_SUCCESS,
  SEARCH_POSTS_REQUEST,
  SEARCH_POSTS_SUCCESS
} from "../actions/postsActionTypes";

const get = subreddit => {
  return axios.get(`/subs/${subreddit}`);
};

const getWithAfter = (subreddit, after) => {
  return axios.get(`/subs/${subreddit}?after=${after}`);
};

const getPopular = () => {
  return axios.get(`/popular`);
};

function* getSubreddit(action) {
  try {
    const { subreddit } = action.payload;
    const afterRequest = action.payload.after;
    if (afterRequest) {
      const data = yield call(getWithAfter, subreddit, afterRequest);
      const posts = data.data.posts;
      const after = data.data.after;
      yield put({ type: GET_POSTS_SUCCESS, payload: { posts, after } });
      return;
    }
    const data = yield call(get, subreddit);
    const posts = data.data.posts;
    const after = data.data.after;
    yield put({ type: GET_POSTS_SUCCESS, payload: { posts, after } });
  } catch (error) {
    yield put({ type: GET_POSTS_FAILURE, error });
  }
}

function* searchSubreddit(action) {
  const { setSubmitting } = action.meta;
  try {
    const { subreddit } = action.payload;
    const data = yield call(get, subreddit);
    const posts = data.data.posts;
    const after = data.data.after;
    yield put({ type: SEARCH_POSTS_SUCCESS, payload: { posts, after } });
    setSubmitting(false);
  } catch (error) {
    yield put({ type: GET_POSTS_FAILURE, error });
    setSubmitting(false);
  }
}

function* getPopularSubreddits(action) {
  try {
    const data = yield call(getPopular);

    yield put({ type: GET_POPULAR_SUBS_SUCCESS, payload: data.data.subs });
  } catch (error) {
    yield put({ type: GET_POPULAR_SUBS_FAILURE, error });
  }
}

const saga = function*() {
  yield takeLatest(GET_POSTS_REQUEST, getSubreddit);
  yield takeLatest(GET_POPULAR_SUBS_REQUEST, getPopularSubreddits);
  yield takeLatest(SEARCH_POSTS_REQUEST, searchSubreddit);
};

export default saga;
