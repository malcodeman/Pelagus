import {
  GET_POSTS_SUCCESS,
  GET_POPULAR_SUBS_SUCCESS,
  GET_POSTS_REQUEST,
  SEARCH_POSTS_REQUEST,
  SEARCH_POSTS_SUCCESS,
  CHANGE_FILTER
} from "../actions/postsActionTypes";

const initialState = {
  posts: [],
  subreddit: "popular",
  popularSubs: null,
  fetching: false,
  after: null,
  sort: "hot",
  time: "day"
};

export default (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case GET_POSTS_SUCCESS:
      return {
        ...state,
        posts: [...state.posts, ...action.payload.posts],
        after: action.payload.after,
        fetching: false
      };
    case SEARCH_POSTS_SUCCESS:
      return {
        ...state,
        posts: action.payload.posts,
        after: action.payload.after,
        fetching: false
      };
    case GET_POPULAR_SUBS_SUCCESS:
      return {
        ...state,
        popularSubs: action.payload
      };
    case SEARCH_POSTS_REQUEST:
      return {
        ...state,
        fetching: true,
        subreddit: action.payload.subreddit
      };
    case GET_POSTS_REQUEST:
      return {
        ...state,
        fetching: true,
        subreddit: action.payload.subreddit
      };
    case CHANGE_FILTER:
      return {
        ...state,
        sort: action.payload.sort,
        time: action.payload.time
      };
    default:
      return state;
  }
};